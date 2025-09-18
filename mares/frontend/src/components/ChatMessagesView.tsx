import type React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Copy, CopyCheck } from "lucide-react";
import { InputForm } from "@/components/InputForm";
import { Button } from "@/components/ui/button";
import { useState, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { cn } from "@/utils";
import { Badge } from "@/components/ui/badge";

// Markdown component props type from former ReportView
type MdComponentProps = {
  className?: string;
  children?: ReactNode;
  [key: string]: any;
};

// Markdown components (from former ReportView.tsx)
const mdComponents = {
  h1: ({ className, children, ...props }: MdComponentProps) => (
    <h1 className={cn("text-2xl font-bold mt-4 mb-2", className)} {...props}>
      {children}
    </h1>
  ),
  h2: ({ className, children, ...props }: MdComponentProps) => (
    <h2 className={cn("text-xl font-bold mt-3 mb-2", className)} {...props}>
      {children}
    </h2>
  ),
  h3: ({ className, children, ...props }: MdComponentProps) => (
    <h3 className={cn("text-lg font-bold mt-3 mb-1", className)} {...props}>
      {children}
    </h3>
  ),
  p: ({ className, children, ...props }: MdComponentProps) => (
    <p className={cn("mb-3 leading-7", className)} {...props}>
      {children}
    </p>
  ),
  a: ({ className, children, href, ...props }: MdComponentProps) => (
    <Badge className="text-xs mx-0.5">
      <a
        className={cn("text-blue-400 hover:text-blue-300 text-xs", className)}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    </Badge>
  ),
  ul: ({ className, children, ...props }: MdComponentProps) => (
    <ul className={cn("list-disc pl-6 mb-3", className)} {...props}>
      {children}
    </ul>
  ),
  ol: ({ className, children, ...props }: MdComponentProps) => (
    <ol className={cn("list-decimal pl-6 mb-3", className)} {...props}>
      {children}
    </ol>
  ),
  li: ({ className, children, ...props }: MdComponentProps) => (
    <li className={cn("mb-1", className)} {...props}>
      {children}
    </li>
  ),
  blockquote: ({ className, children, ...props }: MdComponentProps) => (
    <blockquote
      className={cn(
        "border-l-4 border-neutral-600 pl-4 italic my-3 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }: MdComponentProps) => (
    <code
      className={cn(
        "bg-neutral-900 rounded px-1 py-0.5 font-mono text-xs",
        className
      )}
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ className, children, ...props }: MdComponentProps) => (
    <pre
      className={cn(
        "bg-neutral-900 p-3 rounded-lg overflow-x-auto font-mono text-xs my-3",
        className
      )}
      {...props}
    >
      {children}
    </pre>
  ),
  hr: ({ className, ...props }: MdComponentProps) => (
    <hr className={cn("border-neutral-600 my-4", className)} {...props} />
  ),
  table: ({ className, children, ...props }: MdComponentProps) => (
    <div className="my-3 overflow-x-auto">
      <table className={cn("border-collapse w-full", className)} {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ className, children, ...props }: MdComponentProps) => (
    <th
      className={cn(
        "border border-neutral-600 px-3 py-2 text-left font-bold",
        className
      )}
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ className, children, ...props }: MdComponentProps) => (
    <td
      className={cn("border border-neutral-600 px-3 py-2", className)}
      {...props}
    >
      {children}
    </td>
  ),
};

// Props for HumanMessageBubble
interface HumanMessageBubbleProps {
  message: { content: string; id: string };
  mdComponents: typeof mdComponents;
}

// HumanMessageBubble Component
const HumanMessageBubble: React.FC<HumanMessageBubbleProps> = ({
  message,
  mdComponents,
}) => {
  return (
    <div className="text-white rounded-3xl break-words min-h-7 bg-neutral-700 max-w-[100%] sm:max-w-[90%] px-4 pt-3 rounded-br-lg">
      <ReactMarkdown components={mdComponents} remarkPlugins={[remarkGfm]}>
        {message.content}
      </ReactMarkdown>
    </div>
  );
};

// Props for AiMessageBubble
interface AiMessageBubbleProps {
  message: { content: string; id: string };
  mdComponents: typeof mdComponents;
  handleCopy: (text: string, messageId: string) => void;
  copiedMessageId: string | null;
  agent?: string;
}

// AiMessageBubble Component
const AiMessageBubble: React.FC<AiMessageBubbleProps> = ({
  message,
  mdComponents,
  handleCopy,
  copiedMessageId,
  agent,
}) => {
  // Simply display all content with copy button
  return (
    <div className="relative break-words flex flex-col w-full">
      {/* Show agent name if available */}
      {agent && (
        <div className="text-xs text-neutral-500 mb-1">
          Agent: {agent}
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <ReactMarkdown components={mdComponents} remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
        <button
          onClick={() => handleCopy(message.content, message.id)}
          className="p-1 hover:bg-neutral-700 rounded"
        >
          {copiedMessageId === message.id ? (
            <CopyCheck className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-neutral-400" />
          )}
        </button>
      </div>
    </div>
  );
};

interface ChatMessagesViewProps {
  messages: { type: "human" | "ai"; content: string; id: string; agent?: string; files?: File[] }[];
  isLoading: boolean;
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  onSubmit: (query: string, files?: File[]) => void;
  onCancel: () => void;
}

export function ChatMessagesView({
  messages,
  isLoading,
  scrollAreaRef,
  onSubmit,
  onCancel,
}: ChatMessagesViewProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const handleCopy = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleNewChat = () => {
    window.location.reload();
  };

  // Find the last AI message
  const lastAiMessage = messages.slice().reverse().find(m => m.type === "ai");

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header with New Chat button */}
      <div className="border-b border-neutral-700 p-4 bg-neutral-800">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-semibold text-neutral-100">Chat</h1>
          <Button
            onClick={handleNewChat}
            variant="outline"
            className="bg-neutral-700 hover:bg-neutral-600 text-neutral-100 border-neutral-600 hover:border-neutral-500"
          >
            New Chat
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col w-full">
        <ScrollArea ref={scrollAreaRef} className="flex-1 w-full">
          <div className="p-4 md:p-6 space-y-2 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "human" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "human" ? (
                  <HumanMessageBubble
                    message={message}
                    mdComponents={mdComponents}
                  />
                ) : (
                  <AiMessageBubble
                    message={message}
                    mdComponents={mdComponents}
                    handleCopy={handleCopy}
                    copiedMessageId={copiedMessageId}
                    agent={message.agent}
                  />
                )}
              </div>
            ))}
            {/* This global "Thinking..." indicator appears below all messages if isLoading is true */}
            {/* It's independent of the per-timeline isLoading state */}
            {isLoading && !lastAiMessage && messages.some(m => m.type === 'human') && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
             {/* Show "Thinking..." if the last message is human and we are loading, 
                 or if there's an active AI message that is the last one and we are loading.
                 The AiMessageBubble's internal isLoading will handle its own spinner.
                 This one is for the general loading state at the bottom.
             */}
            {isLoading && messages.length > 0 && messages[messages.length -1].type === 'human' && (
                 <div className="flex justify-start pl-10 pt-2"> {/* Adjusted padding to align similarly to AI bubble */}
                    <div className="flex items-center gap-2 text-neutral-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Thinking...</span>
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="border-t border-neutral-700 p-4 w-full">
        <div className="max-w-3xl mx-auto">
          <InputForm onSubmit={onSubmit} isLoading={isLoading} context="chat" />
          {isLoading && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={onCancel}
                className="text-red-400 hover:text-red-300"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
