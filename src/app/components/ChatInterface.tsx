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
    title: "API Authentication Guide",
    lastMessage: "How do we implement OAuth2?",
    timestamp: new Date(2026, 2, 4, 10, 30),
  },
  {
    id: "2",
    title: "Database Migration Process",
    lastMessage: "What's the rollback procedure?",
    timestamp: new Date(2026, 2, 3, 14, 15),
  },
  {
    id: "3",
    title: "Deployment Pipeline Setup",
    lastMessage: "Explain the CI/CD workflow",
    timestamp: new Date(2026, 2, 2, 9, 45),
  },
  {
    id: "4",
    title: "Error Handling Best Practices",
    lastMessage: "How to handle rate limiting?",
    timestamp: new Date(2026, 2, 1, 16, 20),
  },
];

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "API_Documentation_v2.pdf",
    type: "pdf",
    uploadedAt: new Date(2026, 2, 1),
    size: "2.4 MB",
  },
  {
    id: "2",
    name: "engineering_handbook.pdf",
    type: "pdf",
    uploadedAt: new Date(2026, 1, 28),
    size: "5.1 MB",
  },
  {
    id: "3",
    name: "deployment_guide.md",
    type: "markdown",
    uploadedAt: new Date(2026, 1, 25),
    size: "156 KB",
  },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      type: "user",
      content: "How do we implement OAuth2 authentication in our API?",
      timestamp: new Date(2026, 2, 4, 10, 25),
    },
    {
      id: "2",
      type: "ai",
      content:
        "Based on your API documentation, OAuth2 implementation involves several key steps:\n\n1. **Authorization Endpoint Setup**: Configure the /oauth/authorize endpoint to handle authorization requests. This endpoint should validate client credentials and redirect users to the login page.\n\n2. **Token Generation**: Implement the /oauth/token endpoint to issue access tokens. Use JWT tokens with RS256 signing algorithm for security.\n\n3. **Token Validation**: Create middleware to validate tokens on protected routes. Check token expiry, signature, and scope permissions.\n\n4. **Refresh Token Flow**: Implement refresh token rotation to maintain security while providing seamless user experience.\n\nThe recommended token expiry is 1 hour for access tokens and 30 days for refresh tokens.",
      timestamp: new Date(2026, 2, 4, 10, 26),
      sources: [
        { title: "API_Documentation_v2.pdf", page: 23 },
        { title: "engineering_handbook.pdf", page: 145 },
      ],
    },
    {
      id: "3",
      type: "user",
      content: "What security considerations should we keep in mind?",
      timestamp: new Date(2026, 2, 4, 10, 30),
    },
    {
      id: "4",
      type: "ai",
      content:
        "Key security considerations for OAuth2 implementation:\n\n**Token Security:**\n- Always use HTTPS for all OAuth endpoints\n- Implement token encryption at rest\n- Use secure random generation for tokens\n- Rotate secrets regularly\n\n**Client Authentication:**\n- Validate client credentials on every request\n- Use PKCE (Proof Key for Code Exchange) for public clients\n- Implement rate limiting on authentication endpoints\n\n**Scope Management:**\n- Follow principle of least privilege\n- Implement granular permission scopes\n- Validate scopes on every protected resource access\n\n**Additional Measures:**\n- Log all authentication attempts\n- Implement account lockout after failed attempts\n- Use CORS policies to restrict origin access",
      timestamp: new Date(2026, 2, 4, 10, 31),
      sources: [
        { title: "API_Documentation_v2.pdf", page: 28 },
        { title: "engineering_handbook.pdf", page: 89 },
      ],
    },
  ],
};

export function ChatInterface() {
  const { conversationId } = useParams();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [conversations, setConversations] = useState(mockConversations);
  const [documents, setDocuments] = useState(mockDocuments);
  const [messages, setMessages] = useState<Message[]>(
    conversationId && mockMessages[conversationId] ? mockMessages[conversationId] : []
  );
  const [isAiTyping, setIsAiTyping] = useState(false);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAiTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I understand your question. Based on the documentation in your knowledge base, here's what I found:\n\nThis is a simulated response. In a production environment, this would connect to your AI backend to process the query against your uploaded documents and provide relevant answers with source citations.",
        timestamp: new Date(),
        sources: [
          { title: "API_Documentation_v2.pdf", page: 15 },
          { title: "engineering_handbook.pdf", page: 42 },
        ],
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsAiTyping(false);
    }, 2000);
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleUploadDocuments = (files: File[]) => {
    const newDocs: Document[] = files.map((file) => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      type: file.type,
      uploadedAt: new Date(),
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    }));

    setDocuments((prev) => [...newDocs, ...prev]);
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
