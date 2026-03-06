type TileProps = {
  index: number;
  piece?: string | null;
  isHighlighted?: boolean;
  onClickCallback?: (index: number) => void;
  onDragStartCallback?: (index: number) => void;
  onDropCallback?: (index: number) => void;
};

function getPieceImage(piece: string) {
  // FEN chars: uppercase = white, lowercase = black
  const pieceMap: Record<string, string> = {
    P: "/react-chess/pieces/wP.svg",
    N: "/react-chess/pieces/wN.svg",
    B: "/react-chess/pieces/wB.svg",
    R: "/react-chess/pieces/wR.svg",
    Q: "/react-chess/pieces/wQ.svg",
    K: "/react-chess/pieces/wK.svg",
    p: "/react-chess/pieces/bP.svg",
    n: "/react-chess/pieces/bN.svg",
    b: "/react-chess/pieces/bB.svg",
    r: "/react-chess/pieces/bR.svg",
    q: "/react-chess/pieces/bQ.svg",
    k: "/react-chess/pieces/bK.svg",
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
