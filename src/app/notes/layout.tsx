'use client'
import AcessRoute from "@/components/AcessRoute";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AcessRoute loged={true}>
        {children}
    </AcessRoute>
  );
}
