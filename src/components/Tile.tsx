type TileProps = {
  index: number;
  piece?: string | null;
  isHighlighted?: boolean;
  onClickCallback?: (index: number) => void;
  onDragStartCallback?: (index: number) => void;
  onDropCallback?: (index: number) => void;
};

function getPieceImage(piece: string) {
  const pieceMap: Record<string, string> = {
    wP: "/pieces/wP.svg", // White Pawn
    wN: "/pieces/wN.svg", // White Knight
    wB: "/pieces/wB.svg", // White Bishop
    wR: "/pieces/wR.svg", // White Rook
    wQ: "/pieces/wQ.svg", // White Queen
    wK: "/pieces/wK.svg", // White King
    bP: "/pieces/bP.svg", // Black Pawn
    bN: "/pieces/bN.svg", // Black Knight
    bB: "/pieces/bB.svg", // Black Bishop
    bR: "/pieces/bR.svg", // Black Rook
    bQ: "/pieces/bQ.svg", // Black Queen
    bK: "/pieces/bK.svg", // Black King
  };
  return pieceMap[piece] || "";
}

export default function Tile({
  index,
  piece,
  isHighlighted = false,
  onClickCallback,
  onDragStartCallback,
  onDropCallback,
}: TileProps) {
  const isDarkTile = (index + Math.floor(index / 8)) % 2 === 1;
  const tileColor = isDarkTile ? "bg-gray-500" : "bg-gray-300";
  return (
    <div
      class={`w-16 h-16 ${tileColor} flex items-center justify-center relative`}
      onClick={() => onClickCallback?.(index)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDropCallback?.(index)}
    >
      {isHighlighted && (
        <div class="absolute w-4 h-4 bg-yellow-400 rounded-full opacity-75"></div>
      )}
      {piece && (
        <img
          src={getPieceImage(piece)}
          alt={piece}
          class="w-12 h-12"
          draggable
          onDragStart={() => onDragStartCallback?.(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDropCallback?.(index)}
        />
      )}
    </div>
  );
}
