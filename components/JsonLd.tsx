/**
 * Renders a schema.org graph into the SSR HTML.
 *
 * Safe inside client components too — the markup is emitted during the server
 * render, so crawlers that don't execute JS still see it.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
