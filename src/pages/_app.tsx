import "@/styles/globals.css";
import { trpc } from "@/utils/trpc";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Poppins as FontSans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${fontSans.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={session}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <main className="min-h-screen bg-background font-sans antialiased">
            <Component {...pageProps} />
            <Toaster />
          </main>
        </ThemeProvider>
      </SessionProvider>
    </>
  );
}

export default trpc.withTRPC(App);
