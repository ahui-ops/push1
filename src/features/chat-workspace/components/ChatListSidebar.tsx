import { MessageCircle, Users } from "lucide-react";
import type { Chat, ChatPreview } from "../types";

interface ChatListSidebarProps {
  selectedChatId: string;
  onSelectChat: (chat: Chat) => void;
  chats: ChatPreview[];
}

export function ChatListSidebar({
  selectedChatId,
  onSelectChat,
  chats,
}: ChatListSidebarProps) {
  return (
    <div className="flex w-[15%] flex-col border-r border-zinc-200 bg-zinc-100">
      <div className="border-b border-zinc-200 p-4">
        <h2 className="font-semibold text-zinc-900">Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* The newly added Friends Button */}
        <button
          onClick={() => onSelectChat({ id: "friends", name: "Friends", isGroup: false } as Chat)}
          className={`w-full border-b border-zinc-200 p-3 text-left transition-colors hover:bg-zinc-200 ${selectedChatId === "friends" ? "bg-zinc-200" : ""
            }`}
        >
          <div className="flex items-center gap-2">
            <div className="mt-1 flex-shrink-0">
              <Users className="h-5 w-5 text-zinc-600" />
            </div>
            <span className="font-medium text-zinc-900">Friends</span>
          </div>
        </button>

        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`w-full border-b border-zinc-200 p-3 text-left transition-colors hover:bg-zinc-200 ${selectedChatId === chat.id ? "bg-zinc-200" : ""
              }`}
          >
            <div className="flex items-start gap-2">
              <div className="mt-1 flex-shrink-0">
                {chat.isGroup ? (
                  <Users className="h-5 w-5 text-zinc-600" />
                ) : (
                  <MessageCircle className="h-5 w-5 text-zinc-600" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="truncate text-sm font-medium text-zinc-900">
                    {chat.name}
                  </span>
                  <span className="ml-2 flex-shrink-0 text-xs text-zinc-500">
                    {chat.timestamp}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="truncate text-xs text-zinc-600">{chat.lastMessage}</p>
                  {chat.unread ? (
                    <span className="ml-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs text-white">
                      {chat.unread}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
