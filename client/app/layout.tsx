import type { Metadata } from "next";
import "./globals.scss";
import NavBar from "@/components/Nav";

export const metadata: Metadata = {
  title: "Simple ECom",
  description: "This is simple e-com website build with Next.js and Nest.js combined with Stripe payment gateway"
};

export default function RootLayout({
                                     children
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body>
    <nav>
      <NavBar />
    </nav>
    <section>
      {children}
    </section>
    </body>
    </html>
  );
}
