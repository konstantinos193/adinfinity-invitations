import JsonLd from '@/components/JsonLd';
import RelatedLinks from '@/components/RelatedLinks';
import {
  Callout,
  Cta,
  Faq,
  FeatureList,
  H2,
  Hero,
  PageShell,
  Prose,
} from '@/components/landing/Sections';
import {
  PAGES,
  breadcrumbNode,
  faqNode,
  graph,
  pageMetadata,
  serviceNode,
  webPageNode,
} from '@/lib/seo';

export const metadata = pageMetadata('videoOnly');

const FAQ = [
  {
    q: 'Έχει φόρμα RSVP το Video Only;',
    a: 'Όχι. Αυτή είναι η βασική διαφορά του από το video προσκλητήριο. Το Video Only είναι σκόπιμα μόνο η πρόσκληση — ονόματα, ημερομηνία και το βίντεο. Αν χρειάζεστε απαντήσεις καλεσμένων, επιλέξτε το video προσκλητήριο ή το mini website.',
  },
  {
    q: 'Γιατί να διαλέξω κάτι τόσο απλό;',
    a: 'Όταν η συλλογή απαντήσεων γίνεται ήδη αλλού — τηλεφωνικά, μέσω των κουμπάρων ή σε ένα group — μια σελίδα με φόρμες προσθέτει θόρυβο χωρίς λόγο. Το Video Only κρατά μόνο το κομμάτι που έχει σημασία: την ίδια την πρόσκληση.',
  },
  {
    q: 'Μπορώ να το αναβαθμίσω αργότερα;',
    a: 'Ναι. Αν αποφασίσετε ότι τελικά χρειάζεστε RSVP ή χάρτες, η πρόσκληση μπορεί να μετατραπεί σε video προσκλητήριο ή σε mini website διατηρώντας το ίδιο link.',
  },
  {
    q: 'Σε τι συσκευές δουλεύει;',
    a: 'Σε οποιοδήποτε κινητό, tablet ή υπολογιστή, μέσα από τον browser. Το βίντεο προσαρμόζεται στο μέγεθος της οθόνης ώστε να γεμίζει σωστά και σε κάθετη προβολή.',
  },
];

export default function VideoOnlyProsklitirioPage() {
  return (
    <PageShell>
      <JsonLd
        data={graph(
          webPageNode('videoOnly'),
          breadcrumbNode([
            { name: 'Αρχική', path: '/' },
            {
              name: 'Video Only Προσκλητήριο',
              path: PAGES.videoOnly.path,
            },
          ]),
          serviceNode,
          faqNode(PAGES.videoOnly.path, FAQ),
        )}
      />

      <Hero
        title="Video Only Προσκλητήριο"
        lead={
          <>
            <p>
              Η πιο λιτή εκδοχή: τα ονόματα, η ημερομηνία και ένα full-screen
              βίντεο. Τίποτα άλλο — καμία φόρμα, κανένα μενού, κανένα scroll.
            </p>
            <p>
              Είναι για όσους θέλουν η πρόσκληση να είναι το βίντεο και μόνο, και
              που μαζεύουν τις απαντήσεις με άλλον τρόπο.
            </p>
          </>
        }
      />

      <H2>Τι περιλαμβάνει</H2>
      <FeatureList
        items={[
          {
            term: 'Full-screen βίντεο',
            desc: 'Καταλαμβάνει ολόκληρη την οθόνη, προσαρμοσμένο και σε κάθετη προβολή στο κινητό.',
          },
          {
            term: 'Ονόματα και ημερομηνία',
            desc: 'Ευανάγνωστα, ώστε η βασική πληροφορία να περνά ακόμη κι αν κάποιος δεν παίξει το βίντεο.',
          },
          {
            term: 'Δικό σας link',
            desc: 'Διεύθυνση με τα ονόματά σας, αναγνωρίσιμη όταν φτάνει σε μήνυμα.',
          },
          {
            term: 'Χωρίς φόρμες',
            desc: 'Καμία φόρμα RSVP, καμία λίστα δώρων — σκόπιμα.',
          },
        ]}
      />

      <H2>Πώς συγκρίνεται με τις άλλες δύο επιλογές</H2>
      <Prose>
        <p>
          Το <strong className="text-[#01FFFF]">Video Only</strong> είναι η
          πρόσκληση χωρίς λειτουργίες. Το{' '}
          <strong className="text-[#01FFFF]">video προσκλητήριο</strong>{' '}
          κρατά το ίδιο βίντεο στο επίκεντρο αλλά προσθέτει από κάτω RSVP, χάρτες
          και IBAN. Το{' '}
          <strong className="text-[#01FFFF]">mini website</strong> είναι η πλήρης
          σελίδα, με ιστορία, γκαλερί, πρόγραμμα και επαφές.
        </p>
        <p>
          Αν δεν είστε σίγουροι, το ερώτημα που ξεχωρίζει τα τρία είναι απλό:
          θέλετε να μαζεύετε απαντήσεις μέσα από την πρόσκληση; Αν ναι, το Video
          Only δεν είναι η σωστή επιλογή.
        </p>
      </Prose>

      <Callout title="Μπορεί να αλλάξει αργότερα">
        <p>
          Αν κάπου στην πορεία αποφασίσετε ότι χρειάζεστε RSVP, η πρόσκληση
          μετατρέπεται σε video προσκλητήριο κρατώντας το ίδιο link — οι
          καλεσμένοι που το έχουν ήδη λάβει δεν χρειάζεται να ενημερωθούν ξανά.
        </p>
      </Callout>

      <Cta
        href="/request"
        label="Ζητήστε Video Only →"
        secondary={{
          href: '/video-prosklitirio-gamou',
          label: 'Δείτε την εκδοχή με RSVP',
        }}
      />

      <Faq items={FAQ} />

      <RelatedLinks current="videoOnly" />
    </PageShell>
  );
}
