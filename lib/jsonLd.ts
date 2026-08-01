/** Escapes `<` so embedding JSON inside a `<script>` tag can't be broken out of by content containing "</script>". */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
