// app/layout.tsx
import "./globals.css";
import Header from "./Header";
import Footer from "@/components/ui/footer";
import Providers from "./providers";

export const metadata = {
  title: "OutfitSave",
  description: "Save and organize your favorite outfits",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
