-- 분류별 최다 호감 글귀 조회 RPC 함수들

-- 1. 연령대별 TOP 글귀
CREATE OR REPLACE FUNCTION get_top_quote_by_age()
RETURNS TABLE (
  age_group  text,
  content    text,
  author     text,
  like_count bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH counts AS (
    SELECT
      COALESCE(u.age_group, '미입력') AS age_group,
      q.content,
      q.author,
      COUNT(*) AS like_count
    FROM user_quotes uq
    JOIN users  u ON uq.user_id  = u.id
    JOIN quotes q ON uq.quote_id = q.id
    WHERE uq.action = 'like'
      AND u.deleted_at IS NULL
    GROUP BY COALESCE(u.age_group, '미입력'), q.id, q.content, q.author
  ),
  ranked AS (
    SELECT *,
      ROW_NUMBER() OVER (PARTITION BY age_group ORDER BY like_count DESC) AS rn
    FROM counts
  )
  SELECT age_group, content, author, like_count
  FROM ranked
  WHERE rn = 1
  ORDER BY like_count DESC;
$$;

-- 2. 성별 TOP 글귀
CREATE OR REPLACE FUNCTION get_top_quote_by_gender()
RETURNS TABLE (
  gender     text,
  content    text,
  author     text,
  like_count bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH counts AS (
    SELECT
      COALESCE(u.gender, '미입력') AS gender,
      q.content,
      q.author,
      COUNT(*) AS like_count
    FROM user_quotes uq
    JOIN users  u ON uq.user_id  = u.id
    JOIN quotes q ON uq.quote_id = q.id
    WHERE uq.action = 'like'
      AND u.deleted_at IS NULL
    GROUP BY COALESCE(u.gender, '미입력'), q.id, q.content, q.author
  ),
  ranked AS (
    SELECT *,
      ROW_NUMBER() OVER (PARTITION BY gender ORDER BY like_count DESC) AS rn
    FROM counts
  )
  SELECT gender, content, author, like_count
  FROM ranked
  WHERE rn = 1
  ORDER BY like_count DESC;
$$;

-- 3. MBTI별 TOP 글귀 (상위 8개 MBTI만)
CREATE OR REPLACE FUNCTION get_top_quote_by_mbti()
RETURNS TABLE (
  mbti       text,
  content    text,
  author     text,
  like_count bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH counts AS (
    SELECT
      u.mbti,
      q.content,
      q.author,
      COUNT(*) AS like_count
    FROM user_quotes uq
    JOIN users  u ON uq.user_id  = u.id
    JOIN quotes q ON uq.quote_id = q.id
    WHERE uq.action = 'like'
      AND u.deleted_at IS NULL
      AND u.mbti IS NOT NULL
      AND u.mbti <> ''
    GROUP BY u.mbti, q.id, q.content, q.author
  ),
  ranked AS (
    SELECT *,
      ROW_NUMBER() OVER (PARTITION BY mbti ORDER BY like_count DESC) AS rn
    FROM counts
  ),
  mbti_totals AS (
    SELECT mbti, SUM(like_count) AS total_likes
    FROM counts
    GROUP BY mbti
    ORDER BY total_likes DESC
    LIMIT 8
  )
  SELECT r.mbti, r.content, r.author, r.like_count
  FROM ranked r
  JOIN mbti_totals m ON r.mbti = m.mbti
  WHERE r.rn = 1
  ORDER BY m.total_likes DESC;
$$;

-- 4. 카테고리별 TOP 글귀
CREATE OR REPLACE FUNCTION get_top_quote_by_category()
RETURNS TABLE (
  category_name  text,
  category_emoji text,
  content        text,
  author         text,
  like_count     bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH counts AS (
    SELECT
      c.name  AS category_name,
      COALESCE(c.emoji, '📚') AS category_emoji,
      q.content,
      q.author,
      COUNT(*) AS like_count
    FROM user_quotes uq
    JOIN quotes     q ON uq.quote_id   = q.id
    JOIN categories c ON q.category_id = c.id
    WHERE uq.action = 'like'
      AND c.is_active = true
    GROUP BY c.id, c.name, c.emoji, q.id, q.content, q.author
  ),
  ranked AS (
    SELECT *,
      ROW_NUMBER() OVER (PARTITION BY category_name ORDER BY like_count DESC) AS rn
    FROM counts
  )
  SELECT category_name, category_emoji, content, author, like_count
  FROM ranked
  WHERE rn = 1
  ORDER BY like_count DESC;
$$;

GRANT EXECUTE ON FUNCTION get_top_quote_by_age()      TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_top_quote_by_gender()   TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_top_quote_by_mbti()     TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_top_quote_by_category() TO anon, authenticated;
