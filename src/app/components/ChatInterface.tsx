import { useState } from "react";
import { useParams } from "react-router";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { ChatArea } from "./ChatArea";
import { ChatInput } from "./ChatInput";
import { DocumentUploadModal } from "./DocumentUploadModal";

export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  sources?: { title: string; page?: number }[];
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: Date;
  size: string;
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Database Failover & Incident Response",
    lastMessage: "What is the process for handling a P1 incident?",
    timestamp: new Date(2026, 2, 4, 10, 30),
  },
  {
    id: "2",
    title: "Kubernetes Scaling Strategy",
    lastMessage: "What is the scaling strategy in Kubernetes?",
    timestamp: new Date(2026, 2, 3, 14, 15),
  },
  {
    id: "3",
    title: "Failover Runbook Review",
    lastMessage: "How do we handle database failover?",
    timestamp: new Date(2026, 2, 2, 9, 45),
  },
  {
    id: "4",
    title: "P1 Incident Escalation Process",
    lastMessage: "Who gets paged during a P1 incident?",
    timestamp: new Date(2026, 2, 1, 16, 20),
  },
];

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Database_Failover_Guide.pdf",
    type: "pdf",
    uploadedAt: new Date(2026, 2, 1),
    size: "2.4 MB",
  },
  {
    id: "2",
    name: "Incident_Response_Runbook.pdf",
    type: "pdf",
    uploadedAt: new Date(2026, 1, 28),
    size: "5.1 MB",
  },
  {
    id: "3",
    name: "Kubernetes_Deployment_Guide.pdf",
    type: "pdf",
    uploadedAt: new Date(2026, 1, 25),
    size: "3.8 MB",
  },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      type: "user",
      content: "How do we handle database failover?",
      timestamp: new Date(2026, 2, 4, 10, 25),
    },
    {
      id: "2",
      type: "ai",
      content:
        "Based on the Database Failover Guide, here's the process for handling a database failover:\n\n1. **Detect the Failure**: Monitoring alerts trigger when the primary database becomes unreachable. Health checks run every 30 seconds — three consecutive failures initiate the failover sequence.\n\n2. **Promote the Replica**: The standby replica is promoted to primary. This is handled automatically by the failover controller, but can also be triggered manually via the runbook script.\n\n3. **Update Connection Strings**: Application services must point to the new primary. The connection string is managed via environment config — update the `DB_PRIMARY_HOST` variable and restart affected services.\n\n4. **Verify Data Consistency**: Run the integrity check script (`scripts/db-verify.sh`) against the new primary to confirm replication lag was within acceptable limits (< 5 seconds).\n\n5. **Notify Stakeholders**: Send a status update to the #incidents channel and open a post-mortem ticket within 24 hours.",
      timestamp: new Date(2026, 2, 4, 10, 26),
      sources: [
        { title: "Database_Failover_Guide.pdf", page: 7 },
        { title: "Incident_Response_Runbook.pdf", page: 12 },
      ],
    },
    {
      id: "3",
      type: "user",
      content: "What is the scaling strategy in Kubernetes?",
      timestamp: new Date(2026, 2, 4, 10, 30),
    },
    {
      id: "4",
      type: "ai",
      content:
        "According to the Kubernetes Deployment Guide, the scaling strategy is as follows:\n\n**Horizontal Pod Autoscaler (HPA):**\n- All production services use HPA configured to scale between 2 and 20 replicas\n- Scale-up triggers when CPU utilization exceeds 70% or memory exceeds 80%\n- Scale-down has a 5-minute stabilization window to avoid flapping\n\n**Cluster Autoscaler:**\n- Node groups are configured with min/max bounds per environment\n- Nodes are added when pending pods cannot be scheduled\n- Unused nodes are drained and removed after 10 minutes of low utilization\n\n**Vertical Pod Autoscaler (VPA):**\n- Used in recommendation mode only — resource requests are reviewed and updated during each release cycle\n- Never run VPA in auto mode alongside HPA on the same deployment\n\n**Best Practices:**\n- Set both `requests` and `limits` on all containers\n- Use PodDisruptionBudgets to ensure at least one replica stays available during scaling events\n- Prefer spreading replicas across availability zones using `topologySpreadConstraints`",
      timestamp: new Date(2026, 2, 4, 10, 32),
      sources: [
        { title: "Kubernetes_Deployment_Guide.pdf", page: 34 },
        { title: "Kubernetes_Deployment_Guide.pdf", page: 41 },
      ],
    },
    {
      id: "5",
      type: "user",
      content: "What is the process for handling a P1 incident?",
      timestamp: new Date(2026, 2, 4, 10, 38),
    },
    {
      id: "6",
      type: "ai",
      content:
        "The Incident Response Runbook defines the following P1 incident process:\n\n**Definition:** A P1 incident is any outage or degradation that impacts more than 20% of users or causes complete loss of a critical service.\n\n**Immediate Response (first 15 minutes):**\n- The on-call engineer acknowledges the page within 5 minutes\n- Declare the incident in the #incidents Slack channel using `/incident declare`\n- Assign an Incident Commander (IC) — defaults to the on-call lead\n\n**Escalation:**\n- Notify the Engineering Manager and VP of Engineering within 10 minutes\n- Loop in the database or infrastructure team depending on the affected system\n- Open a war room video call and pin the link in #incidents\n\n**Mitigation:**\n- Apply the relevant runbook (failover, rollback, feature flag disable)\n- Post a status update every 15 minutes until resolved\n\n**Resolution & Follow-up:**\n- Mark the incident resolved in PagerDuty\n- Publish an initial post-mortem within 24 hours\n- Complete the full post-mortem within 5 business days",
      timestamp: new Date(2026, 2, 4, 10, 39),
      sources: [
        { title: "Incident_Response_Runbook.pdf", page: 3 },
        { title: "Incident_Response_Runbook.pdf", page: 18 },
      ],
    },
  ],
};

const API_BASE = import.meta.env.VITE_API_BASE;

export function ChatInterface() {
  const { conversationId } = useParams();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [conversations, setConversations] = useState(mockConversations);
  const [documents, setDocuments] = useState(mockDocuments);
  const [messages, setMessages] = useState<Message[]>(
    conversationId && mockMessages[conversationId] ? mockMessages[conversationId] : []
  );
  const [isAiTyping, setIsAiTyping] = useState(false);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAiTyping(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: content }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.answer ?? data.response ?? "No answer returned.",
        timestamp: new Date(),
        sources: data.sources ?? [],
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Failed to get a response: ${err instanceof Error ? err.message : "Unknown error"}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleUploadDocuments = async (files: File[]) => {
    const uploaded: Document[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${API_BASE}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error(`Upload failed for ${file.name}: ${response.status}`);

        uploaded.push({
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type,
          uploadedAt: new Date(),
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        });
      } catch (err) {
        console.error(err);
      }
    }

    if (uploaded.length > 0) {
      setDocuments((prev) => [...uploaded, ...prev]);
    }
    setIsUploadModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        conversations={conversations}
        documents={documents}
        onNewChat={handleNewChat}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        activeConversationId={conversationId}
      />

      <div className="flex-1 flex flex-col">
        <TopBar />
        <ChatArea messages={messages} isAiTyping={isAiTyping} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadDocuments}
        documents={documents}
      />
    </div>
  );
}
