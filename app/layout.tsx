import type { Metadata } from "next";
import { Agentation } from "agentation";
import { Bitcount_Grid_Single, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Detects the OS light/dark setting and toggles the `dark` class on <html>.
// Because it's `beforeInteractive`, Next.js places this script in <head> and
// runs it before hydration, so the class is decided right before paint with
// no FOUC (dark→light flash). The `change` listener also updates the app
// live whenever the OS setting switches (light↔dark).
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var mql = window.matchMedia("(prefers-color-scheme: dark)");
    var apply = function (isDark) {
      document.documentElement.classList.toggle("dark", isDark);
    };
    apply(mql.matches);
    mql.addEventListener("change", function (event) {
      apply(event.matches);
    });
  } catch (e) {}
})();
`;

// The actual font referenced by --font-sans (Inter) in src/tokens/typography.css.
// All 118 text styles in text-styles.css use --font-sans, and if this font
// fails to load, the browser falls back to the system default sans-serif,
// looking visually different from Figma. To avoid a name collision, the
// generated variable is named --font-inter, and typography.css wires
// --font-sans to reference it.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// The font specified by the Figma Text Style "Time Stamp", referenced by
// `.text-time-stamp` (src/tokens/text-styles.css) in ProfilePrint and
// elsewhere. If this font fails to load, the browser falls back to
// monospace, looking visually different from Figma.
const bitcountGridSingle = Bitcount_Grid_Single({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-time-stamp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gabrielle",
  description: "Gabrielle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${bitcountGridSingle.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        {children}
        {process.env.NODE_ENV === "development" && (
          <Agentation endpoint="http://localhost:4747" />
        )}
      </body>
    </html>
  );
}
