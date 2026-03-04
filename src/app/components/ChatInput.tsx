import { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about your engineering documentation..."
                className="min-h-[56px] max-h-32 resize-none pr-12 py-4 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                rows={1}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 bottom-2 h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
            <Button
              type="submit"
              disabled={!message.trim()}
              className="h-14 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
