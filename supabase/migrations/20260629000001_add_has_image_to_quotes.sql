-- 이미지(<id>.png CDN) 보유 문구 우선 노출
--   1) quotes.has_image 컬럼 추가 (기본 false)
--   2) 현재 이미지가 있는 80개 문구를 has_image = true 로 표시
--   3) get_random_quotes 가 이미지 보유 문구를 먼저 반환하도록 정렬 변경
--      (이미지군 내부 / 비이미지군 내부는 여전히 무작위)
--
-- 새 이미지를 추가하면 해당 문구의 has_image 만 true 로 갱신하면 된다.

-- 1) 컬럼 추가 ─────────────────────────────────────────────
ALTER TABLE public.quotes
  ADD COLUMN IF NOT EXISTS has_image boolean NOT NULL DEFAULT false;

-- 2) 현재 이미지 보유 문구 표시 (참조 JSON 1~80번) ──────────
UPDATE public.quotes
SET has_image = true
WHERE id IN (
    ('00118ccb-f9b1-4bd9-9d04-a275ccf46527'),
    ('00b6a742-8fcd-40a2-a923-47f24c411aa5'),
    ('013003ed-d43f-46ab-a08b-19ff7ada42d3'),
    ('015f073f-09f4-4ec3-83d0-15ef00ffd59c'),
    ('01625464-926d-4a67-bd78-fbf21fe47392'),
    ('01861ac8-aa8d-458d-a016-b09962d76c31'),
    ('01cab3c0-f073-4f63-8c3c-6a666fc1a004'),
    ('01e45997-cfc9-4c0b-8ac7-d712a49fc740'),
    ('02252147-cff2-433e-8cb1-e0d6453dc141'),
    ('03226cd4-84e7-464c-aa01-7757bfe162fc'),
    ('036c1303-26bb-4a06-bee9-94e5d9b9f240'),
    ('038f79eb-222e-4014-97a6-4ad7f9a65b6d'),
    ('04a1d223-eacb-4386-b498-a8e55e55d2c2'),
    ('04b205a8-6a22-4361-8065-66319e627fd5'),
    ('04d0ce30-89df-4f39-9957-473f370e893f'),
    ('051a5ed5-e173-4ec5-af05-428b0b55b690'),
    ('05714eff-97f3-4cff-8844-cb268c1543d0'),
    ('05825c9e-7b10-426e-b7d9-201512a3ed59'),
    ('0665decd-11c4-4f6a-9f92-6bb280a4b974'),
    ('0681115e-2a2f-4961-8401-c1f203b9484f'),
    ('0717c34b-a08b-44af-a700-a87ef8badcb6'),
    ('0747b369-beca-4436-9446-63a0b890113c'),
    ('078388b3-c88b-4106-91b2-59802a2db912'),
    ('08170990-a404-44b1-bdfb-48e8f0284032'),
    ('0834bebc-1e41-480a-953e-af287cd2c85d'),
    ('08f7ec45-5292-46b9-a0dc-7ed698febbc9'),
    ('094dc4be-cddc-4add-a239-3f7ad65ce60e'),
    ('09cde070-3cf5-42fd-a3a3-17ce6b936013'),
    ('0a0449fe-8ed8-42c2-ba0b-164310c3f343'),
    ('0a648b0e-802f-4e7c-a57d-5c1aa7a38110'),
    ('0abb3ddc-528f-4229-931b-7eecb45d9476'),
    ('0c10217a-a1ea-482a-ac95-b2e525bbc6a2'),
    ('0c551d81-7b88-4625-a6a6-b75db2092d95'),
    ('0cbb3657-f936-4a1c-86f3-feb71958aa83'),
    ('0e36dd91-7f21-4322-b3b5-a6cdbad815f3'),
    ('0e7ba0d6-1bdc-4699-a209-34c3feac6193'),
    ('0ea5a507-dca3-437d-81f6-df373fb51465'),
    ('0ef802e4-c440-4c7e-88a6-662716044305'),
    ('0f04bdf5-13d9-40d8-aa7a-941ae410298e'),
    ('0f5336f3-a552-4fe5-93e2-f6a2acbb317b'),
    ('0f55c740-6fa4-401d-ba53-46781717489a'),
    ('1006eb0d-c0cd-4563-8ac5-627febe6ffa4'),
    ('102b5cf4-f1ef-4520-a11a-9efb1b7b0183'),
    ('112613c2-a601-4c68-b75c-5114601b148f'),
    ('115afae0-f259-4e45-b1ff-9e35fc45b345'),
    ('11c1566e-a935-447c-988b-2c0594cd6072'),
    ('11d76ec2-c884-4eef-bc5d-853e97b87ad1'),
    ('1246eb39-f75e-4fd7-a1fc-91b33d38a885'),
    ('124a993f-08fa-4608-9d81-c8e56fbca577'),
    ('125de821-02ba-4d42-a872-c8a1fa57b8f8'),
    ('12686ff1-4bcf-4868-a6e1-bc1fc01bfe74'),
    ('13bd8c15-1e45-457e-ba4c-acfd61a09301'),
    ('13c448c4-2b7a-459e-8af8-ca882bd75c6a'),
    ('146c059f-922b-4294-a967-cda36812bad3'),
    ('15b6cd91-88fb-42bd-9212-2cfca56f06b2'),
    ('15dbeafe-c8e5-41c7-8dbd-0939d11cd926'),
    ('173376bc-2627-4c9c-b0dd-dcb2371eb259'),
    ('1855a025-a939-4873-a4d7-e62bbc1a4be0'),
    ('185c6c3e-103d-4b14-8120-d5c2a2d68ce9'),
    ('1862509c-6e5a-4ded-96f6-9506799e3851'),
    ('186ba1fc-0a74-4c76-ac8f-67f169201848'),
    ('19dbf922-e096-44a3-960c-726bdcf1b9b2'),
    ('1a2d0cf0-2f03-4cd5-a640-01fd0c836e2d'),
    ('1a3a4a00-82c0-432f-81fe-9e7a46793944'),
    ('1a9da35b-e261-417f-bfe4-8a03f948da21'),
    ('1ab82d33-d965-4a2c-8b4b-b1d5e8853013'),
    ('1b666101-787f-4dbf-a137-e6ca1be21fbb'),
    ('1bf7c01c-bf74-484c-bb24-7d0283b0ff63'),
    ('1c329b67-33ea-4998-b09a-e6fe2c7fe21d'),
    ('1c619da4-ef49-47c1-bd53-a829ee978580'),
    ('1c7e2e03-e77f-4870-a9fc-c10f6ad6dd4b'),
    ('1cb001d3-d419-4a85-82a4-b8a2ac2f6ca0'),
    ('1e2a191c-ba9b-48bd-9858-4b2389ebe1f0'),
    ('1e759e99-1278-4a4b-8d75-f1ed03f42f99'),
    ('1e924e8a-76fc-4a8c-b04c-b6ddaaface21'),
    ('1ef9c83a-ec1e-436a-bf34-755840948890'),
    ('1f2ec534-5f50-4949-afea-8b0fedf0eba9'),
    ('2002f565-f3e1-44e5-a3b2-369eb83f3999'),
    ('205542f6-4cc4-4c63-a5c9-156800590288'),
    ('20a7bc4b-4f14-4b2a-a310-470f74ee29ad')
);

-- 3) RPC: 이미지 보유 문구 우선 + has_image 컬럼 반환 ────────
--    반환 컬럼이 바뀌므로 DROP 후 재생성.
DROP FUNCTION IF EXISTS get_random_quotes(uuid[], int);

CREATE FUNCTION get_random_quotes(
  p_exclude_ids uuid[],
  p_limit int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  content text,
  author text,
  source text,
  emotion_tags text[],
  has_image boolean
) AS $$
  SELECT id, content, author, source, emotion_tags, has_image
  FROM quotes
  WHERE is_active = true
    AND (cardinality(p_exclude_ids) = 0 OR id != ALL(p_exclude_ids))
  ORDER BY has_image DESC, RANDOM()
  LIMIT p_limit;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_random_quotes(uuid[], int) TO authenticated;
GRANT EXECUTE ON FUNCTION get_random_quotes(uuid[], int) TO anon;
