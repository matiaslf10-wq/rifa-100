import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  const cookieStore = cookies();
  const isAdmin = cookieStore.get('admin_auth')?.value === '1';
  if (!isAdmin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const number = Number(body.number);

    if (!Number.isInteger(number) || number < 1 || number > 100) {
      return NextResponse.json({ error: 'Número inválido' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('raffle_numbers')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
      })
      .eq('number', number)
      .eq('status', 'reserved')
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) {
      return NextResponse.json(
        { error: 'No se pudo confirmar: el número no está reservado.' },
        { status: 409 }
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }
}
