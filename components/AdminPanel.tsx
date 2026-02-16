'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type RaffleRow = {
  number: number;
  status: 'available' | 'reserved' | 'confirmed';
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  reserved_at: string | null;
  confirmed_at: string | null;
};

export default function AdminPanel() {
  const router = useRouter();
  const [rows, setRows] = useState<RaffleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  async function refresh() {
    setLoading(true);
    setMsg(null);

    const res = await fetch('/api/numbers', { cache: 'no-store' });
    const json = await res.json();
    setRows(json.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  const pending = useMemo(() => rows.filter(r => r.status === 'reserved'), [rows]);
  const confirmed = useMemo(() => rows.filter(r => r.status === 'confirmed'), [rows]);

  async function confirmNumber(n: number) {
    setBusy(n);
    setMsg(null);

    const res = await fetch('/api/admin/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: n }),
    });

    const json = await res.json();
    if (!res.ok) setMsg(json.error ?? 'Error');
    await refresh();
    setBusy(null);
  }

  async function releaseNumber(n: number) {
    setBusy(n);
    setMsg(null);

    const res = await fetch('/api/admin/release', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: n }),
    });

    const json = await res.json();
    if (!res.ok) setMsg(json.error ?? 'Error');
    await refresh();
    setBusy(null);
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  }

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 16, fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>Admin rifa</h1>
        <button
          onClick={logout}
          style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid #ccc' }}
        >
          Salir
        </button>
      </div>

      {msg && (
        <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 12, marginTop: 12 }}>
          {msg}
        </div>
      )}

      {loading ? (
        <div style={{ marginTop: 12 }}>Cargando...</div>
      ) : (
        <>
          <h2 style={{ marginTop: 18 }}>Reservas pendientes ({pending.length})</h2>

          {pending.length === 0 ? (
            <p>No hay pendientes.</p>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {pending.map((r) => (
                <div key={r.number} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 12 }}>
                  <b>N° {r.number}</b> — {r.first_name} {r.last_name} — {r.phone}

                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => confirmNumber(r.number)}
                      disabled={busy === r.number}
                      style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid #000' }}
                    >
                      {busy === r.number ? '...' : 'Confirmar pago'}
                    </button>

                    <button
                      onClick={() => releaseNumber(r.number)}
                      disabled={busy === r.number}
                      style={{ padding: '8px 10px', borderRadius: 10, border: '1px solid #ccc' }}
                    >
                      Liberar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2 style={{ marginTop: 18 }}>Confirmados ({confirmed.length})</h2>
          <div style={{ display: 'grid', gap: 6 }}>
            {confirmed.map((r) => (
              <div key={r.number} style={{ opacity: 0.85 }}>
                N° {r.number} — {r.first_name} {r.last_name} — {r.phone}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
