import React from "react";
import Link from "next/link";

const aboutNav = [
  { label: "Overview", href: "/about" },
  { label: "History & Development", href: "/about/history" },
  { label: "Mission & Vision", href: "/about/mission" },
  { label: "The Team", href: "/about/team" },
  { label: "Contact", href: "/about/contact" },
];

function AboutNavbar({ current }: { current: string }) {
  return (
    <nav className="w-full bg-white border-b border-orange-100 py-4 px-6 flex items-center justify-center shadow-sm z-20">
      <div className="flex gap-4">
        {aboutNav.map((item) => (
          <Link key={item.href} href={item.href} legacyBehavior>
            <a
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-150 text-base ${
                current === item.href
                  ? "bg-orange-600 text-white shadow-md"
                  : "text-orange-700 hover:bg-orange-100 hover:text-orange-900"
              }`}
            >
              {item.label}
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <AboutNavbar current="/about/team" />
      <main className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-orange-700 mb-4">The Team</h1>
        <div className="bg-white/80 rounded-xl shadow p-8">
          <p className="text-lg text-gray-700 mb-2">Meet the people behind SkillConnect. This section will soon showcase the team, their roles, and their stories.</p>
          <p className="text-orange-600 font-semibold">Coming Soon</p>
        </div>
      </main>
    </div>
  );
} 