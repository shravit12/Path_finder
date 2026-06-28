"use client";

import { useState } from "react";
import Cell from "./Cell";

const ROWS = 25;
const COLS = 50;

export default function Grid() {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [walls, setWalls] = useState([]);

  const isWall = (row, col) =>
    walls.some((wall) => wall.row === row && wall.col === col);

  function handleClick(row, col) {
    if (!start) {
      setStart({ row, col });
      return;
    }

    if (!end) {
      setEnd({ row, col });
      return;
    }

    if (
      start.row === row &&
      start.col === col
    )
      return;

    if (
      end.row === row &&
      end.col === col
    )
      return;

    if (isWall(row, col)) {
      setWalls(
        walls.filter(
          (w) => !(w.row === row && w.col === col)
        )
      );
    } else {
      setWalls([...walls, { row, col }]);
    }
  }

  return (
    <div className="overflow-auto rounded-xl border border-zinc-800 bg-zinc-900 p-4">

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 26px)`,
          gap: "1px",
        }}
      >
        {Array.from({ length: ROWS }).map((_, row) =>
          Array.from({ length: COLS }).map((_, col) => {
            let type = "empty";

            if (
              start?.row === row &&
              start?.col === col
            )
              type = "start";

            else if (
              end?.row === row &&
              end?.col === col
            )
              type = "end";

            else if (isWall(row, col))
              type = "wall";

            return (
              <Cell
                key={`${row}-${col}`}
                row={row}
                col={col}
                type={type}
                onClick={handleClick}
              />
            );
          })
        )}
      </div>

    </div>
  );
}