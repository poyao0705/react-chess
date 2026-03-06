import {
  algebraicToIndex,
  fenStateToFen,
  initialFenState,
  parseFen,
  type FenState,
} from "../engine/board";
import { useReducer } from "preact/hooks";
import { calculateValidMoves } from "../engine/moves";

type GameState = {
  fenState: FenState;
  selectedIndex: number | null;
  validMoves: number[];
  status: "playing" | "check" | "checkmate" | "stalemate";
};

type Action =
  | { type: "SELECT_TILE"; index: number }
  | { type: "MOVE_PIECE"; from: number; to: number }
  | { type: "RESET_GAME" };

const initialState: GameState = {
  fenState: initialFenState(),
  selectedIndex: null,
  validMoves: [],
  status: "playing",
};

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "SELECT_TILE": {
      const { board, turn } = state.fenState;
      const piece = board[action.index];
      if (!piece) return state;
      const isWhitePiece = piece === piece.toUpperCase();
      if ((turn === "w") !== isWhitePiece) return state;
      return {
        ...state,
        selectedIndex: action.index,
        validMoves: calculateValidMoves(state.fenState, action.index),
      };
    }
    case "MOVE_PIECE": {
      if (!state.validMoves.includes(action.to)) return state;

      const { board, turn, castling, enPassant, halfmove, fullmove } =
        state.fenState;
      const piece = board[action.from]!;
      const type = piece.toUpperCase();
      const isCapture = board[action.to] !== null;

      const newBoard = [...board];
      newBoard[action.to] = newBoard[action.from];
      newBoard[action.from] = null;

      // En passant capture: remove the captured pawn
      let newEnPassant = "-";
      if (type === "P") {
        if (enPassant !== "-" && action.to === algebraicToIndex(enPassant)) {
          const capturedPawnIndex = action.to + (turn === "w" ? 8 : -8);
          newBoard[capturedPawnIndex] = null;
        }
        // Set new en passant target if pawn moved two squares
        if (Math.abs(action.to - action.from) === 16) {
          const epIdx = (action.from + action.to) / 2;
          const epFile = String.fromCharCode("a".charCodeAt(0) + (epIdx % 8));
          const epRank = 8 - Math.floor(epIdx / 8);
          newEnPassant = `${epFile}${epRank}`;
        }
      }

      // Pawn promotion
      if (newBoard[action.to] === "P" && action.to < 8) {
        newBoard[action.to] = "Q";
      } else if (newBoard[action.to] === "p" && action.to >= 56) {
        newBoard[action.to] = "q";
      }

      // Castling: move the rook when king castles
      if (type === "K") {
        if (action.from === 60 && action.to === 62) {
          newBoard[61] = "R";
          newBoard[63] = null;
        } else if (action.from === 60 && action.to === 58) {
          newBoard[59] = "R";
          newBoard[56] = null;
        } else if (action.from === 4 && action.to === 6) {
          newBoard[5] = "r";
          newBoard[7] = null;
        } else if (action.from === 4 && action.to === 2) {
          newBoard[3] = "r";
          newBoard[0] = null;
        }
      }

      // Update castling rights
      let newCastling = castling;
      if (type === "K") {
        if (turn === "w")
          newCastling = newCastling.replace("K", "").replace("Q", "");
        else newCastling = newCastling.replace("k", "").replace("q", "");
      }
      if (type === "R") {
        if (action.from === 63) newCastling = newCastling.replace("K", "");
        if (action.from === 56) newCastling = newCastling.replace("Q", "");
        if (action.from === 7) newCastling = newCastling.replace("k", "");
        if (action.from === 0) newCastling = newCastling.replace("q", "");
      }
      // Rook captured: revoke rights for that corner
      if (action.to === 63) newCastling = newCastling.replace("K", "");
      if (action.to === 56) newCastling = newCastling.replace("Q", "");
      if (action.to === 7) newCastling = newCastling.replace("k", "");
      if (action.to === 0) newCastling = newCastling.replace("q", "");
      if (newCastling === "") newCastling = "-";

      const newHalfmove = type === "P" || isCapture ? 0 : halfmove + 1;
      const newFullmove = turn === "b" ? fullmove + 1 : fullmove;
      const newTurn: "w" | "b" = turn === "w" ? "b" : "w";

      const newFenState: FenState = {
        board: newBoard,
        turn: newTurn,
        castling: newCastling,
        enPassant: newEnPassant,
        halfmove: newHalfmove,
        fullmove: newFullmove,
      };

      return {
        ...state,
        fenState: newFenState,
        selectedIndex: null,
        validMoves: [],
      };
    }
    case "RESET_GAME":
      return initialState;
    default:
      return state;
  }
};

export function useChessGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const handleDragStart = (index: number) => {
    dispatch({ type: "SELECT_TILE", index });
  };

  const handleDrop = (index: number) => {
    if (state.selectedIndex !== null && state.selectedIndex !== index) {
      dispatch({ type: "MOVE_PIECE", from: state.selectedIndex, to: index });
    }
  };

  return {
    boardState: state.fenState.board,
    currentTurn: state.fenState.turn === "w" ? "white" : "black",
    fen: fenStateToFen(state.fenState),
    selectedIndex: state.selectedIndex,
    validMoves: state.validMoves,
    status: state.status,
    handleDragStart,
    handleDrop,
    // expose parseFen so consumers can import prebuilt positions
    loadFen: (fen: string) => {
      // handled externally; exposed for future use
      void parseFen(fen);
    },
  };
}
