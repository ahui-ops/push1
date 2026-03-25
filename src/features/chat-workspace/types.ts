export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  isCurrentUser: boolean;
  readBy?: string[];
}

export interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
  members?: string[];
}

export interface ChatPreview extends Chat {
  lastMessage: string;
  timestamp: string;
  unread?: number;
}

export interface Channel {
  id: string;
  name: string;
  type: "text" | "voice";
}

export interface ChannelGroup {
  id: string;
  name: string;
  channels: Channel[];
}
