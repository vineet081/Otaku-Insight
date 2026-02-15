import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { searchAnime, getEpisodeAnalysis, getMangaInfo } from '../services/animeService'

// ─── small reusable pieces ───────────────────────────────────────────────────

function StatCard({ label, value, accent }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            padding: '1.5rem',
            flex: 1,
            minWidth: '120px'
        }}>
            <p style={{
                color: 'rgba(255,255,255,0.35)',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                marginBottom: '0.5rem',
                fontFamily: "'Syne Mono', monospace"
            }}>{label}</p>
            <p style={{
                color: accent || '#fff',
                fontSize: '1.5rem',
                fontWeight: 700,
                lineHeight: 1
            }}>{value ?? '—'}</p>
        </div>
    )
}

function TabButton({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: active ? 'rgba(0,255,170,0.1)' : 'transparent',
                border: active ? '1px solid rgba(0,255,170,0.3)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                padding: '10px 22px',
                color: active ? '#00ffaa' : 'rgba(255,255,255,0.4)',
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.85rem',
                fontWeight: active ? 700 : 400,
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'all 0.2s'
            }}
        >{label}</button>
    )
}

function Loader({ text }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '4rem', gap: '1rem'
        }}>
            <div style={{
                width: '40px', height: '40px',
                border: '2px solid rgba(0,255,170,0.15)',
                borderTop: '2px solid #00ffaa',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: '0.8rem',
                fontFamily: "'Syne Mono', monospace",
                letterSpacing: '0.1em'
            }}>{text}</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

// ─── Episode Analysis Tab ────────────────────────────────────────────────────

