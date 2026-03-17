import "./globals.css";

export const metadata = {
  title: "Schulportal Hessen - Mein Vertretungsplan",
  description: "Schulportal Hessen - Pädagogische Organisation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
