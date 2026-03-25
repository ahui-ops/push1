import { del, get, patch, post } from "../../shared/api/client";
import type {
  ConversationDetail,
  ConversationListResponse,
  ConversationMessagesResponse,
  SyncBootstrapResponse,
  UserProfile,
} from "./types";

export function getCurrentUser() {
  return get<UserProfile>("/api/v1/users/me");
}

export function getConversationList() {
  return get<ConversationListResponse>("/api/v1/conversations");
}

export function getConversationDetail(conversationId: number) {
  return get<ConversationDetail>(`/api/v1/conversations/${conversationId}`);
}

export function getConversationMessages(conversationId: number, beforeSeq?: number) {
  const searchParams = new URLSearchParams();

  if (beforeSeq !== undefined) {
    searchParams.set("before_seq", String(beforeSeq));
  }

  const query = searchParams.toString();
  const path = `/api/v1/conversations/${conversationId}/messages${query ? `?${query}` : ""}`;

  return get<ConversationMessagesResponse>(path);
}

export function sendConversationMessage(conversationId: number, body: string) {
  return post(`/api/v1/conversations/${conversationId}/messages`, {
    client_msg_id: crypto.randomUUID(),
    body,
  });
}

export function markConversationRead(conversationId: number, lastReadSeq: number) {
  return post(`/api/v1/conversations/${conversationId}/read`, {
    last_read_seq: lastReadSeq,
  });
}

export function updateConversationPreferences(
  conversationId: number,
  preferences: {
    is_pinned?: boolean;
    is_muted?: boolean;
  },
) {
  return patch(`/api/v1/conversations/${conversationId}/preferences`, preferences);
}

export function deleteConversationMessage(conversationId: number, messageId: number) {
  return del(`/api/v1/conversations/${conversationId}/messages/${messageId}`);
}

export function getSyncBootstrap() {
  return get<SyncBootstrapResponse>("/api/v1/sync/bootstrap");
}
