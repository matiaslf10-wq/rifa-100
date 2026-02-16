import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { error: 'ADMIN_PASSWORD no está configurada en el entorno.' },
        { status: 500 }
      );
    }

    if (String(password ?? '') !== adminPassword) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });

    // Cookie httpOnly (no accesible por JS del navegador)
    res.cookies.set('admin_auth', '1', {
      httpOnly: true,
      secure: true, // en Vercel siempre https
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 días
    });

    return res;
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }
}
