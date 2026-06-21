import { getBySlug, articulos } from '@/lib/articulos'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateStaticParams() {
  return articulos.map(a => ({ slug: a.slug }))
}

export default function ArticuloPage({ params }: { params: { slug: string } }) {
  const art = getBySlug(params.slug)
  if (!art) notFound()

  const parrafos = art.contenido.split('\n\n').filter(p => p.trim())

  return (
    <article style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

      <div style={{ marginBottom: '3rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--gris-texto)', textDecoration: 'none' }}>Inicio</Link>
        <span style={{ color: 'var(--rojo)', fontSize: '12px' }}>—</span>
        <Link href="/articulos" style={{ fontSize: '12px', color: 'var(--gris-texto)', textDecoration: 'none' }}>Artículos</Link>
        <span style={{ color: 'var(--rojo)', fontSize: '12px' }}>—</span>
        <span style={{ fontSize: '12px', color: 'var(--crema-oscura)', opacity: 0.6 }}>{art.categoria}</span>
      </div>

      <header style={{ marginBottom: '3rem' }}>
        <span style={{
          fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase',
          color: 'var(--rojo-claro)', display: 'block', marginBottom: '1rem'
        }}>
          {art.categoria}
        </span>
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: 700, color: 'var(--crema)', lineHeight: 1.2, marginBottom: '1.5rem'
        }}>
          {art.titulo}
        </h1>
        <p style={{
          fontSize: '18px', color: 'var(--crema-oscura)', opacity: 0.7,
          lineHeight: 1.6, fontStyle: 'italic', marginBottom: '2rem',
          borderLeft: '3px solid var(--rojo)', paddingLeft: '1rem'
        }}>
          {art.bajada}
        </p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <img
            src="/ernesto-vidal.jpg"
            alt="Ernesto Vidal"
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--rojo)' }}
          />
          <span style={{ fontSize: '13px', color: 'var(--crema-oscura)', opacity: 0.7 }}>Ernesto Vidal</span>
          <span style={{ fontSize: '12px', color: 'var(--gris-texto)' }}>{art.fecha}</span>
          <span style={{ fontSize: '12px', color: 'var(--gris-texto)' }}>{art.lectura} de lectura</span>
        </div>
      </header>

      <div style={{ height: '1px', background: 'rgba(139,26,26,0.3)', marginBottom: '3rem' }} />

      <div>
        {parrafos.map((parrafo, i) => (
          <p key={i} style={{
            fontSize: '17px', lineHeight: 1.85, color: 'var(--crema-oscura)',
            opacity: 0.85, marginBottom: '1.75rem', fontWeight: 300
          }}>
            {parrafo}
          </p>
        ))}
      </div>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '3rem 0' }} />

      <div style={{
        padding: '1.5rem', border: '1px solid rgba(139,26,26,0.2)',
        display: 'flex', gap: '1rem', alignItems: 'flex-start'
      }}>
        <img
          src="/ernesto-vidal.jpg"
          alt="Ernesto Vidal"
          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--rojo)', flexShrink: 0 }}
        />
        <div>
          <p style={{ fontSize: '13px', color: 'var(--rojo-claro)', marginBottom: '4px', letterSpacing: '0.5px' }}>
            Ernesto Vidal
          </p>
          <p style={{ fontSize: '13px', color: 'var(--crema-oscura)', opacity: 0.6, fontStyle: 'italic', lineHeight: 1.7 }}>
            "No soy historiador de carrera. Por suerte, porque si lo fuera tendría que hablar bien de los mismos de siempre."
          </p>
        </div>
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <Link href="/articulos" style={{
          fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase',
          color: 'var(--rojo-claro)', textDecoration: 'none'
        }}>
          ← Volver al archivo
        </Link>
      </div>
    </article>
  )
}
