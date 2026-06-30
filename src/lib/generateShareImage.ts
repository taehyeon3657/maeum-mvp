interface GenerateOptions {
  content: string;
  author: string | null;
  source: string | null;
  gradientIndex?: number;
  imageUrl?: string | null;
}

const GRADIENTS: [string, string, string][] = [
  ["#FFFCF8", "#FFF0E6", "#FFE2CC"],
  ["#FAFDF9", "#EDF5F0", "#D9EDE0"],
  ["#FDFCFF", "#F2EDF8", "#E6DDF4"],
  ["#FFFDF4", "#FFF5D4", "#FFE8A8"],
];

const FONT = '"Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif';

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const char of text) {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function generateShareImage(options: GenerateOptions): Promise<Blob> {
  const SIZE = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

  let hasImg = false;
  if (options.imageUrl) {
    try {
      const img = await loadImage(options.imageUrl);
      const scale = Math.max(SIZE / img.naturalWidth, SIZE / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
      hasImg = true;
    } catch {
      // fallback to gradient
    }
  }

  if (!hasImg) {
    const [c1, c2, c3] = GRADIENTS[(options.gradientIndex ?? 0) % GRADIENTS.length];
    const bg = ctx.createLinearGradient(SIZE * 0.15, SIZE, SIZE * 0.85, 0);
    bg.addColorStop(0, c1);
    bg.addColorStop(0.55, c2);
    bg.addColorStop(1, c3);
    ctx.fillStyle = bg;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(0, 0, SIZE, SIZE, 56);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, SIZE, SIZE);
    }
  }

  if (hasImg) {
    // 가독성 스크림: 상단·하단 어둡게, 중간은 이미지가 보이게
    const scrim = ctx.createLinearGradient(0, 0, 0, SIZE);
    scrim.addColorStop(0, "rgba(0,0,0,0.52)");
    scrim.addColorStop(0.28, "rgba(0,0,0,0.18)");
    scrim.addColorStop(0.52, "rgba(0,0,0,0.04)");
    scrim.addColorStop(0.78, "rgba(0,0,0,0.30)");
    scrim.addColorStop(1, "rgba(0,0,0,0.58)");
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, SIZE, SIZE);
  } else {
    // 상단 포인트 라인
    const barGrad = ctx.createLinearGradient(0, 0, SIZE, 0);
    barGrad.addColorStop(0, "rgba(224,122,95,0)");
    barGrad.addColorStop(0.5, "rgba(224,122,95,0.5)");
    barGrad.addColorStop(1, "rgba(224,122,95,0)");
    ctx.fillStyle = barGrad;
    ctx.fillRect(0, 0, SIZE, 6);

    // 배경 따옴표 장식
    ctx.font = `900 300px ${FONT}`;
    ctx.fillStyle = "rgba(224,122,95,0.07)";
    ctx.textAlign = "left";
    ctx.fillText("“", 64, 300);
  }

  // 글귀 텍스트
  const textColor = hasImg ? "#ffffff" : "#2C2C2C";
  ctx.font = `700 62px ${FONT}`;
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  if (hasImg) {
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = 18;
  }
  const lines = wrapText(ctx, options.content, SIZE - 220);
  const lineHeight = 98;
  const totalTextH = lines.length * lineHeight;
  // 이미지 모드에서는 상단 근처에, 그라디언트 모드에서는 중앙
  const textY = hasImg
    ? SIZE * 0.12 + lineHeight
    : (SIZE - totalTextH) / 2 - 30;
  lines.forEach((l, i) => ctx.fillText(l, SIZE / 2, textY + i * lineHeight));
  ctx.shadowBlur = 0;

  // 구분선 (이미지 모드에서는 생략)
  const divY = textY + totalTextH + 64;
  if (!hasImg) {
    const divGrad = ctx.createLinearGradient(SIZE * 0.2, 0, SIZE * 0.8, 0);
    divGrad.addColorStop(0, "rgba(224,122,95,0)");
    divGrad.addColorStop(0.5, "rgba(224,122,95,0.4)");
    divGrad.addColorStop(1, "rgba(224,122,95,0)");
    ctx.strokeStyle = divGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(SIZE * 0.2, divY);
    ctx.lineTo(SIZE * 0.8, divY);
    ctx.stroke();
  }

  // 저자 / 출처
  if (options.author || options.source) {
    const authorParts = [
      options.author ? `— ${options.author}` : null,
      options.source ? `〈${options.source}〉` : null,
    ]
      .filter(Boolean)
      .join("  ");
    ctx.font = `500 42px ${FONT}`;
    ctx.fillStyle = hasImg ? "rgba(255,255,255,0.82)" : "rgba(44,44,44,0.55)";
    ctx.textAlign = "center";
    if (hasImg) {
      ctx.shadowColor = "rgba(0,0,0,0.45)";
      ctx.shadowBlur = 12;
    }
    ctx.fillText(authorParts, SIZE / 2, divY + 62);
    ctx.shadowBlur = 0;
  }

  // 브랜딩
  ctx.font = `700 38px ${FONT}`;
  ctx.fillStyle = hasImg ? "rgba(255,255,255,0.55)" : "rgba(224,122,95,0.45)";
  ctx.textAlign = "right";
  ctx.fillText("마음", SIZE - 72, SIZE - 72);

  ctx.font = `400 30px ${FONT}`;
  ctx.fillStyle = hasImg ? "rgba(255,255,255,0.28)" : "rgba(44,44,44,0.28)";
  ctx.textAlign = "center";
  ctx.fillText("maeum-mvp.vercel.app", SIZE / 2, SIZE - 40);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("이미지 생성 실패"))),
      "image/png"
    );
  });
}

export async function shareImage(blob: Blob, quote: { content: string }): Promise<void> {
  const file = new File([blob], "maeum-quote.png", { type: "image/png" });

  if (
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  ) {
    await navigator.share({
      files: [file],
      title: "마음 — 오늘의 글귀",
      text: quote.content,
    });
    return;
  }

  // fallback: 이미지 다운로드
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "maeum-quote.png";
  a.click();
  URL.revokeObjectURL(url);
}
