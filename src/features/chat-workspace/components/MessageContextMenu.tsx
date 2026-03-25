import { Edit2, Eye, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

interface MessageContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  readStatus: string;
}

export function MessageContextMenu({
  x,
  y,
  onClose,
  onDelete,
  onEdit,
  readStatus,
}: MessageContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[180px] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
      style={{ left: x, top: y }}
    >
      <button
        onClick={() => {
          onEdit();
          onClose();
        }}
        className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100"
      >
        <Edit2 className="h-4 w-4" />
        Edit Message
      </button>
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Delete Message
      </button>
      <div className="my-1 border-t border-zinc-200" />
      <div className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-600">
        <Eye className="h-4 w-4" />
        {readStatus}
      </div>
    </div>
  );
}
