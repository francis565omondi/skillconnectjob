import { DashboardNavbar } from "@/components/dashboard-navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DashboardNavbar />
      <main className="pt-16">
        {children}
      </main>
    </>
  )
} 