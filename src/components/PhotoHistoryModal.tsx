
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const PhotoHistoryModal: React.FC<{
  open: boolean;
  setOpen: (v: boolean) => void;
  photos?: string[];
}> = ({ open, setOpen, photos = [] }) => {
  // Deduplicate & sort newest first if possible by URL with timestamp (best effort)
  const unique = Array.from(new Set(photos.filter(Boolean)));
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Fotoğraf Geçmişi ({unique.length})</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {unique.map((u, i) => (
            <div key={i} className="rounded-lg overflow-hidden border border-white/10 hover:scale-[1.02] transition">
              <img src={u} className="w-full h-32 object-cover" />
              <div className="text-xs p-1 truncate opacity-70">{u}</div>
            </div>
          ))}
          {unique.length === 0 && <div className="opacity-70">Kayıt yok.</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};
