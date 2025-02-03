import { draftMode } from "next/headers";
import { Inter, Montserrat } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "@/app/globals.css";

import { ShoppingBagProvider } from "@/components/shoppingBagContext";

import Header from "@/components/header";
import { MobileProvider } from "@/components/mobileContext";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/footer";
import Products from "@/components/products";

const inter = Montserrat({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = draftMode();

  return (
    <html lang="en">
      <body className={`${inter.className} relative bg-white overflow-hidden`}>
        {/* Background Purple Blurs */}
        {/* <div className="absolute middle-[-150px] left-[-200px] w-[500px] h-[500px] bg-purple-500 blur-[200px] opacity-60 rounded-full"></div>
        <div className="absolute middle-[100px] left-[200px] w-[700px] h-[700px] bg-indigo-500 blur-[250px] opacity-40 rounded-full"></div> */}
        <div className="absolute bottom-[-200px] right-[-250px] w-[600px] h-[600px] bg-purple-400 blur-[200px] opacity-50 rounded-full"></div>
        <div className="absolute bottom-[-200px] left-[-250px] w-[600px] h-[600px] bg-purple-400 blur-[200px] opacity-50 rounded-full"></div>
        <SessionProvider>
          <ShoppingBagProvider>
            <MobileProvider>
              <Header />
              {children}
              <ToastContainer
                theme="colored"
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                toastClassName="custom-toast"
              />
              <Footer />
            </MobileProvider>
          </ShoppingBagProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
