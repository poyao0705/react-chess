// src/engine/board.ts
import boardText from "./initial-board.txt?raw";

export type BoardState = (string | null)[];

function parseBoardText(text: string): BoardState {
  return text
    .trim()
    .split("\n")
    .flatMap((row) =>
      row
        .trim()
        .split(/\s+/)
        .map((cell) => (cell === "_" ? null : cell)),
    );
}

export function initialBoard(): BoardState {
  return parseBoardText(boardText);
}
