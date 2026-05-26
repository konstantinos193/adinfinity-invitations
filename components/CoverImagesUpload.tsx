'use client';

import { useCallback, useRef, useState } from 'react';
import { UploadCloud, X, Loader2, GripVertical } from 'lucide-react';
import { supabase, COVER_BUCKET } from '@/lib/supabase';

interface Props {
  values: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export default function CoverImagesUpload({ values, onChange, max = 8 }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [draggingOver, setDraggingOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) return null;
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage.from(COVER_BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (upErr) throw upErr;
    const { data } = supabase.storage.from(COVER_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }, []);

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!arr.length) { setError('Επιλέξτε αρχεία εικόνας.'); return; }
    const remaining = max - values.length;
    if (remaining <= 0) { setError(`Μέγιστο ${max} εικόνες.`); return; }
    const toUpload = arr.slice(0, remaining);
    setError('');
    setUploading(true);
    try {
      const urls = await Promise.all(toUpload.map(uploadFile));
      onChange([...values, ...urls.filter(Boolean) as string[]]);
    } catch (e: any) {
      setError(e?.message ?? 'Αποτυχία μεταφόρτωσης.');
    } finally {
      setUploading(false);
    }
  }, [values, max, onChange, uploadFile]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDraggingOver(false);
    uploadFiles(e.dataTransfer.files);
  }, [uploadFiles]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files);
    e.target.value = '';
  };

  const remove = (idx: number) => onChange(values.filter((_, i) => i !== idx));

  // Drag-to-reorder handlers
  const onDragStart = (idx: number) => { dragItem.current = idx; };
  const onDragEnterItem = (idx: number) => { dragOver.current = idx; };
  const onDragEndItem = () => {
    if (dragItem.current === null || dragOver.current === null) return;
    if (dragItem.current === dragOver.current) return;
    const reordered = [...values];
    const [moved] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOver.current, 0, moved);
    onChange(reordered);
    dragItem.current = null;
    dragOver.current = null;
  };

  return (
    <div className="space-y-3">
      {/* Image grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {values.map((url, idx) => (
            <div
              key={url}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragEnter={() => onDragEnterItem(idx)}
              onDragEnd={onDragEndItem}
              onDragOver={(e) => e.preventDefault()}
              className="relative group rounded-xl overflow-hidden border border-[#01FFFF]/15 aspect-video cursor-grab active:cursor-grabbing"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Cover ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              {/* Drag handle */}
              <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity text-white/70">
                <GripVertical size={14} />
              </div>
              {/* Index badge */}
              <div className="absolute top-1 right-6 bg-black/50 text-white/70 text-[10px] px-1.5 py-0.5 rounded-md font-mono">
                {idx + 1}
              </div>
              {/* Remove */}
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute top-1 right-1 bg-black/60 hover:bg-red-500/80 text-white rounded-md p-0.5 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={12} />
              </button>
              {idx === 0 && (
                <div className="absolute bottom-1 left-1 bg-black/50 text-white/60 text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                  1η
                </div>
              )}
            </div>
          ))}

          {/* Add more slot */}
          {values.length < max && (
            <div
              onClick={() => !uploading && inputRef.current?.click()}
              className="relative rounded-xl border-2 border-dashed border-[#01FFFF]/20 hover:border-[#01FFFF]/40 aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#07141C] text-white/30 hover:text-white/60"
            >
              {uploading
                ? <Loader2 size={18} className="animate-spin text-[#01FFFF]/50" />
                : <><UploadCloud size={18} /><span className="text-[10px] mt-1">Προσθήκη</span></>
              }
            </div>
          )}
        </div>
      )}

      {/* Drop zone (shown when no images or as add-more) */}
      {values.length === 0 && (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
          onDragLeave={() => setDraggingOver(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors py-8
            ${draggingOver ? 'border-[#01FFFF]/60 bg-[#01FFFF]/5' : 'border-[#01FFFF]/20 hover:border-[#01FFFF]/40 bg-[#07141C]'}
            ${uploading ? 'pointer-events-none' : ''}`}
        >
          {uploading ? (
            <><Loader2 size={24} className="text-[#01FFFF]/60 animate-spin" /><span className="text-sm text-white/40">Μεταφόρτωση...</span></>
          ) : (
            <>
              <UploadCloud size={24} className="text-[#01FFFF]/50" />
              <div className="text-center">
                <p className="text-sm text-white/60">Σύρε εδώ ή <span className="text-[#01FFFF]/80 underline">επίλεξε εικόνες</span></p>
                <p className="text-xs text-white/25 mt-1">Έως {max} εικόνες · JPG, PNG, WEBP · Σύρε για αλλαγή σειράς</p>
              </div>
            </>
          )}
        </div>
      )}

      {values.length > 0 && (
        <p className="text-xs text-white/25">
          {values.length}/{max} εικόνες · Σύρε για αλλαγή σειράς · Η πρώτη εμφανίζεται 1η
        </p>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
