import FriendsView from "./components/FriendsView";
import { useState } from "react";
import { ChatArea } from "./components/ChatArea";
import { ChannelSidebar } from "./components/ChannelSidebar";
import { ChatListSidebar } from "./components/ChatListSidebar";
import { chatPreviews, defaultSelectedChat, initialMessages, type MessageMap } from "./data";
import type { Chat, Message } from "./types";

const DEFAULT_CHANNEL_ID = "t1";

export function ChatWorkspace() {
  const [selectedChat, setSelectedChat] = useState<Chat>(defaultSelectedChat);
  const [selectedChannelId, setSelectedChannelId] = useState(DEFAULT_CHANNEL_ID);
  const [allMessages, setAllMessages] = useState<MessageMap>(initialMessages);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);

    if (chat.isGroup) {
      setSelectedChannelId(DEFAULT_CHANNEL_ID);
    }
  };

  const getMessageKey = (chat: Chat, channelId: string) =>
    chat.isGroup ? `${chat.id}-${channelId}` : chat.id;

  const getCurrentMessages = (): Message[] =>
    allMessages[getMessageKey(selectedChat, selectedChannelId)] ?? [];

  const handleSendMessage = (text: string) => {
    const key = getMessageKey(selectedChat, selectedChannelId);
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "You",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      isCurrentUser: true,
      readBy: [],
    };

    setAllMessages((previousMessages) => ({
      ...previousMessages,
      [key]: [...(previousMessages[key] ?? []), newMessage],
    }));
  };

  const handleDeleteMessage = (messageId: string) => {
    const key = getMessageKey(selectedChat, selectedChannelId);

    setAllMessages((previousMessages) => ({
      ...previousMessages,
      [key]: (previousMessages[key] ?? []).filter((message) => message.id !== messageId),
    }));
  };

  const handleEditMessage = (messageId: string, newText: string) => {
    const key = getMessageKey(selectedChat, selectedChannelId);

    setAllMessages((previousMessages) => ({
      ...previousMessages,
      [key]: (previousMessages[key] ?? []).map((message) =>
        message.id === messageId ? { ...message, text: newText } : message,
      ),
    }));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatListSidebar
        chats={chatPreviews}
        selectedChatId={selectedChat.id}
        onSelectChat={handleSelectChat}
      />

      {selectedChat.id === "friends" ? (
        <FriendsView />
      ) : (
        <>
          {selectedChat.isGroup && (
            <ChannelSidebar
              chatName={selectedChat.name}
              selectedChannelId={selectedChannelId}
              onSelectChannel={setSelectedChannelId}
            />
          )}
          <ChatArea
            chatId={selectedChat.id}
            channelId={selectedChannelId}
            chatName={selectedChat.name}
            isGroup={selectedChat.isGroup}
            messages={getCurrentMessages()}
            onSendMessage={handleSendMessage}
            onDeleteMessage={handleDeleteMessage}
            onEditMessage={handleEditMessage}
            totalMembers={selectedChat.members?.length ?? 2}
          />
        </>
      )}
    </div>
  );

}
