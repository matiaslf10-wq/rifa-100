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
      <div
  style={{
    border: '1px solid #eee',
    borderRadius: 18,
    padding: 16,
    background: 'linear-gradient(180deg, #fff 0%, #fafafa 100%)',
    boxShadow: '0 10px 24px rgba(0,0,0,0.06)',
    marginBottom: 14,
  }}
>
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
    <div style={{ fontSize: 26 }}>🎁</div>
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>
        Rifa  — ¡5 premios!
      </div>
      <div style={{ opacity: 0.75, fontSize: 13 }}>
        Elegí tu número, reservá y confirmamos con tu comprobante 💚
      </div>
    </div>
  </div>

  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
    <span
      style={{
        padding: '6px 10px',
        borderRadius: 999,
        border: '1px solid #e6e6e6',
        background: '#fff',
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      💵 1 número: $2500
    </span>
    <span
      style={{
        padding: '6px 10px',
        borderRadius: 999,
        border: '1px solid #e6e6e6',
        background: '#fff',
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      ✨ 2 números: $4500
    </span>
    <span
      style={{
        padding: '6px 10px',
        borderRadius: 999,
        border: '1px solid #e6e6e6',
        background: '#fff',
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      📲 Confirmación por WhatsApp
    </span>
  </div>

  <div style={{ marginTop: 12, opacity: 0.9, lineHeight: 1.45 }}>
    <div style={{ marginBottom: 8 }}>
      <b>¿Cómo participás?</b> 😄
    </div>
    <ol style={{ margin: 0, paddingLeft: 18 }}>
      <li>Elegí un número <b>disponible</b> en la grilla.</li>
      <li>Completá <b>nombre, apellido y celular</b> para reservarlo.</li>
      <li>
        Enviame por <b>WhatsApp</b> tus número/s, tu nombre y el <b>comprobante de transferencia </b> 
        para que yo lo confirme ✅
      </li>
      <li>El sorteo se hace cuando estén <b>vendidos los 100 números</b> 🍀</li>
    </ol>

    <div style={{ marginTop: 10, fontWeight: 800 }}>
      ¡Gracias por participar y MUCHA SUERTE! 🙂🍀
    </div>
  </div>
</div>

<div
  style={{
    border: '1px dashed #cfcfcf',
    borderRadius: 18,
    padding: 14,
    background: '#fff',
    boxShadow: '0 10px 24px rgba(0,0,0,0.05)',
    display: 'grid',
    gap: 10,
    marginBottom: 14,
  }}
>
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{ fontSize: 20 }}>🏦</div>
    <div style={{ fontSize: 16, fontWeight: 900 }}>Datos para transferir</div>
  </div>

  <div style={{ display: 'grid', gap: 6 }}>
    <div
      style={{
        padding: 12,
        borderRadius: 14,
        background: '#f7f7f7',
        border: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        gap: 10,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 700 }}>ALIAS</div>
        <div style={{ fontSize: 16, fontWeight: 900 }}>karimgil</div>
      </div>
      {/* Si querés que copie al portapapeles, decime y te lo agrego */}
    </div>

    <div
      style={{
        padding: 12,
        borderRadius: 14,
        background: '#f7f7f7',
        border: '1px solid #eee',
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 700 }}>NOMBRE</div>
      <div style={{ fontSize: 16, fontWeight: 900 }}>Karina Gil</div>
    </div>
  </div>

  <div style={{ fontSize: 12, opacity: 0.75 }}>
    💬 Tip: Mandame el comprobante por WhatsApp y te lo confirmo al toque.
  </div>
</div>


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
