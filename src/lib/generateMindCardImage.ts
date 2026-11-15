const FONT = '"Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif';

export interface MindCardImageInput {
  headline: string;
  detail: string;
  emoji: string;
  mbti: string;
  quoteContent: string | null;
  quoteAuthor: string | null;
  streakCount: number;
}

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

export async function generateMindCardImage(input: MindCardImageInput): Promise<Blob> {
  const SIZE = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unavailable");

  const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  bg.addColorStop(0, "#FFF8F4");
  bg.addColorStop(0.55, "#FFE4D8");
  bg.addColorStop(1, "#F8C9B8");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.fillStyle = "#FD267A";
  ctx.fillRect(0, 0, SIZE, 14);

  ctx.font = `700 42px ${FONT}`;
  ctx.fillStyle = "#E07A5F";
  ctx.textAlign = "left";
  ctx.fillText("마음", 84, 120);

  if (input.mbti) {
    ctx.font = `700 36px ${FONT}`;
    ctx.textAlign = "right";
    ctx.fillText(input.mbti, SIZE - 84, 120);
  }

  ctx.font = `700 72px ${FONT}`;
  ctx.fillStyle = "#1A1714";
  ctx.textAlign = "left";
  ctx.fillText(input.emoji, 84, 250);

  ctx.font = `800 64px ${FONT}`;
  const headlineLines = wrapText(ctx, input.headline, SIZE - 168).slice(0, 2);
  headlineLines.forEach((line, index) => {
    ctx.fillText(line, 84, 360 + index * 82);
  });

  ctx.font = `500 36px ${FONT}`;
  ctx.fillStyle = "#5C534C";
  const detailY = 360 + headlineLines.length * 82 + 24;
  const detailLines = wrapText(ctx, input.detail, SIZE - 168).slice(0, 2);
  detailLines.forEach((line, index) => {
    ctx.fillText(line, 84, detailY + index * 52);
  });

  if (input.quoteContent) {
    const quoteTop = detailY + detailLines.length * 52 + 48;
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(72, quoteTop, SIZE - 144, 280, 36);
    } else {
      ctx.rect(72, quoteTop, SIZE - 144, 280);
    }
    ctx.fill();

    ctx.font = `700 40px ${FONT}`;
    ctx.fillStyle = "#1A1714";
    ctx.textAlign = "left";
    const quoteLines = wrapText(ctx, input.quoteContent, SIZE - 240).slice(0, 3);
    quoteLines.forEach((line, index) => {
      ctx.fillText(line, 112, quoteTop + 80 + index * 58);
    });

    if (input.quoteAuthor) {
      ctx.font = `500 30px ${FONT}`;
      ctx.fillStyle = "#8A8178";
      ctx.fillText(`— ${input.quoteAuthor}`, 112, quoteTop + 250);
    }
  }

  const footer = input.streakCount > 0 ? `${input.streakCount}일째 · 마음` : "마음";
  ctx.font = `700 34px ${FONT}`;
  ctx.fillStyle = "rgba(224,122,95,0.85)";
  ctx.textAlign = "right";
  ctx.fillText(footer, SIZE - 84, SIZE - 72);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("이미지 생성 실패"))),
      "image/png",
    );
  });
}
