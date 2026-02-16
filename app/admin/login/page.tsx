'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const json = await res.json();

    if (!res.ok) {
      setMsg(json.error ?? 'No se pudo iniciar sesión');
      setBusy(false);
      return;
    }

    router.replace('/admin');
  }

  return (
    <main style={{ maxWidth: 520, margin: '0 auto', padding: 16, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>Login Admin</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>Ingresá tu contraseña para administrar reservas.</p>

      {msg && (
        <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 12, marginBottom: 12 }}>
          {msg}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña admin"
          style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #ccc' }}
        />

        <button
          type="submit"
          disabled={busy}
          style={{
            padding: '12px 14px',
            borderRadius: 12,
            border: '1px solid #000',
            background: '#000',
            color: '#fff',
            fontWeight: 700,
          }}
        >
          {busy ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
