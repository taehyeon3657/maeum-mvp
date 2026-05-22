interface GenerateOptions {
  content: string;
  author: string | null;
  source: string | null;
  gradientIndex?: number;
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

export async function generateShareImage(options: GenerateOptions): Promise<Blob> {
  const SIZE = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

  const [c1, c2, c3] = GRADIENTS[(options.gradientIndex ?? 0) % GRADIENTS.length];

  // 배경 그라디언트
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

  // 글귀 텍스트
  ctx.font = `700 62px ${FONT}`;
  ctx.fillStyle = "#2C2C2C";
  ctx.textAlign = "center";
  const lines = wrapText(ctx, options.content, SIZE - 220);
  const lineHeight = 98;
  const totalTextH = lines.length * lineHeight;
  const textY = (SIZE - totalTextH) / 2 - 30;
  lines.forEach((l, i) => ctx.fillText(l, SIZE / 2, textY + i * lineHeight));

  // 구분선
  const divY = textY + totalTextH + 64;
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

  // 저자 / 출처
  if (options.author || options.source) {
    const authorParts = [
      options.author ? `— ${options.author}` : null,
      options.source ? `〈${options.source}〉` : null,
    ]
      .filter(Boolean)
      .join("  ");
    ctx.font = `500 42px ${FONT}`;
    ctx.fillStyle = "rgba(44,44,44,0.55)";
    ctx.textAlign = "center";
    ctx.fillText(authorParts, SIZE / 2, divY + 62);
  }

  // 브랜딩
  ctx.font = `700 38px ${FONT}`;
  ctx.fillStyle = "rgba(224,122,95,0.45)";
  ctx.textAlign = "right";
  ctx.fillText("마음", SIZE - 72, SIZE - 72);

  ctx.font = `400 30px ${FONT}`;
  ctx.fillStyle = "rgba(44,44,44,0.28)";
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

  // Web Share API (파일 공유 지원 여부 확인)
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
