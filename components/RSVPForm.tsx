'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { submitRsvp } from '@/lib/api';
import type { CreateRsvpPayload } from '@/lib/types';

interface Props {
  slug: string;
  rsvpDeadline: string | null;
  color?: string;
}

type Step = 'attending' | 'details' | 'done';

export default function RSVPForm({ slug, rsvpDeadline, color }: Props) {
  const c = color ?? '#b8960c';
  const [step, setStep] = useState<Step>('attending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<CreateRsvpPayload>({
    guestName: '',
    phone: '',
    attending: true,
    adultCount: 1,
    hasChildren: false,
    childCount: 0,
    dietary: 'NONE',
    hasAllergy: false,
    allergyNote: '',
    message: '',
  });

  const set = (key: keyof CreateRsvpPayload, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guestName.trim()) { setError('Παρακαλώ εισάγετε το ονοματεπώνυμό σας.'); return; }
    setLoading(true);
    setError('');
    try {
      await submitRsvp(slug, form);
      setStep('done');
    } catch {
      setError('Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full rounded-xl px-4 py-3 text-[#2c1810] bg-white focus:outline-none text-sm';
  const labelCls = 'block text-sm font-medium text-[#5c3320] mb-1.5';

  const deadlinePassed =
    rsvpDeadline != null && new Date(rsvpDeadline) < new Date();

  return (
    <section className="py-20 px-4 bg-[#fdfaf6]" id="rsvp">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <p className="tracking-[0.3em] uppercase text-sm mb-4 font-medium" style={{ color: c }}>
            Απάντηση
          </p>
          <h2 className="font-serif text-4xl text-[#2c1810] italic">RSVP</h2>
          <div className="divider mt-6 mb-4" />
          {rsvpDeadline && (
            <p className={`text-sm ${deadlinePassed ? 'text-red-500 font-medium' : 'text-[#5c3320]/60'}`}>
              {deadlinePassed ? 'Η προθεσμία έχει παρέλθει' : `Παρακαλούμε απαντήστε έως ${new Date(rsvpDeadline).toLocaleDateString('el-GR')}`}
            </p>
          )}
        </div>

        {deadlinePassed ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm" style={{ border: `1px solid ${c}1a` }}>
            <h3 className="font-serif text-xl text-[#2c1810] mb-2">Η προθεσμία έχει παρέλθει</h3>
            <p className="text-sm text-[#5c3320]/60">
              Η περίοδος RSVP για αυτή την πρόσκληση έχει λήξει.
            </p>
          </div>
        ) : (
        <AnimatePresence mode="wait">
          {step === 'done' ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-white rounded-2xl p-10 shadow-sm"
              style={{ border: `1px solid ${c}1a` }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: c + '1a' }}
              >
                <Heart size={28} style={{ color: c }} />
              </div>
              <h3 className="font-serif text-2xl text-[#2c1810] mb-3">
                {form.attending ? 'Σας περιμένουμε!' : 'Λάβαμε την απάντησή σας'}
              </h3>
              <p className="text-[#5c3320]/70">
                {form.attending
                  ? 'Χαιρόμαστε ιδιαίτερα που θα μπορέσετε να έρθετε!'
                  : 'Λυπούμαστε που δεν θα μπορέσετε να παραστείτε.'}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-sm space-y-6"
              style={{ border: `1px solid ${c}1a` }}
            >
              {/* Will you attend? */}
              <div>
                <label className={labelCls}>Θα παραστείτε; *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: true, label: 'Ναι, θα είμαι εκεί!' },
                    { value: false, label: 'Δυστυχώς όχι' },
                  ].map(({ value, label }) => (
                    <button
                      key={String(value)}
                      type="button"
                      onClick={() => set('attending', value)}
                      className="py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all"
                      style={form.attending === value
                        ? { borderColor: c, backgroundColor: c + '1a', color: '#2c1810' }
                        : { borderColor: c + '33', color: '#5c3320' }
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className={labelCls}>Ονοματεπώνυμο *</label>
                <input
                  className={inputCls}
                  style={{ border: `1px solid ${c}4d` }}
                  value={form.guestName}
                  onChange={(e) => set('guestName', e.target.value)}
                  placeholder="Όνομα Επώνυμο"
                />
              </div>

              {/* Phone */}
              <div>
                <label className={labelCls}>Κινητό</label>
                <input
                  className={inputCls}
                  style={{ border: `1px solid ${c}4d` }}
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="69X XXX XXXX"
                  type="tel"
                />
              </div>

              {form.attending && (
                <>
                  {/* Adults */}
                  <div>
                    <label className={labelCls}>Αριθμός ενηλίκων *</label>
                    <select
                      className={inputCls}
                      style={{ border: `1px solid ${c}4d` }}
                      value={form.adultCount}
                      onChange={(e) => set('adultCount', Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>

                  {/* Children */}
                  <div>
                    <label className={labelCls}>Παιδιά;</label>
                    <div className="flex gap-3">
                      {[
                        { v: false, l: 'Όχι' },
                        { v: true, l: 'Ναι' },
                      ].map(({ v, l }) => (
                        <button
                          key={String(v)}
                          type="button"
                          onClick={() => set('hasChildren', v)}
                          className="flex-1 py-2.5 rounded-xl text-sm border-2 transition-all"
                          style={form.hasChildren === v
                            ? { borderColor: c, backgroundColor: c + '1a', color: '#2c1810' }
                            : { borderColor: c + '33', color: '#5c3320' }
                          }
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.hasChildren && (
                    <div>
                      <label className={labelCls}>Αριθμός παιδιών</label>
                      <select
                        className={inputCls}
                        style={{ border: `1px solid ${c}4d` }}
                        value={form.childCount}
                        onChange={(e) => set('childCount', Number(e.target.value))}
                      >
                        {[1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Dietary */}
                  <div>
                    <label className={labelCls}>Διατροφικές συνήθειες</label>
                    <div className="flex gap-3 flex-wrap">
                      {(['NONE', 'VEGAN', 'VEGETARIAN'] as const).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => set('dietary', d)}
                          className="px-4 py-2 rounded-xl text-sm border-2 transition-all"
                          style={form.dietary === d
                            ? { borderColor: c, backgroundColor: c + '1a', color: '#2c1810' }
                            : { borderColor: c + '33', color: '#5c3320' }
                          }
                        >
                          {d === 'NONE' ? 'Κανένα' : d === 'VEGAN' ? 'Vegan' : 'Vegetarian'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Allergy */}
                  <div>
                    <label className={labelCls}>Αλλεργία σε τρόφιμο;</label>
                    <div className="flex gap-3 mb-3">
                      {[
                        { v: false, l: 'Όχι' },
                        { v: true, l: 'Ναι' },
                      ].map(({ v, l }) => (
                        <button
                          key={String(v)}
                          type="button"
                          onClick={() => set('hasAllergy', v)}
                          className="flex-1 py-2.5 rounded-xl text-sm border-2 transition-all"
                          style={form.hasAllergy === v
                            ? { borderColor: c, backgroundColor: c + '1a', color: '#2c1810' }
                            : { borderColor: c + '33', color: '#5c3320' }
                          }
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                    {form.hasAllergy && (
                      <input
                        className={inputCls}
                        style={{ border: `1px solid ${c}4d` }}
                        value={form.allergyNote}
                        onChange={(e) => set('allergyNote', e.target.value)}
                        placeholder="Περιγράψτε την αλλεργία..."
                      />
                    )}
                  </div>
                </>
              )}

              {/* Personal message */}
              <div>
                <label className={labelCls}>Προσωπικό μήνυμα</label>
                <textarea
                  className={`${inputCls} resize-none`}
                  style={{ border: `1px solid ${c}4d` }}
                  rows={3}
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                  placeholder="Γράψτε ένα μήνυμα στο ζευγάρι..."
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-3.5 rounded-xl font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: c }}
              >
                {loading ? 'Αποστολή...' : 'Αποστολή'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
        )}
      </div>
    </section>
  );
}
