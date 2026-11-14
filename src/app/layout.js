import "./globals.css";

export const metadata = {
  title: "ManthanPay Admin",
  description: "ManthanPay Administration Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
