import { TRPCProvider } from "@/trpc/client";
import './globals.css'

export default async function LocaleLayout({
  children
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en">
      <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="globals.css" />
      </head>

      <body>
      <header className="bg-white shadow-md py-4 px-6 flex justify-center items-center border-b-2 border-[#B8860B]">
      <h1 className="text-3xl font-bold text-[#008080]">VoxAgora</h1>
      </header>
      <main className="container mx-auto p-4 mt-8 max-w-2xl">
        <TRPCProvider>{children}</TRPCProvider>
      </main>
</body>
    </html>
  );
}
