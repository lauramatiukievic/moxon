import { draftMode } from "next/headers";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            <ToastContainer theme="colored" position="bottom-right" autoClose={3000} hideProgressBar={false} toastClassName="custom-toast" />
          </MobileProvider>
          
        </ShoppingBagProvider>
      </body>
    </html>
  );
}
