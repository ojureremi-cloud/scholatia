import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from '@/components/ui/ThemeProvider';

export const metadata: Metadata = {
  title: "Scholatia",
  description:
    "A global scholarly infrastructure platform connecting students, researchers, academics, institutions, journals, conferences, publishers, funding organisations and professional associations within one trusted ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
