import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="max-w-md w-full p-6 text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The page you are looking for doesn&apos;t exist.</p>
        <div className="mt-6">
          <Link href="/en" className="no-underline">
            <Button>Go to home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
