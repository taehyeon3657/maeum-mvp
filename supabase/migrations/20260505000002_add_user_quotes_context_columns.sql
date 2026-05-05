-- user_quotes 테이블에 C(컨텍스트) 데이터 컬럼 추가
-- session_id  : 같은 피드 세션에서 본 카드를 묶는 식별자
-- session_position : 세션 내 몇 번째 카드인지 (1-based)
-- device_type : 접근 디바이스 (mobile / tablet / desktop)
ALTER TABLE public.user_quotes
  ADD COLUMN IF NOT EXISTS session_id       text,
  ADD COLUMN IF NOT EXISTS session_position int4,
  ADD COLUMN IF NOT EXISTS device_type      text;

-- user_quotes RLS 정책 (아직 없다면 추가)
ALTER TABLE public.user_quotes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_quotes' AND policyname = 'user_quotes_self_insert'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "user_quotes_self_insert"
      ON public.user_quotes
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id)
    $policy$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_quotes' AND policyname = 'user_quotes_self_select'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "user_quotes_self_select"
      ON public.user_quotes
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id)
    $policy$;
  END IF;
END $$;

-- authenticated 역할 GRANT
GRANT SELECT, INSERT ON public.user_quotes TO authenticated;
