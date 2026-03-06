import { algebraicToIndex, type FenState } from "./board.ts";

export function calculateValidMoves(
  fenState: FenState,
  index: number,
): number[] {
  const { board, enPassant, castling } = fenState;
  const piece = board[index];
  if (!piece) return [];

  const moves: number[] = [];
  const isWhitePiece = piece === piece.toUpperCase();
  const type = piece.toUpperCase();
  const epIndex = enPassant !== "-" ? algebraicToIndex(enPassant) : -1;

  const isOpponent = (p: string | null): boolean =>
    p !== null && (p === p.toUpperCase()) !== isWhitePiece;
  const isEmpty = (p: string | null): boolean => p === null;
  const isEmptyOrOpponent = (p: string | null): boolean =>
    isEmpty(p) || isOpponent(p);

  switch (type) {
    case "P": {
      const direction = isWhitePiece ? -8 : 8;
      const startRankMin = isWhitePiece ? 48 : 8;
      const startRankMax = isWhitePiece ? 55 : 15;
      const forwardIndex = index + direction;
      if (
        forwardIndex >= 0 &&
        forwardIndex < 64 &&
        isEmpty(board[forwardIndex])
      ) {
        moves.push(forwardIndex);
        if (index >= startRankMin && index <= startRankMax) {
          const doubleForwardIndex = index + 2 * direction;
          if (isEmpty(board[doubleForwardIndex])) {
            moves.push(doubleForwardIndex);
          }
        }
      }
      // Diagonal captures + en passant
      const leftCapture = forwardIndex - 1;
      const rightCapture = forwardIndex + 1;
      if (
        index % 8 !== 0 &&
        (isOpponent(board[leftCapture]) ||
          (epIndex !== -1 && leftCapture === epIndex))
      ) {
        moves.push(leftCapture);
      }
      if (
        index % 8 !== 7 &&
        (isOpponent(board[rightCapture]) ||
          (epIndex !== -1 && rightCapture === epIndex))
      ) {
        moves.push(rightCapture);
      }
      break;
    }
    case "R": {
      for (const dir of [-8, 8, -1, 1]) {
        let nextIndex = index + dir;
        while (nextIndex >= 0 && nextIndex < 64) {
          if (dir === 1 && nextIndex % 8 === 0) break;
          if (dir === -1 && nextIndex % 8 === 7) break;
          if (isEmpty(board[nextIndex])) {
            moves.push(nextIndex);
          } else {
            if (isOpponent(board[nextIndex])) moves.push(nextIndex);
            break;
          }
          nextIndex += dir;
        }
      }
      break;
    }
    case "N": {
      for (const move of [-17, -15, -10, -6, 6, 10, 15, 17]) {
        const nextIndex = index + move;
        if (
          nextIndex >= 0 &&
          nextIndex < 64 &&
          Math.abs((nextIndex % 8) - (index % 8)) <= 2 &&
          isEmptyOrOpponent(board[nextIndex])
        ) {
          moves.push(nextIndex);
        }
      }
      break;
    }
    case "B": {
      for (const dir of [-9, -7, 7, 9]) {
        let nextIndex = index + dir;
        while (nextIndex >= 0 && nextIndex < 64) {
          if ((dir === 9 || dir === -7) && nextIndex % 8 === 0) break;
          if ((dir === 7 || dir === -9) && nextIndex % 8 === 7) break;
          if (isEmpty(board[nextIndex])) {
            moves.push(nextIndex);
          } else {
            if (isOpponent(board[nextIndex])) moves.push(nextIndex);
            break;
          }
          nextIndex += dir;
        }
      }
      break;
    }
    case "Q": {
      for (const dir of [-8, 8, -1, 1, -9, -7, 7, 9]) {
        let nextIndex = index + dir;
        while (nextIndex >= 0 && nextIndex < 64) {
          if ((dir === 1 || dir === 9 || dir === -7) && nextIndex % 8 === 0)
            break;
          if ((dir === -1 || dir === 7 || dir === -9) && nextIndex % 8 === 7)
            break;
          if (isEmpty(board[nextIndex])) {
            moves.push(nextIndex);
          } else {
            if (isOpponent(board[nextIndex])) moves.push(nextIndex);
            break;
          }
          nextIndex += dir;
        }
      }
      break;
    }
    case "K": {
      for (const move of [-8, 8, -1, 1, -9, -7, 7, 9]) {
        const nextIndex = index + move;
        if (
          nextIndex >= 0 &&
          nextIndex < 64 &&
          Math.abs((nextIndex % 8) - (index % 8)) <= 1 &&
          isEmptyOrOpponent(board[nextIndex])
        ) {
          moves.push(nextIndex);
        }
      }
      // Castling
      if (isWhitePiece && index === 60) {
        if (
          castling.includes("K") &&
          board[61] === null &&
          board[62] === null &&
          board[63] === "R"
        ) {
          moves.push(62);
        }
        if (
          castling.includes("Q") &&
          board[59] === null &&
          board[58] === null &&
          board[57] === null &&
          board[56] === "R"
        ) {
          moves.push(58);
        }
      } else if (!isWhitePiece && index === 4) {
        if (
          castling.includes("k") &&
          board[5] === null &&
          board[6] === null &&
          board[7] === "r"
        ) {
          moves.push(6);
        }
        if (
          castling.includes("q") &&
          board[3] === null &&
          board[2] === null &&
          board[1] === null &&
          board[0] === "r"
        ) {
          moves.push(2);
        }
      }
      break;
    }
    default:
      break;
  }

  return moves;
}
