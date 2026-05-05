export interface Quote {
  id: string;
  content: string;
  author: string | null;
  source: string | null;
  emotion_tags: string[] | null;
}

export type SwipeDirection = "like" | "dislike";

export interface UserQuotePayload {
  user_id: string;
  quote_id: string;
  action: SwipeDirection;
  read_duration_ms: number;
  access_channel: string;
  session_id: string;
  session_position: number;
  device_type: string;
}
