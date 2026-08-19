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
  title: "Wellness Lovers Club",
  description: "Premium wellness services and membership experiences.",
  icons: {
    icon: "/logo/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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

