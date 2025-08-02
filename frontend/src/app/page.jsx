'use client';

import Link from 'next/link';
import '@/styles/landing.css';

export default function Home() {
  return (
    <main>
      <section className="features">
        <div className="feature">
          {/* <h3>🎯 Activity Control</h3> */}
          <p>Track what you’re doing with one click. Add your own activities, edit cards the way you like, and see everything clearly with simple, clean charts.</p>
        </div>

      </section>

      <section className="screenshots-block">
        <h2>How it looks</h2>
        <section className="screenshots">
          <img src="/images/card-selecter-example-1.png" alt="Card selector UI" />
          <img src="/images/dashboard-example-1.png" alt="Dashboard UI" />
        </section>
      </section>

      <div className="cta">
        <Link href="/auth/login">
        Get Started
        </Link>
      </div>

      <footer>
        © 2025 TimeFlow. Created with care for your time.
      </footer>
    </main>
  );
}
