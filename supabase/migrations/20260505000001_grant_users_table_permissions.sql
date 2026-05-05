-- authenticated 역할에 users 테이블 기본 권한 부여
-- RLS 정책과 GRANT는 독립적으로 동작합니다.
-- GRANT가 없으면 RLS 정책이 있어도 403 "permission denied"가 발생합니다.
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