function EpisodeTab({ animeId }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [fetched, setFetched] = useState(false)

    const fetch = async () => {
        if (fetched) return
        setLoading(true)
        try {
            const result = await getEpisodeAnalysis(animeId)
            setData(result)
            setFetched(true)
        } catch {
            setError('Could not load episode data.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetch() }, [animeId])

    if (loading) return <Loader text="FETCHING ALL EPISODES..." />
    if (error) return <p style={{ color: '#ff6b6b', textAlign: 'center', padding: '2rem' }}>{error}</p>
    if (!data) return null

    const pct9 = data.totalEpisodes ? Math.round((data.episodesAbove9 / data.totalEpisodes) * 100) : 0
    const pct8 = data.totalEpisodes ? Math.round((data.episodesAbove8 / data.totalEpisodes) * 100) : 0

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Overview stats */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <StatCard label="AVERAGE RATING" value={data.averageRating} accent="#00ffaa" />
                <StatCard label="TOTAL ANALYZED" value={`${data.totalEpisodes} eps`} />
                <StatCard label="ABOVE 9.0" value={data.episodesAbove9} accent="#ffd700" />
                <StatCard label="ABOVE 8.0" value={data.episodesAbove8} accent="#00aaff" />
            </div>

            {/* Rating bars */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px', padding: '1.5rem',
                display: 'flex', flexDirection: 'column', gap: '1.2rem'
            }}>
                <p style={{
                    color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem',
                    letterSpacing: '0.15em', fontFamily: "'Syne Mono', monospace"
                }}>RATING DISTRIBUTION</p>

                {[
                    { label: 'Episodes 9+', pct: pct9, color: '#00ffaa' },
                    { label: 'Episodes 8+', pct: pct8, color: '#00aaff' },
                ].map(({ label, pct, color }) => (
                    <div key={label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{label}</span>
                            <span style={{ color, fontSize: '0.85rem', fontFamily: "'Syne Mono', monospace" }}>{pct}%</span>
                        </div>
                        <div style={{
                            height: '6px', background: 'rgba(255,255,255,0.07)',
                            borderRadius: '100px', overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '100%', width: `${pct}%`,
                                background: color, borderRadius: '100px',
                                transition: 'width 1s cubic-bezier(0.16,1,0.3,1)'
                            }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Best & Worst */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {data.highestRatedEpisode && (
                    <div style={{
                        background: 'rgba(0,255,170,0.05)',
                        border: '1px solid rgba(0,255,170,0.2)',
                        borderRadius: '16px', padding: '1.5rem'
                    }}>
                        <p style={{
                            color: '#00ffaa', fontSize: '0.7rem',
                            letterSpacing: '0.15em', marginBottom: '0.75rem',
                            fontFamily: "'Syne Mono', monospace"
                        }}>🏆 BEST EPISODE</p>
                        <p style={{ color: '#fff', fontWeight: 700, marginBottom: '4px' }}>
                            Episode {data.highestRatedEpisode.episodeNumber}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '8px' }}>
                            {data.highestRatedEpisode.title}
                        </p>
                        <p style={{ color: '#00ffaa', fontSize: '1.5rem', fontWeight: 800 }}>
                            {data.highestRatedEpisode.rating}
                        </p>
                    </div>
                )}
                {data.lowestRatedEpisode && (
                    <div style={{
                        background: 'rgba(255,80,80,0.05)',
                        border: '1px solid rgba(255,80,80,0.2)',
                        borderRadius: '16px', padding: '1.5rem'
                    }}>
                        <p style={{
                            color: '#ff6b6b', fontSize: '0.7rem',
                            letterSpacing: '0.15em', marginBottom: '0.75rem',
                            fontFamily: "'Syne Mono', monospace"
                        }}>💔 LOWEST EPISODE</p>
                        <p style={{ color: '#fff', fontWeight: 700, marginBottom: '4px' }}>
                            Episode {data.lowestRatedEpisode.episodeNumber}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '8px' }}>
                            {data.lowestRatedEpisode.title}
                        </p>
                        <p style={{ color: '#ff6b6b', fontSize: '1.5rem', fontWeight: 800 }}>
                            {data.lowestRatedEpisode.rating}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Manga Tab ───────────────────────────────────────────────────────────────

function MangaTab({ animeId }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false

        const fetchData = async (retryCount = 0) => {
            if (!cancelled) {
                setLoading(true)
                setError(null)
            }

            try {
                const result = await getMangaInfo(animeId)
                if (!cancelled) {
                    setData(result)
                    setLoading(false)
                }
            } catch (err) {
                // Retry logic for intermittent 404s (backend bug workaround)
                if (!cancelled && retryCount < 2) {
                    console.log(`Manga fetch failed, retrying... (attempt ${retryCount + 1}/2)`)
                    setTimeout(() => {
                        if (!cancelled) {
                            fetchData(retryCount + 1)
                        }
                    }, 1000 * (retryCount + 1)) // Exponential backoff: 1s, 2s
                } else if (!cancelled) {
                    setError('No manga adaptation found for this anime.')
                    setLoading(false)
                }
            }
        }

        fetchData()

        // Cleanup - prevents state update if component unmounts
        return () => { cancelled = true }
    }, [animeId])

    if (loading) return <Loader text="FETCHING MANGA DATA..." />
    if (error) return (
        <div style={{
            textAlign: 'center', padding: '3rem',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px'
        }}>
            <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</p>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>{error}</p>
        </div>
    )
    if (!data) return null

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px', padding: '2rem'
            }}>
                <p style={{
                    color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem',
                    letterSpacing: '0.15em', marginBottom: '0.5rem',
                    fontFamily: "'Syne Mono', monospace"
                }}>MANGA TITLE</p>
                <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>
                    {data.mangaTitle}
                </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <StatCard label="TOTAL CHAPTERS" value={data.totalMangaChapters} accent="#00ffaa" />
                <StatCard label="TOTAL VOLUMES" value={data.totalMangaVolumes} accent="#00aaff" />
                <StatCard label="STATUS" value={data.mangaStatus} accent="#ffd700" />
            </div>

            <div style={{
                background: 'rgba(0,255,170,0.05)',
                border: '1px solid rgba(0,255,170,0.2)',
                borderRadius: '16px', padding: '2rem'
            }}>
                <p style={{
                    color: '#00ffaa', fontSize: '0.7rem',
                    letterSpacing: '0.15em', marginBottom: '0.75rem',
                    fontFamily: "'Syne Mono', monospace"
                }}>📖 WHERE TO CONTINUE</p>
                <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    {data.continueFromChapter}
                </p>
                {data.note && (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                        {data.note}
                    </p>
                )}
            </div>
        </div>
    )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

function AnimeDetailPage() {
    const { id } = useParams()
    const { state } = useLocation()
    const navigate = useNavigate()
    const [anime, setAnime] = useState(state?.anime || null)
    const [activeTab, setActiveTab] = useState('overview')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (!anime) {
            // fallback if navigated directly
            setAnime(null)
        }
    }, [])

    if (!anime) {
        return (
            <div style={{
                minHeight: '100vh', background: '#050508',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Syne', sans-serif"
            }}>
                <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Syne+Mono&display=swap" rel="stylesheet" />
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Anime data not found</p>
                    <button onClick={() => navigate('/')} style={{
                        background: 'linear-gradient(135deg, #00ffaa, #00aaff)',
                        border: 'none', borderRadius: '10px',
                        padding: '12px 24px', color: '#000',
                        fontFamily: "'Syne', sans-serif", fontWeight: 700, cursor: 'pointer'
                    }}>← Back to Search</button>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#050508',
            fontFamily: "'Syne', sans-serif",
            color: '#fff'
        }}>
            <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Syne+Mono&display=swap" rel="stylesheet" />

            {/* Hero section */}
            <div style={{
                position: 'relative',
                padding: '3rem 2rem 2rem',
                maxWidth: '1000px',
                margin: '0 auto',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>

                {/* Back button */}
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        padding: '10px 18px',
                        color: 'rgba(255,255,255,0.6)',
                        cursor: 'pointer',
                        fontFamily: "'Syne', sans-serif",
                        fontSize: '0.85rem',
                        marginBottom: '2rem',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >
                    ← Search Again
                </button>

                {/* Anime hero */}
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                    {/* Poster */}
                    {anime.imageUrl && (
                        <div style={{
                            flexShrink: 0,
                            width: '160px', height: '230px',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 0 40px rgba(0,255,170,0.1)'
                        }}>
                            <img
                                src={anime.imageUrl}
                                alt={anime.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        {/* Status badge */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: anime.status === 'Finished Airing'
                                ? 'rgba(0,255,170,0.08)' : 'rgba(255,200,0,0.08)',
                            border: `1px solid ${anime.status === 'Finished Airing' ? 'rgba(0,255,170,0.2)' : 'rgba(255,200,0,0.2)'}`,
                            borderRadius: '100px', padding: '5px 12px',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                width: '5px', height: '5px', borderRadius: '50%',
                                background: anime.status === 'Finished Airing' ? '#00ffaa' : '#ffd700'
                            }} />
                            <span style={{
                                color: anime.status === 'Finished Airing' ? '#00ffaa' : '#ffd700',
                                fontSize: '0.7rem',
                                fontFamily: "'Syne Mono', monospace",
                                letterSpacing: '0.08em'
                            }}>{anime.status}</span>
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            marginBottom: '1rem',
                            letterSpacing: '-0.02em'
                        }}>{anime.title}</h1>

                        {/* Quick stats row */}
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            {[
                                { label: 'SCORE', value: anime.score, color: '#ffd700' },
                                { label: 'EPISODES', value: anime.episodes },
                                { label: 'YEAR', value: anime.year },
                            ].map(({ label, value, color }) => (
                                <div key={label}>
                                    <p style={{
                                        color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem',
                                        letterSpacing: '0.15em',
                                        fontFamily: "'Syne Mono', monospace",
                                        marginBottom: '2px'
                                    }}>{label}</p>
                                    <p style={{
                                        color: color || '#fff',
                                        fontSize: '1.2rem',
                                        fontWeight: 700
                                    }}>{value ?? '—'}</p>
                                </div>
                            ))}
                        </div>

                        {/* Synopsis */}
                        {anime.synopsis && (
                            <p style={{
                                color: 'rgba(255,255,255,0.45)',
                                fontSize: '0.9rem',
                                lineHeight: 1.7,
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>{anime.synopsis}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div style={{
                maxWidth: '1000px', margin: '0 auto',
                height: '1px',
                background: 'rgba(255,255,255,0.06)'
            }} />

            {/* Tabs + Content */}
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>

                {/* Tab buttons */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    {[
                        { key: 'overview', label: 'Overview' },
                        { key: 'episodes', label: 'Episode Analytics' },
                        { key: 'manga', label: 'Manga Info' },
                    ].map(({ key, label }) => (
                        <TabButton
                            key={key}
                            label={label}
                            active={activeTab === key}
                            onClick={() => setActiveTab(key)}
                        />
                    ))}
                </div>

                {/* Tab content */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Full synopsis */}
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: '16px', padding: '2rem'
                        }}>
                            <p style={{
                                color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem',
                                letterSpacing: '0.15em', marginBottom: '1rem',
                                fontFamily: "'Syne Mono', monospace"
                            }}>SYNOPSIS</p>
                            <p style={{
                                color: 'rgba(255,255,255,0.7)',
                                lineHeight: 1.8, fontSize: '0.95rem'
                            }}>{anime.synopsis || 'No synopsis available.'}</p>
                        </div>

                        {/* Info grid */}
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <StatCard label="SCORE" value={anime.score} accent="#ffd700" />
                            <StatCard label="EPISODES" value={anime.episodes} />
                            <StatCard label="YEAR" value={anime.year} />
                            <StatCard label="STATUS" value={anime.status} accent="#00ffaa" />
                        </div>

                        {/* CTA hint */}
                        <div style={{
                            background: 'rgba(0,170,255,0.05)',
                            border: '1px solid rgba(0,170,255,0.15)',
                            borderRadius: '16px', padding: '1.5rem',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
                        }}>
                            <div>
                                <p style={{ color: '#00aaff', fontWeight: 700, marginBottom: '4px' }}>
                                    Want deeper insights?
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                                    Check Episode Analytics and Manga Info tabs above
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveTab('episodes')}
                                style={{
                                    background: 'linear-gradient(135deg, #00ffaa, #00aaff)',
                                    border: 'none', borderRadius: '10px',
                                    padding: '12px 24px', color: '#000',
                                    fontFamily: "'Syne', sans-serif",
                                    fontWeight: 700, cursor: 'pointer',
                                    fontSize: '0.85rem', letterSpacing: '0.05em'
                                }}
                            >
                                View Analytics →
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'episodes' && <EpisodeTab animeId={id} />}
                {activeTab === 'manga' && <MangaTab animeId={id} />}
            </div>

            <div style={{ height: '4rem' }} />
        </div>
    )
}

export default AnimeDetailPage