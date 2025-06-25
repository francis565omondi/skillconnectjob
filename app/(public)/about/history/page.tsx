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

export default function AboutHistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <AboutNavbar current="/about/history" />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-orange-700 mb-6">The Story of SkillConnect</h1>
        <p className="text-lg text-gray-700 mb-6">
          <span className="font-semibold">SkillConnect</span> is a modern job and talent platform built to connect job seekers and employers in Kenya and beyond. The platform was conceived and developed by <span className="font-semibold">Francis Omondi</span>, a passionate software developer dedicated to empowering people through technology.
        </p>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-2">Origins & Vision</h2>
          <p className="text-gray-700 mb-2">
            The idea for SkillConnect was born out of a desire to bridge the gap between skilled professionals and employers in a rapidly changing job market. Francis noticed that many talented individuals struggled to find the right opportunities, while companies found it challenging to identify the best candidates efficiently.
          </p>
          <p className="text-gray-700">
            The vision was clear: create a platform that is user-friendly, secure, and leverages the latest technology to make job searching and hiring seamless for everyone.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-2">Development Journey</h2>
          <p className="text-gray-700 mb-2">
            Development began in 2023, with Francis handling everything from design and coding to infrastructure and security. The platform was built using Next.js for a fast, modern frontend, and Supabase for scalable backend services and real-time features.
          </p>
          <p className="text-gray-700 mb-2">
            Key milestones included:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-2">
            <li>Designing a clean, intuitive user interface for both job seekers and employers.</li>
            <li>Implementing secure authentication, real-time job updates, and robust admin tools.</li>
            <li>Ensuring data privacy, compliance, and high availability through best practices.</li>
            <li>Iterating based on user feedback to add features like CV uploads, application tracking, and more.</li>
          </ul>
          <p className="text-gray-700">
            The journey was filled with challenges, from integrating third-party services to optimizing for performance and security. Each obstacle was an opportunity to learn and improve the platform.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-orange-600 mb-2">Where We Are Now</h2>
          <p className="text-gray-700 mb-2">
            Today, SkillConnect serves a growing community of users, helping people find jobs and companies discover talent. The platform continues to evolve, with new features and improvements being added regularly.
          </p>
          <p className="text-gray-700">
            Francis remains committed to the mission of SkillConnect: making meaningful connections that change lives.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-orange-600 mb-2">About the Developer</h2>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Francis Omondi</span> is a full-stack developer with a passion for building impactful digital products. With experience in modern web technologies, cloud infrastructure, and user-centered design, Francis brings ideas to life with a focus on quality and innovation.
          </p>
          <p className="text-gray-700">
            You can connect with Francis on <a href="https://www.linkedin.com/in/francisomondi/" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn</a> or reach out via the contact page.
          </p>
        </section>
      </main>
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">Contact us: <span className="text-orange-600 font-semibold">skillconnect2025@gmail.com</span></p>
      </div>
    </div>
  );
} 