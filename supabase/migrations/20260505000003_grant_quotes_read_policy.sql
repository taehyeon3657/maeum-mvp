-- quotes 테이블 읽기 권한
-- 활성화된 글귀는 인증 유저와 비인증 유저 모두 조회 가능
GRANT SELECT ON public.quotes TO authenticated;
GRANT SELECT ON public.quotes TO anon;

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'quotes' AND policyname = 'quotes_public_read'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "quotes_public_read"
      ON public.quotes
      FOR SELECT
      TO authenticated, anon
      USING (is_active = true)
    $policy$;
  END IF;
END $$;
