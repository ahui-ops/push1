import { MoreVertical, Phone, Plus, Send, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Message } from "../types";
import { MessageContextMenu } from "./MessageContextMenu";

interface ChatAreaProps {
  chatId: string;
  channelId: string;
  chatName: string;
  isGroup: boolean;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onEditMessage: (messageId: string, newText: string) => void;
  totalMembers?: number;
}

export function ChatArea({
  chatId,
  channelId,
  chatName,
  isGroup,
  messages,
  onSendMessage,
  onDeleteMessage,
  onEditMessage,
  totalMembers = 12,
}: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState("");
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    messageId: string;
    readBy: string[];
  } | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatId, channelId, messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) {
      return;
    }

    if (editingMessageId) {
      onEditMessage(editingMessageId, messageInput);
      setEditingMessageId(null);
    } else {
      onSendMessage(messageInput);
    }

    setMessageInput("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleContextMenu = (event: React.MouseEvent, message: Message) => {
    if (!message.isCurrentUser) {
      return;
    }

    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      messageId: message.id,
      readBy: message.readBy ?? [],
    });
  };

  const handleDelete = (messageId: string) => {
    onDeleteMessage(messageId);
    setContextMenu(null);
  };

  const handleEdit = (messageId: string) => {
    const message = messages.find((currentMessage) => currentMessage.id === messageId);

    if (message) {
      setMessageInput(message.text);
      setEditingMessageId(messageId);
    }

    setContextMenu(null);
  };

  const getReadStatus = (readBy: string[]): string => {
    if (!isGroup) {
      return readBy.length > 0 ? "Read" : "Delivered";
    }

    const readCount = readBy.length;
    return readCount >= totalMembers - 1 ? "Read" : `Read by ${readCount}/${totalMembers - 1}`;
  };

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-6">
        <div>
          <h3 className="font-semibold text-zinc-900">{chatName}</h3>
          {isGroup ? (
            <p className="text-xs text-zinc-500">
              Sarah, Mike, Emma and {totalMembers - 3} others
            </p>
          ) : (
            <p className="text-xs text-zinc-500">Active now</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isGroup ? (
            <button className="rounded-lg p-2 transition-colors hover:bg-zinc-100">
              <Phone className="h-5 w-5 text-zinc-600" />
            </button>
          ) : null}
          <button className="rounded-lg p-2 transition-colors hover:bg-zinc-100">
            <MoreVertical className="h-5 w-5 text-zinc-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
            onContextMenu={(event) => handleContextMenu(event, message)}
          >
            <div
              className={`flex max-w-[70%] flex-col ${
                message.isCurrentUser ? "items-end" : "items-start"
              }`}
            >
              {!message.isCurrentUser && isGroup ? (
                <span className="mb-1 px-1 text-xs font-medium text-zinc-700">
                  {message.sender}
                </span>
              ) : null}
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.isCurrentUser
                    ? "cursor-context-menu bg-purple-600 text-white"
                    : "border border-zinc-200 bg-white text-zinc-900"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
              <span className="mt-1 px-1 text-xs text-zinc-400">{message.timestamp}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-zinc-200 p-4">
        {editingMessageId ? (
          <div className="mb-2 flex items-center justify-between rounded-lg bg-purple-50 px-4 py-2">
            <span className="text-sm text-purple-700">Editing message...</span>
            <button
              onClick={() => {
                setEditingMessageId(null);
                setMessageInput("");
              }}
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              Cancel
            </button>
          </div>
        ) : null}
        <div className="flex items-end gap-2">
          {!isGroup ? (
            <button className="flex-shrink-0 rounded-lg p-2 transition-colors hover:bg-zinc-100">
              <Plus className="h-5 w-5 text-zinc-600" />
            </button>
          ) : null}

          <div className="flex flex-1 items-end rounded-lg border border-zinc-200 bg-zinc-50">
            <textarea
              value={messageInput}
              onChange={(event) => setMessageInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 resize-none bg-transparent px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
              rows={1}
              style={{
                minHeight: "44px",
                maxHeight: "120px",
              }}
            />
            <button className="m-1 flex-shrink-0 rounded-lg p-2 transition-colors hover:bg-zinc-100">
              <Smile className="h-5 w-5 text-zinc-600" />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            className="flex-shrink-0 rounded-lg bg-purple-600 p-3 transition-colors hover:bg-purple-700"
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {contextMenu ? (
        <MessageContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onDelete={() => handleDelete(contextMenu.messageId)}
          onEdit={() => handleEdit(contextMenu.messageId)}
          readStatus={getReadStatus(contextMenu.readBy)}
        />
      ) : null}
    </div>
  );
}
