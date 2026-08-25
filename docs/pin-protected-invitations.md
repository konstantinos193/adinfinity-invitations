# Προσκλητήρια με κωδικό (PIN) — σχεδιασμός

Στόχος: το ζευγάρι να επιλέγει αν το προσκλητήριό του είναι **δημόσιο** (όποιος
έχει το link το βλέπει) ή **κλειδωμένο με PIN** (μόνο όποιος ξέρει τον κωδικό).

**Υλοποιημένο.** Αυτό το έγγραφο περιγράφει πώς δουλεύει και γιατί πάρθηκαν οι
συγκεκριμένες αποφάσεις.

Αρχεία:

| Κομμάτι | Αρχείο |
| --- | --- |
| Schema | `adinfinity-backend/prisma/schema.prisma` |
| PIN / tokens / rate limit | `adinfinity-backend/src/invitations/invitation-access.service.ts` |
| Φιλτράρισμα payload | `adinfinity-backend/src/invitations/invitations.service.ts` |
| `POST /invitations/:slug/unlock` | `adinfinity-backend/src/invitations/invitations.controller.ts` |
| Προστασία RSVP | `adinfinity-backend/src/rsvp/rsvp.controller.ts` |
| PIN gate UI | `components/PinGate.tsx` |
| Cookie + proxies | `lib/access-cookie.ts`, `app/api/unlock/[slug]/route.ts`, `app/api/rsvp/[slug]/route.ts` |
| Admin toggle | `app/admin/edit/[id]/page.tsx` |

---

## 1. Schema (Prisma) — **χρειάζεται migration**

```prisma
enum AccessMode {
  PUBLIC
  PIN
}

model Invitation {
  // …
  accessMode AccessMode @default(PUBLIC)
  accessPin  String?    // bcrypt hash — ποτέ plaintext
}
```

> **Deploy:** το `deploy.sh` τρέχει `npx prisma db push`, οπότε το schema
> συγχρονίζεται αυτόματα. Και οι δύο αλλαγές είναι προσθετικές — νέα στήλη με
> default (`PUBLIC`) και μια nullable — άρα το `db push` περνά χωρίς
> `--accept-data-loss`. Δεν απαιτείται χειροκίνητο βήμα.
>
> Σημείωση: υπάρχει `prisma/migrations/` με δύο migrations, αλλά το deploy
> χρησιμοποιεί `db push` και όχι `migrate deploy`. Δεν πρόσθεσα migration file
> γιατί δεν θα εκτελεστεί ποτέ· αν κάποια στιγμή γυρίσετε σε `migrate deploy`,
> θα χρειαστεί να δημιουργηθεί.

Το `bcryptjs` υπάρχει ήδη στο backend (χρησιμοποιείται για τους admins).

---

## 2. Backend

### `GET /invitations/:slug`

Αν `accessMode === 'PIN'` και δεν υπάρχει έγκυρο unlock token, επιστρέφει
**μόνο** ένα ελάχιστο payload:

```json
{ "slug": "ioanna-alexandros", "accessMode": "PIN", "locked": true }
```

Κανένα όνομα, ημερομηνία, διεύθυνση, τηλέφωνο ή IBAN. Το φιλτράρισμα γίνεται
**στο backend** — όχι κρύβοντας πεδία στο frontend, γιατί τότε τα δεδομένα
ταξιδεύουν ήδη στον browser.

### `POST /invitations/:slug/unlock`

```
body: { pin: string }
→ 200 { token: string }   // JWT, scoped στο συγκεκριμένο slug, ~30 ημέρες
→ 401                      // λάθος PIN
→ 429                      // πολλές προσπάθειες
```

**Rate limiting υποχρεωτικό.** Ένα 4ψήφιο PIN έχει 10.000 συνδυασμούς — χωρίς
όριο σπάει σε δευτερόλεπτα. Πρόταση: 5 προσπάθειες / 15 λεπτά ανά IP+slug, με
την ίδια in-memory προσέγγιση που χρησιμοποιεί ήδη το `LeadsController`.

### `POST /invitations/:slug/rsvp`

Πρέπει **και αυτό** να απαιτεί το unlock token όταν `accessMode === 'PIN'`.
Αλλιώς κάποιος χωρίς τον κωδικό μπορεί να στέλνει RSVP στο προσκλητήριο.

---

## 3. Frontend

### Ροή

1. Το `app/[slug]/page.tsx` διαβάζει cookie `inv_<slug>`.
2. Το περνά ως `Authorization` στο `getInvitation`.
3. Αν γυρίσει `locked: true` → render `<PinGate slug={slug} />` αντί για το
   προσκλητήριο.
