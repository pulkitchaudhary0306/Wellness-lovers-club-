import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import AppShell from "@/components/AppShell/AppShell";
import { AuthProvider } from "@/contexts/AuthContext";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://wellnessloversclub.com"),
  title: {
    default: "Wellness Lovers Club | Luxury Wellness Sanctuary & Member Privileges",
    template: "%s | Wellness Lovers Club",
  },
  description: "Curated luxury wellness retreats, bespoke spa rituals, mindfulness journeys, and private privileges across premier destinations worldwide.",
  keywords: [
    "Wellness Lovers Club",
    "Luxury Wellness Retreats",
    "Holistic Spa Sanctuaries",
    "Mindfulness Travel",
    "Exclusive Wellness Privileges",
    "GlobalSpa",
  ],
  authors: [{ name: "Wellness Lovers Club by GlobalSpa" }],
  creator: "Wellness Lovers Club",
  publisher: "Wellness Lovers Club",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/logo/logo.webp",
    apple: "/logo/logo.webp",
  },
  openGraph: {
    title: "Wellness Lovers Club | Luxury Wellness Sanctuary & Member Privileges",
    description: "Curated luxury wellness retreats, bespoke spa rituals, mindfulness journeys, and private privileges across premier destinations worldwide.",
    url: "https://wellnessloversclub.com",
    siteName: "Wellness Lovers Club",
    images: [
      {
        url: "/images/hero-wellness.webp",
        width: 1200,
        height: 630,
        alt: "Wellness Lovers Club Sanctuary",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wellness Lovers Club | Luxury Wellness Sanctuary",
    description: "Curated luxury wellness retreats, bespoke spa rituals, and private privileges worldwide.",
    images: ["/images/hero-wellness.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/hero-wellness.webp"
          type="image/webp"
          fetchPriority="high"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (sessionStorage.getItem('wlc_splash_shown') === 'true') {
                    document.documentElement.classList.add('splash-complete');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <AppShell header={<Header />} footer={<Footer />}>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}

