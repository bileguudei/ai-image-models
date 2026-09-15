"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Message = {
  role: "assistant" | "user";
  content: string;
};

const INITIAL_MESSAGES: Message[] = [
  { role: "assistant", content: "How can I help you today?" },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    const text = draft.trim();
    if (!text || loading) return;

    const nextMessages = [
      ...messages,
      { role: "user" as const, content: text },
    ];
    setMessages(nextMessages);
    setDraft("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const { text } = await response.json();

      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    } catch (error) {
      console.log("ERROR", error);
    }

    setLoading(false);
  }

  return (
    <div className="fixed bottom-9 right-9 z-50">
      {open && (
        <div className="absolute bottom-0 right-0 flex h-[472px] w-[380px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-lg border border-border bg-background shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-2 px-4 py-2">
            <span className="flex-1 text-base font-medium text-foreground">
              Chat assistant
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex size-8 items-center justify-center rounded-md border border-input text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-2 overflow-y-auto border-y border-border px-6 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-full",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-full whitespace-pre-wrap rounded-xl px-4 py-2 text-sm",
                    message.role === "assistant"
                      ? "w-[258px] bg-primary/90 text-primary-foreground"
                      : "w-[240px] bg-muted/80 text-foreground",
                  )}
                >
                  {message.role === "assistant" ? (
                    <Markdown>{message.content}</Markdown>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 px-4 py-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSend();
              }}
              disabled={loading}
              placeholder="Type your message..."
              className="h-10 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleSend}
              aria-label="Send message"
              disabled={!draft.trim() || loading}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      )}

      <Button
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="size-12 rounded-full p-0 shadow-lg data-[chat-open=true]:invisible"
        data-chat-open={open}
      >
        <MessageCircle className="size-4" />
      </Button>
    </div>
  );
}
