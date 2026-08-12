"use client";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function GlitchText({ text, className = "", as: Tag = "span" }: GlitchTextProps) {
  return (
    <Tag
      className={`glitch-wrap ${className}`}
      data-text={text}
    >
      {text}
    </Tag>
  );
}
