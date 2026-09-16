'use client';

import { FormEvent, useState } from 'react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'بيانات الدخول غير صحيحة');
        return;
      }

      window.location.href = '/admin';
    } catch {
      setError('تعذر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 520 }}>
        <div className="panel">
          <h1>دخول إدارة الموقع</h1>

          <p className="muted">
            الوتر المعماري
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 15 }}>
              <label>البريد الإلكتروني</label>
              <input
                className="field"
                style={{ width: '100%', marginTop: 6 }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label>كلمة المرور</label>
              <input
                className="field"
                style={{ width: '100%', marginTop: 6 }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="notice">
                {error}
              </div>
            )}

            <button
              className="btn gold"
              type="submit"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'جارٍ الدخول...' : 'دخول'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}