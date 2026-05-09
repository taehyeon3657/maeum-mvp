-- 랜덤 문구 조회 RPC: 이미 본 quote_id 목록을 제외하고 무작위로 반환
CREATE OR REPLACE FUNCTION get_random_quotes(
  p_exclude_ids uuid[],
  p_limit int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  content text,
  author text,
  source text,
  emotion_tags text[]
) AS $$
  SELECT id, content, author, source, emotion_tags
  FROM quotes
  WHERE is_active = true
    AND (cardinality(p_exclude_ids) = 0 OR id != ALL(p_exclude_ids))
  ORDER BY RANDOM()
  LIMIT p_limit;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_random_quotes(uuid[], int) TO authenticated;
GRANT EXECUTE ON FUNCTION get_random_quotes(uuid[], int) TO anon;
