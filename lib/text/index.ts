import { vi } from "./vi";

// Current locale — the one place to change when a second language is
// added (e.g. `text = locale === "en" ? en : vi`). Every component imports
// `text` from here, never `vi` directly, so that switch never touches a
// call site.
export const text = vi;
