import Link from "next/link";
import { text } from "@/lib/text";
import { PAGE_ROUTES } from "@/lib/routes";
import { APP_NAME } from "@/lib/constants";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">{APP_NAME}</h1>
      <p className="max-w-md text-neutral-600">{text.home.heroBody}</p>
      <div className="flex gap-3">
        <Link
          href={PAGE_ROUTES.login}
          className="min-h-11 rounded-md border border-neutral-300 px-5 py-2 font-medium"
        >
          {text.home.loginLink}
        </Link>
        <Link
          href={PAGE_ROUTES.register}
          className="min-h-11 rounded-md bg-blue-700 px-5 py-2 font-medium text-white"
        >
          {text.home.createAccountLink}
        </Link>
      </div>
    </main>
  );
}
