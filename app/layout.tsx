import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReduxProvider } from "@/lib/redux/provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Interview Practice",
    template: "%s | Interview Practice",
  },
  description: "Luyện tập phỏng vấn với bộ câu hỏi thực tế theo từng chủ đề.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
