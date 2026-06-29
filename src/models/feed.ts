export interface Quote {
  id: string;
  content: string;
  author: string | null;
  source: string | null;
  emotion_tags: string[] | null;
  /** <id>.png 배경 이미지 보유 여부 (get_random_quotes 가 반환). 미정의면 미상. */
  has_image?: boolean;
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
