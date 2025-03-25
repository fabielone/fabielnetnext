// app/(store)/layout.tsx
export default function StoreLayout({ children }: { children: React.ReactNode }) {
    return (
      <main>
        {/* This layout does NOT include RootLayout (nav/footer) */}
        {children}
      </main>
    );
  }