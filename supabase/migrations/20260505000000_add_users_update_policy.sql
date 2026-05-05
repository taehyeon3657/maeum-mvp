-- users 테이블에 UPDATE 정책 추가
-- upsert(INSERT ... ON CONFLICT DO UPDATE)가 동작하려면 INSERT + UPDATE 정책이 모두 필요합니다.
create policy "users_self_update"
on "public"."users"
for update
to public
using (auth.uid() = id)
with check (auth.uid() = id);
