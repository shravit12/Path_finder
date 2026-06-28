"use client";

import { Flag, Circle } from "lucide-react";

export default function Cell({
  row,
  col,
  type,
  onClick,
}) {
  let className =
    "bg-white hover:bg-slate-100";

  let content = null;

  switch (type) {
    case "start":
      className = "bg-green-500";
      content = (
        <Circle
          size={12}
          className="text-white"
          fill="white"
        />
      );
      break;

    case "end":
      className = "bg-red-500";
      content = (
        <Flag
          size={12}
          className="text-white"
        />
      );
      break;

    case "wall":
      className = "bg-zinc-900";
      break;
  }

  return (
    <div
      onClick={() => onClick(row, col)}
      className={`flex h-6 w-6 cursor-pointer items-center justify-center border border-slate-200 transition-all duration-150 ${className}`}
    >
      {content}
    </div>
  );
}