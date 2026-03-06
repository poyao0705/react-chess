import type { BoardState } from "../engine/board";
import { initialBoard } from "../engine/board";
import { useReducer } from "preact/hooks";
import { calculateValidMoves } from "../engine/moves";

// custom hook to manage chess game state and logic
type GameState = {
  boardState: BoardState;
  currentTurn: "white" | "black";
  selectedIndex: number | null;
  validMoves: number[]; // List of valid move indices for the selected piece
  status: "playing" | "check" | "checkmate" | "stalemate";
};

type Action =
  | { type: "SELECT_TILE"; index: number }
  | { type: "MOVE_PIECE"; from: number; to: number }
  | { type: "RESET_GAME" };

const initialState: GameState = {
  boardState: initialBoard(),
  currentTurn: "white",
  selectedIndex: null,
  validMoves: [],
  status: "playing",
};

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "SELECT_TILE":
      // Logic to select a piece and calculate valid moves
      //   Only allow selection of pieces that belong to the current player
      const piece = state.boardState[action.index];
      if (!piece) return state;
      const pieceColor = piece[0] === "w" ? "white" : "black";

      //   if (pieceColor !== state.currentTurn) return state; TODO testing
      return {
        ...state,
        selectedIndex: action.index,
        validMoves: calculateValidMoves(state.boardState, action.index),
      };
    case "MOVE_PIECE":
      // Logic to move a piece and update the board state
      if (!state.validMoves.includes(action.to)) {
        return state; // Invalid move, do not update state
      }
      //   switch side
      const newBoard = [...state.boardState];
      newBoard[action.to] = newBoard[action.from]; // Move piece to new position
      newBoard[action.from] = null; // Clear original position
      //  Pawn Promotion
      if (newBoard[action.to] === "wP" && action.to < 8) {
        newBoard[action.to] = "wQ"; // Promote to Queen for simplicity
      } else if (newBoard[action.to] === "bP" && action.to >= 56) {
        newBoard[action.to] = "bQ"; // Promote to Queen for simplicity
      }
      return {
        ...state,
        // remove piece from the original position and place it in the new position
        boardState: newBoard, // Update the board state with the new move
        currentTurn: state.currentTurn === "white" ? "black" : "white",
        selectedIndex: null,
        validMoves: [],
      };
    case "RESET_GAME":
      return initialState;
    default:
      return state;
  }
};
export function useChessGame() {
  // Initialize the chess board state with the standard starting position
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Handler for when a tile is clicked (selecting a piece)
  const handleDragStart = (index: number) => {
    dispatch({ type: "SELECT_TILE", index });
  };

  const handleDrop = (index: number) => {
    if (state.selectedIndex !== null && state.selectedIndex !== index) {
      dispatch({ type: "MOVE_PIECE", from: state.selectedIndex, to: index });
    }
  };
  return { ...state, handleDragStart, handleDrop };
}
