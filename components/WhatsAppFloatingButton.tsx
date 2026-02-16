'use client';

import React from 'react';

export default function WhatsAppFloatingButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';
  const text = process.env.NEXT_PUBLIC_WHATSAPP_TEXT ?? 'Hola!';

  if (!number) return null;

  const href = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
        zIndex: 9999,
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.08)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
      }}
    >
      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="30"
        height="30"
        fill="white"
      >
        <path d="M16 .6C7.5.6.6 7.4.6 15.9c0 2.8.7 5.4 2.1 7.8L.6 31.4l7.9-2.1c2.3 1.3 4.9 2 7.5 2 8.5 0 15.4-6.8 15.4-15.4S24.5.6 16 .6zm0 28.1c-2.4 0-4.8-.7-6.8-1.9l-.5-.3-4.7 1.3 1.3-4.6-.3-.5c-1.3-2-2-4.4-2-6.8C3 8.7 8.7 3 16 3s13 5.7 13 13-5.7 12.7-13 12.7zm7.2-9.5c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2-.2.3-1 1.3-1.2 1.6-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.2-2.2-2.6-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.7.1-.3 0-.6 0-.8-.1-.2-.9-2.2-1.2-3-.3-.8-.6-.7-.9-.7h-.8c-.3 0-.8.1-1.2.6-.4.4-1.6 1.6-1.6 3.8s1.6 4.3 1.8 4.6c.2.3 3.2 4.9 7.8 6.7 1.1.5 2 .8 2.7 1 1.1.3 2 .3 2.8.2.9-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.7-.5z"/>
      </svg>
    </a>
  );
}
