import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  const body = await req.json();
  const number = Number(body.number);
  const first_name = String(body.first_name ?? '').trim();
  const last_name = String(body.last_name ?? '').trim();
  const phone = String(body.phone ?? '').trim();

  if (!number || number < 1 || number > 100) {
    return NextResponse.json({ error: 'Número inválido' }, { status: 400 });
  }
  if (!first_name || !last_name || !phone) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }

  // Update condicional: sólo si está available
  const { data, error } = await supabaseServer
    .from('raffle_numbers')
    .update({
      status: 'reserved',
      first_name,
      last_name,
      phone,
      reserved_at: new Date().toISOString(),
      confirmed_at: null,
    })
    .eq('number', number)
    .eq('status', 'available')
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json(
      { error: 'Ese número ya no está disponible' },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true, data });
}
