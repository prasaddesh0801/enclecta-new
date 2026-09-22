import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/layout/site-header";
import Footer from "@/components/layout/footer";
import { ThemeProvider, themeInitScript } from "@/components/theme/theme-provider";
import { siteConfig } from "@/lib/site";

/* =========================================================
   FONT GENERALISATION
   Only these two declarations decide the typefaces used by
   the whole site. globals.css maps them onto the semantic
   roles (heading / subtitle / body / button / card), so a
   font change is a one-line change here.
   ========================================================= */

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const textFont = Inter({
  variable: "--font-text",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#00030f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // the inline script below sets data-theme before hydration, which
      // React otherwise flags as a server/client mismatch — this is expected
      suppressHydrationWarning
      className={`${displayFont.variable} ${textFont.variable} h-full antialiased`}
    >
      <head>
        {/* Runs before paint so a returning dark-theme visitor never sees a
            flash of the light theme. Kept as a tiny inline script (not a
            module) so it blocks rendering instead of racing hydration. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
