import { SiteHeader } from '@/components/site-header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <footer className="border-t mt-24">
        <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Venuely. Book unforgettable spaces.
        </div>
      </footer>
    </>
  );
}
