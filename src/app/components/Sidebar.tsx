import { MessageSquare, Plus, Upload, FileText, Bot } from "lucide-react";
import { Conversation, Document } from "./ChatInterface";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface SidebarProps {
  conversations: Conversation[];
  documents: Document[];
  onNewChat: () => void;
  onOpenUploadModal: () => void;
  activeConversationId?: string;
}

export function Sidebar({
  conversations,
  documents,
  onNewChat,
  onOpenUploadModal,
  activeConversationId,
}: SidebarProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-semibold text-gray-900">AI Knowledge Assistant</h1>
        </div>

        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-3">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Recent Conversations
          </h2>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 pb-4">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                to={`/chat/${conversation.id}`}
                className={`block px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors ${
                  activeConversationId === conversation.id ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(conversation.timestamp)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>

        <Separator className="bg-gray-200" />

        {/* Documents Section */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={onOpenUploadModal}
            variant="outline"
            className="w-full justify-start gap-2 border-gray-300 hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </Button>

          <div className="mt-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Knowledge Base ({documents.length})
            </h2>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {documents.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">{doc.size}</p>
                  </div>
                </div>
              ))}
            </div>
            {documents.length > 3 && (
              <button
                onClick={onOpenUploadModal}
                className="text-xs text-blue-600 hover:text-blue-700 mt-2 font-medium"
              >
                View all {documents.length} documents →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
