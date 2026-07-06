// Shared SEO helpers.

// Serialize a JSON-LD object for injection into a <script type="application/ld+json">
// via dangerouslySetInnerHTML. Escaping "<" as its JSON unicode escape ("<")
// prevents any string value (feed-sourced or otherwise) from closing the <script>
// tag early (e.g. "</script>") — the XSS vector for inline JSON-LD. Route EVERY
// ld+json serialization through this so all current and future pages are immune.
export const safeJsonLd = (o: unknown): string => JSON.stringify(o).replace(/</g, "\\u003c");
