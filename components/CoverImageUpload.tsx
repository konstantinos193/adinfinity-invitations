'use client';

import { useCallback, useRef, useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { supabase, COVER_BUCKET } from '@/lib/supabase';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function CoverImageUpload({ value, onChange }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Επιλέξτε αρχείο εικόνας.');
      return;
    }
    const ratio = await new Promise<number>((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => { resolve(img.width / img.height); URL.revokeObjectURL(url); };
      img.src = url;
    });
    if (Math.abs(ratio - 16 / 9) > (16 / 9) * 0.04) {
      setError(`Μόνο 16:9 εικόνες γίνονται δεκτές. Η δική σου είναι ${ratio.toFixed(2)}:1 — δοκίμασε να την κόψεις σε 16:9 πρώτα.`);
      return;
    }
    setError('');
    setUploading(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(COVER_BUCKET).upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(COVER_BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e: any) {
      setError(e?.message ?? 'Αποτυχία αποφόρτωσης.');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [upload]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = '';
  };

  const clear = () => onChange('');

  if (value) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-[#01FFFF]/20 aspect-video">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="Cover" className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={clear}
          className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-lg p-1.5 transition-colors"
        >
          <X size={14} />
        </button>
        <div className="absolute bottom-2 left-2 bg-black/50 text-white/60 text-xs px-2 py-1 rounded-md">
          16:9 · 1920×1080
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center gap-3 aspect-video rounded-xl border-2 border-dashed cursor-pointer transition-colors
          ${dragging ? 'border-[#01FFFF]/60 bg-[#01FFFF]/5' : 'border-[#01FFFF]/20 hover:border-[#01FFFF]/40 bg-[#07141C]'}
          ${uploading ? 'pointer-events-none' : ''}`}
      >
        {uploading ? (
          <>
            <Loader2 size={28} className="text-[#01FFFF]/60 animate-spin" />
            <p className="text-sm text-white/40">Μεταφόρτωση...</p>
          </>
        ) : (
          <>
            <UploadCloud size={28} className="text-[#01FFFF]/50" />
            <div className="text-center">
              <p className="text-sm text-white/60">
                Σύρε εδώ ή <span className="text-[#01FFFF]/80 underline">επίλεξε αρχείο</span>
              </p>
              <p className="text-xs text-white/25 mt-1">JPG, PNG, WEBP · Αυτόματη κοπή σε 16:9</p>
            </div>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
