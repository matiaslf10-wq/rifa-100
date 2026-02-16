'use client';

import React, { useEffect, useMemo, useState } from 'react';

type RaffleRow = {
  number: number;
  status: 'available' | 'reserved' | 'confirmed';
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  reserved_at: string | null;
  confirmed_at: string | null;
};

export default function HomePage() {
  const [rows, setRows] = useState<RaffleRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<number | null>(null);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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

  const selectedRow = useMemo(
    () => rows.find((r) => r.number === selected) ?? null,
    [rows, selected]
  );

  async function reserve() {
    if (!selected) return;
    setBusy(true);
    setMsg(null);

    const res = await fetch('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: selected, first_name, last_name, phone }),
    });

    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error ?? 'Error');
      setBusy(false);
      await refresh();
      return;
    }

    setMsg('¡Listo! Tu número quedó reservado. Te confirmamos al recibir la transferencia.');
    setSelected(null);
    setFirstName('');
    setLastName('');
    setPhone('');
    setBusy(false);
    await refresh();
  }

  const statusLabel = (s: RaffleRow['status']) => {
    if (s === 'available') return 'Disponible';
    if (s === 'reserved') return 'Reservado';
    return 'Confirmado';
  };

  const tileClass = (s: RaffleRow['status']) => {
    if (s === 'available') return 'bg-white border-gray-300 hover:border-black';
    if (s === 'reserved') return 'bg-yellow-100 border-yellow-400';
    return 'bg-green-100 border-green-500';
  };

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 16, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>Rifa (1 al 100)</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Hola! Estamos rifando 5 premios! cada numero vale $2500 y si compras dos $4500! 
              Para participar es simple, selecciona el numero disponible y llena 
              los campos. Una vez que esten reservados enviame por whatsapp tu/s 
              numero/s, tu nombre y apellido y el comprobante de transferencia 
              para que yo pueda confirmarlos! Los numeros seran sorteados una vez 
              se hayan vendido todos. Gracias por participar y BUENA SUERTE!!! 🙂
      </p>

      {msg && (
        <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 12, marginBottom: 12 }}>
          {msg}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
          gap: 8,
          marginTop: 12,
        }}
      >
        {loading ? (
          <div>Cargando...</div>
        ) : (
          rows.map((r) => (
            <button
              key={r.number}
              onClick={() => {
                if (r.status !== 'available') return;
                setSelected(r.number);
                setMsg(null);
              }}
              disabled={r.status !== 'available'}
              title={r.status === 'available' ? 'Disponible' : statusLabel(r.status)}
              style={{
                padding: 10,
                borderRadius: 12,
                border: '2px solid',
                cursor: r.status === 'available' ? 'pointer' : 'not-allowed',
                opacity: r.status === 'available' ? 1 : 0.75,
              }}
              className={tileClass(r.status)}
            >
              <div style={{ fontSize: 16, fontWeight: 700 }}>{r.number}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{statusLabel(r.status)}</div>
            </button>
          ))
        )}
      </div>

      {/* Modal simple */}
      {selected && selectedRow?.status === 'available' && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 480,
              background: 'white',
              borderRadius: 16,
              padding: 16,
            }}
          >
            <h2 style={{ marginTop: 0 }}>Reservar número {selected}</h2>

            <label style={{ display: 'block', marginBottom: 10 }}>
              Nombre
              <input
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #ccc' }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: 10 }}>
              Apellido
              <input
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #ccc' }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: 10 }}>
              Celular
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej: 11 2345-6789"
                style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #ccc' }}
              />
            </label>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelected(null)}
                style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid #ccc' }}
                disabled={busy}
              >
                Cancelar
              </button>
              <button
                onClick={reserve}
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: '1px solid #000',
                  background: '#000',
                  color: '#fff',
                }}
                disabled={busy}
              >
                {busy ? 'Reservando...' : 'Reservar'}
              </button>
            </div>

            <p style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
              Hola! Estamos rifando 5 premios! cada numero vale $2500 y si compras dos $4500! 
              Para participar es simple, selecciona el numero disponible y llena 
              los campos. Una vez que esten reservados enviame por whatsapp tu/s 
              numero/s, tu nombre y apellido y el comprobante de transferencia 
              para que yo pueda confirmarlos! Los numeros seran sorteados una vez 
              se hayan vendido todos. Gracias por participar y BUENA SUERTE!!! 🙂
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
