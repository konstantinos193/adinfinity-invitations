'use client';

import { useCallback, useRef, useState } from 'react';
import { Music, X, Loader2, UploadCloud } from 'lucide-react';
import { supabase, COVER_BUCKET } from '@/lib/supabase';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

const ACCEPTED = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/m4a', 'audio/x-m4a'];
const ACCEPTED_EXT = ['.mp3', '.wav', '.ogg', '.aac', '.m4a'];

export default function MusicUpload({ value, onChange }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ACCEPTED.includes(file.type) && !ACCEPTED_EXT.includes(`.${ext}`)) {
      setError('Επιλέξτε αρχείο MP3, WAV, OGG, AAC ή M4A.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const path = `music/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(COVER_BUCKET).upload(path, file, {
        contentType: file.type || `audio/${ext}`,
        upsert: false,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(COVER_BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e: any) {
      setError(e?.message ?? 'Αποτυχία μεταφόρτωσης.');
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

  if (value) {
    const filename = decodeURIComponent(value.split('/').pop() ?? 'audio').replace(/^\d+-[a-z0-9]+\./, '');
    return (
      <div className="flex items-center gap-3 bg-[#07141C] border border-[#01FFFF]/20 rounded-xl px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-[#01FFFF]/10 flex items-center justify-center shrink-0">
          <Music size={15} className="text-[#01FFFF]/70" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white/80 truncate">{filename}</p>
          <p className="text-xs text-white/30 mt-0.5">Ανεβασμένο αρχείο</p>
        </div>
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-white/25 hover:text-red-400 transition-colors p-1 rounded shrink-0"
        >
          <X size={15} />
        </button>
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
        className={`flex items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors py-5 px-4
          ${dragging ? 'border-[#01FFFF]/60 bg-[#01FFFF]/5' : 'border-[#01FFFF]/20 hover:border-[#01FFFF]/40 bg-[#07141C]'}
          ${uploading ? 'pointer-events-none' : ''}`}
      >
        {uploading ? (
          <>
            <Loader2 size={20} className="text-[#01FFFF]/60 animate-spin shrink-0" />
            <span className="text-sm text-white/40">Μεταφόρτωση...</span>
          </>
        ) : (
          <>
            <UploadCloud size={20} className="text-[#01FFFF]/50 shrink-0" />
            <div>
              <p className="text-sm text-white/60">
                Σύρε εδώ ή <span className="text-[#01FFFF]/80 underline">επίλεξε αρχείο</span>
              </p>
              <p className="text-xs text-white/25 mt-0.5">MP3, WAV, OGG, AAC, M4A</p>
            </div>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="audio/mpeg,audio/wav,audio/ogg,audio/aac,audio/m4a,audio/x-m4a,.mp3,.wav,.ogg,.aac,.m4a"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
