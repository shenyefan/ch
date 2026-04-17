import type { Metadata } from "next";
import { getLanguageDirection } from "@/lib/i18n";
import { getPreferredLanguage } from "@/lib/i18n-server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chinese Heritage — Discover China's Architectural Wonders",
  description:
    "Explore Rich Cultural Heritage of China's Architectural Wonders — from towering pagodas to serene imperial temples.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getPreferredLanguage();
  const direction = getLanguageDirection(language);
  const baiduAk =
    process.env.NEXT_PUBLIC_BAIDU_MAP_AK ?? "8Nl8RZImrLoNYtkUl78uaKuns807t9Lo";

  return (
    <html lang={language} dir={direction}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;600&family=Noto+Sans+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <script
          src={`https://api.map.baidu.com/api?type=webgl&v=1.0&ak=${baiduAk}`}
          async={false}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}