4. Το `PinGate` (client) κάνει POST στο `/api/unlock` (Next Route Handler), που
   καλεί το backend και θέτει το cookie **httpOnly**.
5. `router.refresh()` → η σελίδα ξαναφορτώνει ξεκλείδωτη.

Cookie: `httpOnly`, `secure`, `sameSite=lax`, ανά slug, ~30 ημέρες. Το token δεν
πρέπει να είναι προσβάσιμο από JS (αποφυγή διαρροής μέσω XSS).

### ⚠️ Τρία σημεία που διαρρέουν δεδομένα αν αγνοηθούν

Αυτά είναι τα μη προφανή — το PIN gate από μόνο του **δεν** αρκεί:

**α) ISR cache.** Το `getInvitation` τρέχει σήμερα με `next: { revalidate: 60 }`,
δηλαδή κοινό cache για όλους. Μόλις η σελίδα γίνει εξαρτώμενη από cookie, το
ξεκλείδωτο HTML μπορεί να σερβιριστεί σε κλειδωμένο επισκέπτη. Λύση: για
`accessMode === 'PIN'` η σελίδα πρέπει να γίνει **δυναμική** (η ανάγνωση cookie
το επιβάλλει ούτως ή άλλως) και το fetch `cache: 'no-store'`.

**β) `generateMetadata`.** Σήμερα βάζει τα ονόματα στο `<title>` και στο
`description`. Για κλειδωμένο προσκλητήριο πρέπει να επιστρέφει ουδέτερο τίτλο
(π.χ. «Πρόσκληση») — αλλιώς τα ονόματα φαίνονται στον τίτλο του tab πριν καν
μπει ο κωδικός.

**γ) Open Graph — η σοβαρότερη.** Όταν κάποιος στέλνει το link σε Viber/WhatsApp,
η εφαρμογή διαβάζει τα `og:title` / `og:image` **χωρίς** cookie. Σήμερα αυτά
περιέχουν τα ονόματα και τη φωτογραφία του ζευγαριού. Δηλαδή η προεπισκόπηση θα
αποκάλυπτε ακριβώς ό,τι προστατεύει το PIN. Για κλειδωμένα προσκλητήρια το OG
πρέπει να είναι γενικό (ουδέτερη κάρτα, χωρίς cover photo).

---

## 4. Admin

Στο `app/admin/edit/[id]` και στα create wizards:

- toggle **Δημόσιο / Με κωδικό**
- πεδίο PIN (εμφανίζεται μόνο στο PIN mode)
- το PIN δεν επιστρέφεται ποτέ από το API — μόνο `hasPin: boolean`. Αλλαγή
  σημαίνει αντικατάσταση, όχι ανάγνωση.
- βοηθητικό κείμενο ότι ο κωδικός μοιράζεται μαζί με το link στους καλεσμένους.

---

## 5. Σχέση με το SEO

Καμία απώλεια: τα `/[slug]` είναι ήδη `noindex` (βλ. `app/[slug]/page.tsx`), άρα
το PIN δεν αφαιρεί τίποτα από την ορατότητα στη Google. Οι σελίδες προϊόντος
παραμένουν το μοναδικό indexable κομμάτι.

---

## 6. Τι έχει επαληθευτεί

Έλεγχοι σε runtime πάνω στον compiled κώδικα (πραγματικό `InvitationAccessService`
+ πραγματικό `JwtService`, με stub Prisma):

- το κλειδωμένο payload δεν περιέχει ονόματα, τηλέφωνα ή IBAN
- λάθος PIN → 401· σωστό PIN → ξεκλειδώνει
- το hash του PIN δεν επιστρέφεται ποτέ
- **token για ένα slug δεν ξεκλειδώνει άλλο**
- admin token (χωρίς scope claim) δεν ξεκλειδώνει πρόσκληση
- public και ανύπαρκτο slug δίνουν και τα δύο 401 — δεν λειτουργεί ως oracle
- RSVP μπλοκάρεται όσο είναι κλειδωμένο, περνά μετά το ξεκλείδωμα
- brute force: 429 στην 6η προσπάθεια

## 7. Τι μένει

- Δεν υπάρχει UI για PIN στα create wizards (`app/admin/create/*`) — μόνο στο
  edit. Μια νέα πρόσκληση ξεκινά `PUBLIC` και κλειδώνεται από το edit.
- Δεν έχει δοκιμαστεί end-to-end με πραγματική βάση· δεν υπάρχει τοπική
  Postgres. Η λογική είναι επαληθευμένη, η διαδρομή HTTP όχι.
