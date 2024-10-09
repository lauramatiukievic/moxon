import { draftMode } from "next/headers";
import { Inter } from "next/font/google";

import "@/app/globals.css";

import Navigation from "@/components/Globals/Navigation/Navigation";
import { PreviewNotice } from "@/components/Globals/PreviewNotice/PreviewNotice";
import { ShoppingBagProvider } from "@/components/shoppingBagContext";
import Header from "@/components/header";
import { MobileProvider } from "@/components/mobileContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = draftMode();

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* {isEnabled && <PreviewNotice />}
        <Navigation /> */}
        <ShoppingBagProvider>
          <MobileProvider>
            <Header />
            {children}
          </MobileProvider>
        </ShoppingBagProvider>
      </body>
    </html>
  );
}
