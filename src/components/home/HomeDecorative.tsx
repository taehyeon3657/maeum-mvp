"use client";

import { useEffect, useState } from "react";

export default function HomeDecorative() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <>
      <div className="cursor-glow" style={{ left: mousePos.x, top: mousePos.y }} />
      <div className="grain" />
      <div className="deco-circle" />
      <div className="deco-circle-inner" />
    </>
  );
}
