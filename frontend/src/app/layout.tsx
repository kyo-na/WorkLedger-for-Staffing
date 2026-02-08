import type { Metadata } from "next";
import "./globals.css"; // これがあるか確認！

export const metadata: Metadata = {
  title: "Staffing Pro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}