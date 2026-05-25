'use client';

import { useCallback, useRef, useState } from 'react';
import { UploadCloud, X, Loader2, Video } from 'lucide-react';
import { supabase, VIDEO_BUCKET } from '@/lib/supabase';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

const ACCEPTED = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'];
const MAX_MB = 500;

export default function VideoUpload({ value, onChange }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      setError('Επιλέξτε αρχείο βίντεο (MP4, MOV, WEBM).');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Το αρχείο υπερβαίνει τα ${MAX_MB} MB.`);
      return;
    }
    setError('');
    setUploading(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(VIDEO_BUCKET).upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path);
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
      <div className="relative rounded-xl overflow-hidden border border-purple-500/20 bg-[#07141C]">
        <video
          src={value}
          controls
          className="w-full rounded-xl"
          style={{ maxHeight: '260px' }}
        />
        <button
          type="button"
          onClick={clear}
          className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-lg p-1.5 transition-colors"
        >
          <X size={14} />
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
        className={`relative flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed cursor-pointer transition-colors
          ${dragging ? 'border-purple-500/60 bg-purple-500/5' : 'border-purple-500/20 hover:border-purple-500/40 bg-[#07141C]'}
          ${uploading ? 'pointer-events-none' : ''}`}
      >
        {uploading ? (
          <>
            <Loader2 size={28} className="text-purple-400/60 animate-spin" />
            <p className="text-sm text-white/40">Μεταφόρτωση βίντεο...</p>
            <p className="text-xs text-white/20">Αυτό μπορεί να πάρει λίγο χρόνο</p>
          </>
        ) : (
          <>
            <Video size={28} className="text-purple-400/50" />
            <div className="text-center">
              <p className="text-sm text-white/60">
                Σύρε εδώ ή <span className="text-purple-400/80 underline">επίλεξε αρχείο</span>
              </p>
              <p className="text-xs text-white/25 mt-1">MP4, MOV, WEBM · έως {MAX_MB} MB</p>
            </div>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
