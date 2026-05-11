-- users 테이블 RLS 활성화 및 본인 행 조작 정책 추가
-- 익명 로그인 포함 authenticated 역할 사용자가 자신의 행만 읽기/쓰기 가능
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'users' AND policyname = 'users_self_select'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "users_self_select"
      ON public.users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id)
    $policy$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'users' AND policyname = 'users_self_insert'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "users_self_insert"
      ON public.users
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id)
    $policy$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'users' AND policyname = 'users_self_update'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "users_self_update"
      ON public.users
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id)
    $policy$;
  END IF;
END $$;
