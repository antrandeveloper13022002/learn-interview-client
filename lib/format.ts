const vndFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

export function formatVnd(amountVnd: number): string {
  return vndFormatter.format(amountVnd);
}

export function formatDate(iso: string, lang: "vi" | "en"): string {
  return new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}
