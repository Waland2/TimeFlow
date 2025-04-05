'use client';

import Link from 'next/link';
import '@/styles/landing.css';

export default function Home() {
  return (
    <main>
      <section className="features">
        <div className="feature">
          <h3>🎯 Activity Control</h3>
          <p>Create cards and mark what you’re doing with just one click.</p>
        </div>
        <div className="feature">
          <h3>📊 Time Visualization</h3>
          <p>Charts. Everything is clear, beautiful, and easy to understand.</p>
        </div>
        <div className="feature">
          <h3>🎨 Personalize</h3>
          <p>Add your own activities and edit cards to suit your needs.</p>
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
