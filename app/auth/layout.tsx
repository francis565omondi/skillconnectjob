import { AuthNavbar } from "@/components/auth-navbar"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthNavbar />
      <main className="pt-16">
        {children}
      </main>
    </>
  )
} 