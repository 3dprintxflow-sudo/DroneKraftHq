import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { AuthProvider } from "@/components/AuthContext";
import { NotificationProvider } from "@/components/NotificationContext";


const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "DroneKraft — Professional UAV Services & Academy",
  description:
    "Premium aerial intelligence, cinema-grade videography, precision mapping, and DGCA certified drone pilot training. The sky is no longer the limit.",
  keywords: ["drone services", "UAV", "aerial photography", "drone academy", "DGCA certification"],
  openGraph: {
    title: "DroneKraft — Professional UAV Services",
    description: "Premium aerial intelligence & drone pilot academy.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-droneblack text-white">
        <AuthProvider>
          <NotificationProvider>
            {children}
            <BottomNav />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
