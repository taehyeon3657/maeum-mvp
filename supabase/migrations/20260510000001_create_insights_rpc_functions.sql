-- 인사이트 분석용 RPC 함수들

-- 1. 연령대별 호감/비호감 집계
CREATE OR REPLACE FUNCTION get_insights_by_age()
RETURNS TABLE (
  age_group  text,
  like_count bigint,
  dislike_count bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(u.age_group, '미입력') AS age_group,
    COUNT(*) FILTER (WHERE uq.action = 'like')    AS like_count,
    COUNT(*) FILTER (WHERE uq.action = 'dislike') AS dislike_count
  FROM user_quotes uq
  JOIN users u ON uq.user_id = u.id
  WHERE u.deleted_at IS NULL
  GROUP BY u.age_group
  ORDER BY like_count DESC;
$$;

-- 2. 성별별 호감/비호감 집계
CREATE OR REPLACE FUNCTION get_insights_by_gender()
RETURNS TABLE (
  gender        text,
  like_count    bigint,
  dislike_count bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(u.gender, '미입력') AS gender,
    COUNT(*) FILTER (WHERE uq.action = 'like')    AS like_count,
    COUNT(*) FILTER (WHERE uq.action = 'dislike') AS dislike_count
  FROM user_quotes uq
  JOIN users u ON uq.user_id = u.id
  WHERE u.deleted_at IS NULL
  GROUP BY u.gender
  ORDER BY like_count DESC;
$$;

-- 3. MBTI별 호감률 순위 (상위 16개)
CREATE OR REPLACE FUNCTION get_insights_by_mbti()
RETURNS TABLE (
  mbti          text,
  like_count    bigint,
  dislike_count bigint,
  like_rate     numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    u.mbti,
    COUNT(*) FILTER (WHERE uq.action = 'like')    AS like_count,
    COUNT(*) FILTER (WHERE uq.action = 'dislike') AS dislike_count,
    ROUND(
      100.0 * COUNT(*) FILTER (WHERE uq.action = 'like') / NULLIF(COUNT(*), 0),
      1
    ) AS like_rate
  FROM user_quotes uq
  JOIN users u ON uq.user_id = u.id
  WHERE u.deleted_at IS NULL
    AND u.mbti IS NOT NULL
    AND u.mbti <> ''
  GROUP BY u.mbti
  HAVING COUNT(*) >= 1
  ORDER BY like_rate DESC
  LIMIT 16;
$$;

-- 4. 카테고리별 호감/비호감 집계
CREATE OR REPLACE FUNCTION get_insights_by_category()
RETURNS TABLE (
  category_name  text,
  category_color text,
  category_emoji text,
  like_count     bigint,
  dislike_count  bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.name                            AS category_name,
    COALESCE(c.color, '#e07a5f')     AS category_color,
    COALESCE(c.emoji, '📚')           AS category_emoji,
    COUNT(*) FILTER (WHERE uq.action = 'like')    AS like_count,
    COUNT(*) FILTER (WHERE uq.action = 'dislike') AS dislike_count
  FROM user_quotes uq
  JOIN quotes q     ON uq.quote_id   = q.id
  JOIN categories c ON q.category_id = c.id
  WHERE c.is_active = true
  GROUP BY c.id, c.name, c.color, c.emoji, c.sort_order
  ORDER BY like_count DESC;
$$;

-- 5. 시간대별 호감/비호감 집계 (KST 기준)
CREATE OR REPLACE FUNCTION get_insights_by_hour()
RETURNS TABLE (
  hour_of_day   integer,
  like_count    bigint,
  dislike_count bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    EXTRACT(HOUR FROM uq.created_at AT TIME ZONE 'Asia/Seoul')::integer AS hour_of_day,
    COUNT(*) FILTER (WHERE uq.action = 'like')    AS like_count,
    COUNT(*) FILTER (WHERE uq.action = 'dislike') AS dislike_count
  FROM user_quotes uq
  GROUP BY hour_of_day
  ORDER BY hour_of_day;
$$;

-- anon 역할에 실행 권한 부여
GRANT EXECUTE ON FUNCTION get_insights_by_age()      TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_insights_by_gender()   TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_insights_by_mbti()     TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_insights_by_category() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_insights_by_hour()     TO anon, authenticated;
