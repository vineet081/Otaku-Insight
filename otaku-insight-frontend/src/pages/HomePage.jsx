import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchAnime } from '../services/animeService'

const POPULAR = ['Attack on Titan', 'Death Note', 'Demon Slayer', 'Fullmetal Alchemist', 'One Punch Man', 'Naruto']

function HomePage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [mounted, setMounted] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSearch = async () => {
        if (!searchTerm.trim()) return
        setLoading(true)
        setError(null)
        try {
            const anime = await searchAnime(searchTerm)
            navigate(`/anime/${anime.malId}`, { state: { anime } })
        } catch {
            setError('No results found. Try a different title.')
        } finally {
            setLoading(false)
        }
    }

    const handleKey = (e) => { if (e.key === 'Enter') handleSearch() }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#050508',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: "'Syne', sans-serif",
            position: 'relative',
            overflow: 'hidden'
        }}>

            {/* Google Fonts */}
            <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Syne+Mono&display=swap" rel="stylesheet" />

            {/* Animated background grid */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `
          linear-gradient(rgba(0,255,200,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,200,0.03) 1px, transparent 1px)
        `,
                backgroundSize: '60px 60px',
                animation: 'gridMove 20s linear infinite'
            }} />

            {/* Glow orbs */}
            <div style={{
                position: 'absolute', top: '20%', left: '15%',
                width: '400px', height: '400px',
                background: 'radial-gradient(circle, rgba(0,255,170,0.06) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', bottom: '20%', right: '15%',
                width: '300px', height: '300px',
                background: 'radial-gradient(circle, rgba(120,0,255,0.07) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none'
            }} />

            {/* Main content */}
            <div style={{
                position: 'relative', zIndex: 1,
                textAlign: 'center', width: '100%', maxWidth: '700px',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>

                {/* Badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(0,255,170,0.08)',
                    border: '1px solid rgba(0,255,170,0.2)',
                    borderRadius: '100px', padding: '6px 16px',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: '#00ffaa',
                        boxShadow: '0 0 8px #00ffaa',
                        animation: 'pulse 2s infinite'
                    }} />
                    <span style={{ color: '#00ffaa', fontSize: '0.75rem', fontFamily: "'Syne Mono', monospace", letterSpacing: '0.1em' }}>
                        AI POWERED ANALYTICS
                    </span>
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    fontWeight: 800,
                    color: '#ffffff',
                    lineHeight: 1,
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em'
                }}>
                    OTAKU
                    <span style={{
                        display: 'block',
                        background: 'linear-gradient(135deg, #00ffaa 0%, #00aaff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        INSIGHT
                    </span>
                </h1>

                <p style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '1.1rem',
                    marginBottom: '3rem',
                    fontWeight: 400,
                    letterSpacing: '0.02em'
                }}>
                    Deep analytics. AI insights. Every anime, decoded.
                </p>

                {/* Search */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Search any anime..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKey}
                        style={{
                            flex: 1,
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '18px 24px',
                            fontSize: '1rem',
                            color: '#fff',
                            outline: 'none',
                            fontFamily: "'Syne', sans-serif",
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'rgba(0,255,170,0.5)'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        style={{
                            background: loading ? 'rgba(0,255,170,0.3)' : 'linear-gradient(135deg, #00ffaa, #00aaff)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '18px 32px',
                            color: '#000',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: "'Syne', sans-serif",
                            letterSpacing: '0.05em',
                            transition: 'opacity 0.2s, transform 0.1s',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => !loading && (e.target.style.opacity = '0.85')}
                        onMouseLeave={(e) => (e.target.style.opacity = '1')}
                    >
                        {loading ? '...' : 'SEARCH →'}
                    </button>
                </div>

                {error && (
                    <p style={{
                        color: '#ff6b6b', fontSize: '0.875rem',
                        marginBottom: '1rem',
                        fontFamily: "'Syne Mono', monospace"
                    }}>{error}</p>
                )}

                {/* Popular tags */}
                <div style={{ marginTop: '2.5rem' }}>
                    <p style={{
                        color: 'rgba(255,255,255,0.2)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.15em',
                        marginBottom: '1rem',
                        fontFamily: "'Syne Mono', monospace"
                    }}>POPULAR</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {POPULAR.map((name) => (
                            <button
                                key={name}
                                onClick={() => setSearchTerm(name)}
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '100px',
                                    padding: '8px 16px',
                                    color: 'rgba(255,255,255,0.5)',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    fontFamily: "'Syne', sans-serif",
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.borderColor = 'rgba(0,255,170,0.3)'
                                    e.target.style.color = '#00ffaa'
                                    e.target.style.background = 'rgba(0,255,170,0.06)'
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                                    e.target.style.color = 'rgba(255,255,255,0.5)'
                                    e.target.style.background = 'rgba(255,255,255,0.04)'
                                }}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Stats bar at bottom */}
            <div style={{
                position: 'absolute', bottom: '2rem',
                display: 'flex', gap: '3rem',
                opacity: 0.3
            }}>
                {[['Episode Analytics', '✦'], ['Manga Coverage', '✦'], ['AI Insights', '✦']].map(([label, icon]) => (
                    <div key={label} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        color: '#fff', fontSize: '0.75rem',
                        fontFamily: "'Syne Mono', monospace",
                        letterSpacing: '0.1em'
                    }}>
                        <span style={{ color: '#00ffaa' }}>{icon}</span>
                        {label}
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
        </div>
    )
}

export default HomePage