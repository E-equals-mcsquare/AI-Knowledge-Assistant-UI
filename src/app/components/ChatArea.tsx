import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";
import { Message } from "./ChatInterface";
import { ScrollArea } from "./ui/scroll-area";
import { SourceTag } from "./SourceTag";

interface ChatAreaProps {
  messages: Message[];
  isAiTyping: boolean;
}

export function ChatArea({ messages, isAiTyping }: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div ref={scrollRef} className="max-w-4xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                How can I help you today?
              </h2>
              <p className="text-gray-600 max-w-md">
                Ask questions about your engineering documentation and I'll provide
                answers based on your uploaded knowledge base.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.type === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === "user"
                        ? "bg-gray-700"
                        : "bg-gradient-to-br from-blue-500 to-blue-600"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`flex-1 max-w-2xl ${
                      message.type === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.type === "user"
                          ? "bg-gray-700 text-white"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>

                    {/* Sources */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.sources.map((source, idx) => (
                          <SourceTag
                            key={idx}
                            title={source.title}
                            page={source.page}
                          />
                        ))}
                      </div>
                    )}

                    {/* Timestamp */}
                    <p
                      className={`text-xs text-gray-500 mt-1 ${
                        message.type === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {/* AI Typing Indicator */}
              {isAiTyping && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 max-w-2xl">
                    <div className="rounded-2xl px-4 py-3 bg-white border border-gray-200">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
