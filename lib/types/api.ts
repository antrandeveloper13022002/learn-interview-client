/** Error body shape for every endpoint, per api-guideline.md's envelope — the
 * one shape every API module (fetch-based and RTK Query alike) parses errors
 * against, instead of each defining its own structurally-identical copy. */
export type ApiErrorBody = {
  error: { code: string; message: string; details?: unknown };
};
