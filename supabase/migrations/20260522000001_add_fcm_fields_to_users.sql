-- users 테이블에 FCM 관련 컬럼 추가
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS fcm_token     text,
  ADD COLUMN IF NOT EXISTS last_active_at timestamptz DEFAULT now();

-- 기존 유저 last_active_at 초기화
UPDATE public.users
  SET last_active_at = now()
  WHERE last_active_at IS NULL;
