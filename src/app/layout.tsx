import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KaizenFlow - 1% Better Every Day",
  description:
    "Aplikasi pelacak kebiasaan dan tujuan hidup berbasis psikologi Kaizen: Too Small to Fail. Perubahan 1% setiap hari berlipat ganda menjadi hasil 37x lipat dalam setahun.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFBF7" },
    { media: "(prefers-color-scheme: dark)", color: "#121214" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full scroll-smooth">
      <body className="min-h-screen flex flex-col bg-sand-50 text-charcoal-900 dark:bg-charcoal-950 dark:text-charcoal-100 antialiased selection:bg-sage-200 selection:text-sage-900 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
