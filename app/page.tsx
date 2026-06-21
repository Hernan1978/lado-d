import { getDestacado, getRecientes } from '@/lib/articulos'
import HeroAnimado from '@/components/HeroAnimado'
import TarjetaArticulo from '@/components/TarjetaArticulo'
import ArticuloDestacado from '@/components/ArticuloDestacado'

export default function Home() {
  const destacado = getDestacado()
  const recientes = getRecientes()

  return (
    <>
      <HeroAnimado />

      {destacado && (
        <section style={{ padding: '5rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--rojo-claro)' }}>
              Artículo destacado
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(139,26,26,0.4)' }} />
          </div>
          <ArticuloDestacado art={destacado} />
        </section>
      )}

      <section id="articulos" style={{ padding: '0 1.5rem 5rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gris-texto)' }}>
            Últimas entregas
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(139,26,26,0.15)' }}>
          {recientes.map((art, i) => (
            <TarjetaArticulo key={art.id} articulo={art} index={i} />
          ))}
        </div>
      </section>

      <section style={{
        maxWidth: '900px', margin: '0 auto 5rem', padding: '2.5rem 1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', gap: '2rem', alignItems: 'flex-start'
      }}>
        <img
          src="/ernesto-vidal.jpg"
          alt="Ernesto Vidal"
          style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--rojo)' }}
        />
        <div>
          <p style={{ fontSize: '13px', color: 'var(--rojo-claro)', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            ERNESTO VIDAL
          </p>
          <p style={{ fontSize: '14px', color: 'var(--crema-oscura)', opacity: 0.7, lineHeight: 1.8, fontStyle: 'italic' }}>
            "No creo en Dios ni en los próceres. En ambos casos, la evidencia no acompaña."
          </p>
        </div>
      </section>
    </>
  )
}
