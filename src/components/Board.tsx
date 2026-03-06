import Tile from "./Tile";
import { useChessGame } from "../hook/useChessGame";

export default function Board() {
  const { boardState, validMoves, handleDragStart, handleDrop } =
    useChessGame();

  return (
    <div class="grid grid-cols-8 gap-0">
      {/* Render 64 tiles for the chessboard */}
      {Array.from({ length: 64 }, (_, index) => (
        <Tile
          key={index}
          index={index}
          piece={boardState[index]}
          isHighlighted={validMoves.includes(index)}
          onDragStartCallback={handleDragStart}
          onDropCallback={handleDrop}
        />
      ))}
    </div>
  );
}
