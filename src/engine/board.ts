// src/engine/board.ts

export type BoardState = (string | null)[];

export type FenState = {
  board: BoardState;
  turn: "w" | "b";
  castling: string;
  enPassant: string;
  halfmove: number;
  fullmove: number;
};

export const STARTING_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function algebraicToIndex(square: string): number {
  const file = square.charCodeAt(0) - "a".charCodeAt(0);
  const rank = 8 - parseInt(square[1]);
  return rank * 8 + file;
}

export function parseFen(fen: string): FenState {
  const parts = fen.split(" ");
  const position = parts[0];
  const turn = (parts[1] ?? "w") as "w" | "b";
  const castling = parts[2] ?? "-";
  const enPassant = parts[3] ?? "-";
  const halfmove = parseInt(parts[4] ?? "0");
  const fullmove = parseInt(parts[5] ?? "1");

  const board: BoardState = [];
  for (const row of position.split("/")) {
    for (const char of row) {
      if (/\d/.test(char)) {
        for (let i = 0; i < parseInt(char); i++) board.push(null);
      } else {
        board.push(char);
      }
    }
  }
  return { board, turn, castling, enPassant, halfmove, fullmove };
}

export function fenStateToFen(state: FenState): string {
  let position = "";
  for (let rank = 0; rank < 8; rank++) {
    let empty = 0;
    for (let file = 0; file < 8; file++) {
      const piece = state.board[rank * 8 + file];
      if (piece === null) {
        empty++;
      } else {
        if (empty > 0) {
          position += empty;
          empty = 0;
        }
        position += piece;
      }
    }
    if (empty > 0) position += empty;
    if (rank < 7) position += "/";
  }
  return `${position} ${state.turn} ${state.castling} ${state.enPassant} ${state.halfmove} ${state.fullmove}`;
}

export function initialFenState(): FenState {
  return parseFen(STARTING_FEN);
}
