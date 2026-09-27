import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KaizenFlow - 1% Better Every Day",
  description: "Habit & Goal Tracker based on Kaizen psychology: Too Small to Fail.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-sand-100 text-charcoal-900 dark:bg-charcoal-950 dark:text-charcoal-100 antialiased selection:bg-sage-200 selection:text-sage-900">
        {children}
      </body>
    </html>
  );
}
