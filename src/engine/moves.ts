import type { BoardState } from "./board.ts";

export function calculateValidMoves(
  boardState: BoardState,
  index: number,
): number[] {
  const piece = boardState[index];
  if (!piece) return [];

  const moves: number[] = [];
  const [color, type] = [piece[0], piece[1]];
  const opponent = color === "w" ? "b" : "w";

  // Basic move generation logic (to be expanded with actual chess rules)
  switch (type) {
    case "P": // Pawn
      const direction = color === "w" ? -8 : 8; // White moves up, black moves down
      const forwardIndex = index + direction;
      if (boardState[forwardIndex] === null) {
        // first move allows pawn to move two squares
        if ((color === "w" && index >= 48) || (color === "b" && index < 16)) {
          const doubleForwardIndex = index + 2 * direction;
          if (boardState[doubleForwardIndex] === null) {
            moves.push(doubleForwardIndex);
          }
        }
        moves.push(forwardIndex);
      }
      // attack moves for pawns (diagonal captures)
      if (index % 8 !== 0 && boardState[forwardIndex - 1]?.[0] === opponent) {
        moves.push(forwardIndex - 1);
      }
      if (index % 8 !== 7 && boardState[forwardIndex + 1]?.[0] === opponent) {
        moves.push(forwardIndex + 1);
      }
      break;
    case "R": // Rook
      // Add logic for rook moves (horizontal and vertical)
      const directions = [-8, 8, -1, 1]; // up, down, left, right
      for (const dir of directions) {
        let nextIndex = index + dir;
        while (nextIndex >= 0 && nextIndex < 64) {
          if (boardState[nextIndex] === null) {
            moves.push(nextIndex);
          } else {
            if (boardState[nextIndex]?.[0] === opponent) {
              moves.push(nextIndex); // Can capture opponent piece
            }
            break; // Stop if we hit any piece
          }
          nextIndex += dir;
        }
      }
      break;
    case "N": // Knight
      // Add logic for knight moves (L-shaped)
      const knightMoves = [-17, -15, -10, -6, 6, 10, 15, 17]; // Possible knight move offsets
      for (const move of knightMoves) {
        const nextIndex = index + move;
        if (
          nextIndex >= 0 &&
          nextIndex < 64 &&
          (boardState[nextIndex] === null ||
            boardState[nextIndex]?.[0] === opponent)
        ) {
          moves.push(nextIndex);
        }
      }
      break;
    case "B": // Bishop
      // Add logic for bishop moves (diagonal)
      const bishopDirections = [-9, -7, 7, 9]; // diagonal directions
      for (const dir of bishopDirections) {
        let nextIndex = index + dir;
        while (nextIndex >= 0 && nextIndex < 64) {
          if (boardState[nextIndex] === null) {
            moves.push(nextIndex);
          } else {
            if (boardState[nextIndex]?.[0] === opponent) {
              moves.push(nextIndex); // Can capture opponent piece
            }
            break; // Stop if we hit any piece
          }
          nextIndex += dir;
        }
      }
      break;
    case "Q": // Queen
      // Add logic for queen moves (combination of rook and bishop)
      const queenDirections = [-8, 8, -1, 1, -9, -7, 7, 9]; // all directions
      for (const dir of queenDirections) {
        let nextIndex = index + dir;
        while (nextIndex >= 0 && nextIndex < 64) {
          if (boardState[nextIndex] === null) {
            moves.push(nextIndex);
          } else {
            if (boardState[nextIndex]?.[0] === opponent) {
              moves.push(nextIndex); // Can capture opponent piece
            }
            break; // Stop if we hit any piece
          }
          nextIndex += dir;
        }
      }
      break;
    case "K": // King
      // Add logic for king moves (one square in any direction)
      const kingMoves = [-8, 8, -1, 1, -9, -7, 7, 9]; // all directions
      for (const move of kingMoves) {
        const nextIndex = index + move;
        if (
          nextIndex >= 0 &&
          nextIndex < 64 &&
          (boardState[nextIndex] === null ||
            boardState[nextIndex]?.[0] === opponent)
        ) {
          moves.push(nextIndex);
        }
      }
      break;
    default:
      break;
  }

  return moves;
}
