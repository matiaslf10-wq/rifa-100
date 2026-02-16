import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  const cookieStore = await cookies();
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
        status: 'available',
        first_name: null,
        last_name: null,
        phone: null,
        reserved_at: null,
        confirmed_at: null,
      })
      .eq('number', number)
      .neq('status', 'confirmed') // no liberar confirmados
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'No se pudo liberar' }, { status: 409 });
    }

    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }
}
