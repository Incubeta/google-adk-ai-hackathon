import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Paperclip, X } from "lucide-react";

interface InputFormProps {
  onSubmit: (query: string, files?: File[]) => void;
  isLoading: boolean;
  context?: 'homepage' | 'chat'; // Add new context prop
  acceptedFileTypes?: string; // e.g., ".pdf,.txt,.doc,.docx"
  maxFileSize?: number; // in bytes, default 10MB
  maxFiles?: number; // maximum number of files, default 5
}

export function InputForm({ 
  onSubmit, 
  isLoading, 
  context = 'homepage',
  acceptedFileTypes = ".pdf,.txt,.doc,.docx,.md,.csv,.json,.xml",
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5
}: InputFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((inputValue.trim() || attachedFiles.length > 0) && !isLoading) {
      onSubmit(inputValue.trim(), attachedFiles.length > 0 ? attachedFiles : undefined);
      setInputValue("");
      setAttachedFiles([]);
      setFileError("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFileError("");

    // Check max files limit
    if (attachedFiles.length + files.length > maxFiles) {
      setFileError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of files) {
      // Check file size
      if (file.size > maxFileSize) {
        setFileError(`File "${file.name}" exceeds maximum size of ${Math.round(maxFileSize / 1024 / 1024)}MB`);
        return;
      }
      validFiles.push(file);
    }

    setAttachedFiles([...attachedFiles, ...validFiles]);
    
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
    setFileError("");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const placeholderText =
    context === 'chat'
      ? "Respond to the Agent, refine the plan, or type 'Looks good'..."
      : "Ask me anything... e.g., A report on the latest Google I/O";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {/* File attachments display */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-md">
          {attachedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-2 py-1 bg-background rounded-md border text-sm"
            >
              <Paperclip className="h-3 w-3" />
              <span className="max-w-[200px] truncate" title={file.name}>
                {file.name}
              </span>
              <span className="text-muted-foreground">
                ({formatFileSize(file.size)})
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {fileError && (
        <div className="text-sm text-destructive px-2">
          {fileError}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            rows={1}
            className="resize-none pr-10 min-h-[40px]"
          />
          
          {/* File upload button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 bottom-1 h-8 w-8"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFileTypes}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || (!inputValue.trim() && attachedFiles.length === 0)}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>

      {/* File upload hints */}
      <div className="text-xs text-muted-foreground px-2">
        {context === 'homepage' 
          ? "You can attach documents (PDF, TXT, DOC, etc.) for analysis"
          : "Attach files to provide additional context"
        }
      </div>
    </form>
  );
}
