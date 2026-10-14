import { useState, useEffect } from 'react'

// ─── Supabase (общий проект сети) ─────────────────────────────────────────────
const SUPABASE_URL = 'https://tgleohmsmwqlvndxfykv.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_vOM4373bRXKYAnUeEdTIDA_5gDXE98F'
const EMAIL_DOMAIN = 'players.dsv-zombi.local'
const ADMIN_NICK = 'Faranatic'

const sb: any = typeof window !== 'undefined' ? (window as any).supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null
const emailFor = (nick: string) => `${nick.toLowerCase()}@${EMAIL_DOMAIN}`
const resolveNick = (user: any) => (user?.user_metadata?.nick as string) || user?.email?.split('@')[0] || 'user'

type Role = 'founder' | 'admin' | 'player'
type Me = { id: string; nick: string; role: Role }
type NexusSite = { slug: string; title: string; url: string; maintenance: boolean; sort: number }

const FALLBACK_SITES: NexusSite[] = [
  { slug: 'hub', title: 'NEXUS HUB', url: 'https://protocold7.ru/', maintenance: false, sort: 0 },
  { slug: 'barotrauma', title: 'RU, EU (SCX)', url: 'https://retgar11099-crypto.github.io/barotrauma/', maintenance: false, sort: 1 },
  { slug: 'skyhold', title: 'SkyHold', url: 'https://retgar11099-crypto.github.io/skyhold/', maintenance: false, sort: 2 },
  { slug: 'project-zomboid', title: 'Project Mantani', url: 'https://retgar11099-crypto.github.io/project-zomboid/', maintenance: false, sort: 3 },
  { slug: 'dsv-zombi', title: 'DSV-Zombi', url: 'https://retgar11099-crypto.github.io/dsv-zombi/', maintenance: false, sort: 4 },
  { slug: 'gihten', title: 'Gihten', url: 'https://retgar11099-crypto.github.io/gihten/', maintenance: false, sort: 5 },
  { slug: 'redlauncher', title: 'RED LAUNCHER', url: 'https://red.protocold7.ru/', maintenance: false, sort: 6 },
  { slug: 'watchgrid', title: 'WATCH_GRID', url: 'https://watch.protocold7.ru/', maintenance: false, sort: 7 },
]

function isFounder(me: Me | null) {
  return !!me && (me.role === 'founder' || me.nick.toLowerCase() === ADMIN_NICK.toLowerCase())
}

async function ensureProfile(userId: string, nick: string, sites: string[] = []): Promise<Me | null> {
  if (!sb) return null
  const { data } = await sb.from('profiles').select('id,nick,role').eq('id', userId).maybeSingle()
  let profile = data as Me | null
  if (!profile) {
    const role: Role = nick.toLowerCase() === ADMIN_NICK.toLowerCase() ? 'founder' : 'player'
    const { error } = await sb.from('profiles').insert({ id: userId, nick, role })
    if (error) return null
    profile = { id: userId, nick, role }
  }
  if (sites.length) {
    const rows = sites.map((slug) => ({ user_id: userId, site_slug: slug, nick: profile!.nick }))
    await sb.from('nexus_memberships').upsert(rows, { onConflict: 'user_id,site_slug', ignoreDuplicates: true })
  }
  return profile
}

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`

const NAV_LINKS = [
  { label: 'BAROTRAUMA', href: 'https://retgar11099-crypto.github.io/barotrauma/' },
  { label: 'SKYHOLD', href: 'https://retgar11099-crypto.github.io/skyhold/' },
  { label: 'MANTANI', href: 'https://retgar11099-crypto.github.io/project-zomboid/' },
  { label: 'DSV-ZOMBI', href: 'https://retgar11099-crypto.github.io/dsv-zombi/' },
  { label: 'GIHTEN', href: 'https://retgar11099-crypto.github.io/gihten/' },
  { label: 'RED LAUNCHER', href: 'https://red.protocold7.ru/' },
  { label: 'DISCORD', href: 'https://discord.gg/tqhwNTZgf3' },
]

const STATUS_URL = 'https://gist.githubusercontent.com/retgar11099-crypto/1f133bc097fcf50da45aa81e9426fe46/raw/status.json'

type Shot = { src: string; alt: string; tag: string; embed?: string }

const GALLERY: Shot[] = [
  {
    src: 'https://media.tenor.com/gKZU-C9ZpTUAAAAe/%D0%B4%D0%B2%D0%B8%D0%B6%D1%83%D1%85%D0%B0-%D0%BF%D1%80%D0%B8%D0%B4%D0%B0%D0%B5%D1%82-%D0%BC%D0%BD%D0%B5-%D1%81%D0%B8%D0%BB%D1%8B-%D0%B4%D0%B2%D0%B8%D0%B6%D1%83%D1%85%D0%B0.png',
    alt: 'движуха придаёт мне силы',
    tag: 'MEME',
    embed: 'https://tenor.com/embed/9270190307911771445',
  },
  { src: 'gallery/nexus-1.jpg', alt: 'NEXUS — сеть серверов', tag: 'NEXUS' },
  { src: 'gallery/barotrauma-1.png', alt: 'Barotrauma — борт субмарины', tag: 'BAROTRAUMA' },
  { src: 'gallery/barotrauma-2.png', alt: 'Barotrauma — глубина', tag: 'BAROTRAUMA' },
  { src: 'gallery/skyhold-1.png', alt: 'SkyHold — Хроники Джандара', tag: 'SKYHOLD' },
  { src: 'gallery/skyhold-2.png', alt: 'SkyHold — Цитадель', tag: 'SKYHOLD' },
  { src: 'gallery/mantani-1.png', alt: 'Mantani — город Нокс', tag: 'MANTANI' },
  { src: 'gallery/mantani-2.png', alt: 'Mantani — день первый', tag: 'MANTANI' },
  { src: 'gallery/dsv-1.png', alt: 'DSV — Чёрная волна', tag: 'DSV' },
  { src: 'gallery/dsv-2.png', alt: 'DSV — команда выживших', tag: 'DSV' },
]

const shotSrc = (s: Shot) => /^https?:/i.test(s.src) ? s.src : import.meta.env.BASE_URL + s.src


type ServerStatus = { online: boolean; players?: number; max?: number }

function ServerCard({
  code,
  title,
  subtitle,
  desc,
  note,
  tag,
  href,
  accentColor,
  glowColor,
  statusLabel,
  status,
  floatDelay,
  revealDelay,
  stripe,
  glitch,
  pattern,
  maintenance,
}: {
  code: string
  title: string
  subtitle: string
  desc: string
  note?: string
  tag: string
  href?: string
  accentColor: string
  glowColor: string
  statusLabel: string
  status?: ServerStatus
  floatDelay: string
  revealDelay: string
  stripe?: boolean
  glitch?: boolean
  pattern?: string
  maintenance?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  const online = status?.online
  const dotColor = maintenance ? '#f0c93a' : status ? (online ? '#5fe08a' : '#e06060') : accentColor
  const statusText = maintenance
    ? 'ТЕХ РАБОТЫ'
    : status
      ? online
        ? 'ONLINE' + (typeof status.players === 'number' ? ` · ${status.players}${status.max ? '/' + status.max : ''}` : '')
        : 'OFFLINE'
      : statusLabel

  return (
    <div style={{ animation: `card-reveal 0.9s cubic-bezier(0.22, 0.9, 0.32, 1) both`, animationDelay: revealDelay }}>
      <div style={{ animation: `float-soft 9s ease-in-out infinite`, animationDelay: floatDelay }}>
    <a
      href={href ?? '#'}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      className={'server-card' + (glitch ? ' glitch' : '')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        textDecoration: 'none',
        background: 'linear-gradient(160deg, #1a2336 0%, #141b2c 100%)',
        border: `1px solid ${hovered ? accentColor + '99' : '#253048'}`,
        borderRadius: '18px',
        padding: '0',
        overflow: 'hidden',
        transition: 'border-color 0.5s ease, box-shadow 0.5s ease, transform 0.5s ease',
        boxShadow: hovered
          ? `0 28px 70px -20px ${glowColor}, 0 0 0 1px ${accentColor}22, inset 0 1px 0 ${accentColor}22`
          : '0 18px 46px -26px rgba(0,0,0,0.6)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        position: 'relative',
      }}
    >
      {/* soft ambient glow that warms on hover */}
      <div
        style={{
          position: 'absolute',
          top: '-40%',
          left: '50%',
          width: '120%',
          height: '80%',
          transform: 'translateX(-50%)',
          background: `radial-gradient(ellipse at center, ${accentColor}, transparent 70%)`,
          opacity: hovered ? 0.16 : 0.06,
          filter: 'blur(30px)',
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* per-site custom pattern overlay */}
      {pattern && (
        <span className={`card-pattern ${pattern}`} style={{ color: accentColor }} aria-hidden />
      )}

      {/* caution-tape stripe for zomboid card */}
      {stripe && (
        <div
          style={{
            height: '5px',
            background: 'repeating-linear-gradient(135deg, #f0c93a 0px, #f0c93a 12px, #1a1507 12px, #1a1507 24px)',
            opacity: 0.85,
          }}
        />
      )}

      {/* top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 22px',
          borderBottom: `1px solid ${hovered ? accentColor + '33' : '#1a2236'}`,
          transition: 'border-color 0.5s ease',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#5a6484', letterSpacing: '0.14em' }}>
          {code}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            fontFamily: 'JetBrains Mono',
            fontSize: '10px',
            color: dotColor,
            letterSpacing: '0.12em',
            transition: 'color 0.4s ease',
          }}
        >
          <span style={{ position: 'relative', display: 'inline-flex', width: '7px', height: '7px' }}>
            {(!status || online) && (
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: dotColor,
                  animation: 'gentle-pulse 3s ease-in-out infinite',
                }}
              />
            )}
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: dotColor }} />
          </span>
          {statusText}
        </span>
      </div>

      {/* content */}
      <div style={{ padding: '30px 26px 28px', position: 'relative', zIndex: 2 }}>
        <div
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '11px',
            color: accentColor,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: '14px',
            opacity: 0.85,
          }}
        >
          {tag}
        </div>

        <h2
          style={{
            fontFamily: 'Outfit',
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 700,
            color: '#e6ecfb',
            margin: '0 0 6px',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: 'Outfit',
            fontSize: '14px',
            fontWeight: 300,
            color: '#5a6484',
            margin: '0 0 22px',
            letterSpacing: '0.04em',
          }}
        >
          {subtitle}
        </p>

        <p style={{ fontFamily: 'Outfit', fontSize: '15px', color: '#8b95b4', margin: '0 0 30px', lineHeight: 1.75 }}>
          {desc}
        </p>

        {note && (
          <p
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '13px',
              letterSpacing: '0.12em',
              color: accentColor,
              margin: '-16px 0 28px',
            }}
          >
            {note}
          </p>
        )}

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: 'JetBrains Mono',
            fontSize: '12px',
            color: hovered ? accentColor : '#5a6484',
            transition: 'color 0.35s ease',
            letterSpacing: '0.1em',
            padding: '9px 18px',
            borderRadius: '999px',
            border: `1px solid ${hovered ? accentColor + '55' : '#20293f'}`,
            background: hovered ? accentColor + '12' : 'transparent',
          }}
        >
          <span>ПЕРЕЙТИ</span>
          <span style={{ transform: hovered ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.35s ease' }}>
            →
          </span>
        </div>
      </div>
    </a>
      </div>
    </div>
  )
}

// ─── Auth modal (единый аккаунт сети) ────────────────────────────────────────
function NexusAuthModal({ sites, onClose, onAuth }: { sites: NexusSite[]; onClose: () => void; onAuth: (me: Me) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [nick, setNick] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selected, setSelected] = useState<string[]>(() => FALLBACK_SITES.map((s) => s.slug))
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [captcha] = useState(() => ({ a: 2 + Math.floor(Math.random() * 8), b: 2 + Math.floor(Math.random() * 8) }))
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const list = sites.length ? sites : FALLBACK_SITES

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const toggleSite = (slug: string) =>
    setSelected((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]))

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(''); setNotice('')
    if (!sb) return setError('Сеть недоступна, попробуйте позже.')
    const nick2 = nick.trim(); const mail = email.trim()
    if (mode === 'register') {
      if (!/^[A-Za-z0-9_]{3,16}$/.test(nick2)) return setError('Позывной: 3–16 символов, латиница, цифры и _.')
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) return setError('Введите корректный e-mail.')
      if (password.length < 6) return setError('Пароль не короче 6 символов.')
      if (Number(captchaAnswer) !== captcha.a + captcha.b) return setError('Неверный ответ на проверку.')
    } else if (!nick2 || !password) return setError('Заполните позывной/почту и пароль.')

    setBusy(true)
    try {
      if (mode === 'login') {
        const loginEmail = nick2.includes('@') ? nick2 : emailFor(nick2)
        const { data, error: authError } = await sb.auth.signInWithPassword({ email: loginEmail, password })
        if (authError) { setError('Неверный позывной/почта или пароль.'); return }
        const me = await ensureProfile(data.user.id, resolveNick(data.user))
        if (!me) { setError('Не удалось загрузить профиль.'); return }
        onAuth(me)
      } else {
        const { data, error: authError } = await sb.auth.signUp({
          email: mail, password, options: { data: { nick: nick2 } },
        })
        if (authError) {
          setError(/already|registered|exists/i.test(authError.message) ? 'Эта почта или позывной уже заняты.' : 'Ошибка регистрации: ' + authError.message)
          return
        }
        if (data?.session && data.user) {
          const me = await ensureProfile(data.user.id, nick2, selected)
          if (!me) { setError('Не удалось создать профиль.'); return }
          onAuth(me)
        } else {
          setPassword(''); setMode('login')
          setNotice(`Профиль создан. Подтвердите e-mail (${mail}) и войдите.`)
        }
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="nx-modal-backdrop" onMouseDown={onClose}>
      <div className="nx-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="nx-close" onClick={onClose} aria-label="Закрыть">✕</button>
        <p className="nx-eyebrow">NEXUS // ЕДИНЫЙ АККАУНТ</p>
        <h2 className="nx-modal-title">{mode === 'login' ? 'Вход в сеть' : 'Регистрация в сети'}</h2>
        <p className="nx-modal-copy">
          {mode === 'login'
            ? 'Один аккаунт для всех сайтов сети. Войдите по позывному или e-mail.'
            : 'Создайте аккаунт и отметьте сайты, где хотите участвовать. Потом можно войти этим же логином на любом сайте.'}
        </p>
        <form onSubmit={submit}>
          <label className="nx-label">{mode === 'login' ? 'ПОЗЫВНОЙ ИЛИ EMAIL' : 'ПОЗЫВНОЙ'}
            <input className="nx-input" autoFocus value={nick} onChange={(e) => setNick(e.target.value)} placeholder={mode === 'login' ? 'Faranatic или you@mail.com' : 'Faranatic'} />
          </label>
          {mode === 'register' && (
            <label className="nx-label">EMAIL
              <input className="nx-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </label>
          )}
          <label className="nx-label">ПАРОЛЬ
            <input className="nx-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          </label>
          {mode === 'register' && (
            <>
              <label className="nx-label">ПРОВЕРКА: СКОЛЬКО БУДЕТ {captcha.a} + {captcha.b}?
                <input className="nx-input" inputMode="numeric" value={captchaAnswer} onChange={(e) => setCaptchaAnswer(e.target.value)} placeholder="Ответ" />
              </label>
              <div className="nx-sites">
                <div className="nx-sites-head">ГДЕ РЕГИСТРИРУЕМСЯ?</div>
                <div className="nx-sites-grid">
                  {list.map((s) => (
                    <label key={s.slug} className={'nx-site' + (selected.includes(s.slug) ? ' on' : '')}>
                      <input type="checkbox" checked={selected.includes(s.slug)} onChange={() => toggleSite(s.slug)} />
                      <span>{s.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
          {error && <p className="nx-error">{error}</p>}
          {notice && <p className="nx-notice">{notice}</p>}
          <button className="nx-primary" type="submit" disabled={busy}>
            {busy ? '...' : mode === 'login' ? 'ВОЙТИ В СЕТЬ' : 'СОЗДАТЬ АККАУНТ'}
          </button>
        </form>
        <button className="nx-link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setNotice('') }}>
          {mode === 'login' ? 'Нет аккаунта? Создать' : 'У меня уже есть аккаунт'}
        </button>
      </div>
    </div>
  )
}

// ─── Maintenance overlay (дождливый фон) ──────────────────────────────────────
function NexusMaintenance({ title, onFounderLogin }: { title?: string; onFounderLogin?: () => void }) {
  return (
    <div className="nx-maint">
      <div className="nx-rain" aria-hidden="true" />
      <div className="nx-maint-inner">
        <p className="nx-eyebrow">СИСТЕМНОЕ СООБЩЕНИЕ // 503</p>
        <h1 className="nx-maint-title">{title ? `${title} — ТЕХНИЧЕСКИЕ РАБОТЫ` : 'ТЕХНИЧЕСКИЕ РАБОТЫ'}</h1>
        <p className="nx-maint-text">Сайт на технических работах. Мы обновляем узлы — скоро всё заработает.</p>
        {onFounderLogin && <button className="nx-link" onClick={onFounderLogin}>Вход для основателя</button>}
      </div>
    </div>
  )
}

// ─── Founder console ──────────────────────────────────────────────────────────
function FounderConsole({ sites, onToggle, onClose }: { sites: NexusSite[]; onToggle: (slug: string, value: boolean) => void; onClose: () => void }) {
  const list = sites.length ? sites : FALLBACK_SITES
  return (
    <div className="nx-modal-backdrop" onMouseDown={onClose}>
      <div className="nx-modal wide" onMouseDown={(e) => e.stopPropagation()}>
        <button className="nx-close" onClick={onClose} aria-label="Закрыть">✕</button>
        <p className="nx-eyebrow">ROOT_CONSOLE // ОСНОВАТЕЛЬ</p>
        <h2 className="nx-modal-title">Тех работы по сайтам</h2>
        <p className="nx-modal-copy">Включите «V» — сайт покажет заглушку «тех работы» всем, кроме админов.</p>
        <div className="nx-toggle-list">
          {[...list].sort((a, b) => a.sort - b.sort).map((s) => (
            <div key={s.slug} className={'nx-toggle-row' + (s.maintenance ? ' on' : '')}>
              <div className="nx-toggle-info">
                <b>{s.title}</b>
                <span>{s.url.replace(/^https?:\/\//, '')}</span>
              </div>
              <button className={'nx-switch' + (s.maintenance ? ' on' : '')} onClick={() => onToggle(s.slug, !s.maintenance)} aria-pressed={s.maintenance}>
                <span className="nx-knob" />
              </button>
            </div>
          ))}
        </div>
        <p className="nx-modal-copy small">Красный = техработы включены.</p>
      </div>
    </div>
  )
}

export default function App() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('ru-RU', { hour12: false }))
  const [menuOpen, setMenuOpen] = useState(false)
  const [splash, setSplash] = useState(true)
  const [splashFade, setSplashFade] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString('ru-RU', { hour12: false })), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!splash) return
    const fade = setTimeout(() => setSplashFade(true), 1100)
    const done = setTimeout(() => setSplash(false), 1700)
    return () => { clearTimeout(fade); clearTimeout(done) }
  }, [splash])

  const [statuses, setStatuses] = useState<Record<string, ServerStatus> | null>(null)
  const [cyber, setCyber] = useState(false)
  const [cyberError, setCyberError] = useState(false)
  const [rebel, setRebel] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryIdx, setGalleryIdx] = useState<number | null>(null)

  // ── единый аккаунт сети + техработы ──
  const [me, setMe] = useState<Me | null>(null)
  const [sites, setSites] = useState<NexusSite[]>(FALLBACK_SITES)
  const [authOpen, setAuthOpen] = useState(false)
  const [founderOpen, setFounderOpen] = useState(false)

  const loadSites = async () => {
    if (!sb) return
    const { data, error } = await sb.from('nexus_sites').select('slug,title,url,maintenance,sort').order('sort')
    if (error || !data) return
    let list = data as NexusSite[]
    try {
      const { data: wg } = await sb.from('watchgrid_settings').select('key,value').eq('key', 'maintenance').maybeSingle()
      if (wg) list = list.map((s) => (s.slug === 'watchgrid' ? { ...s, maintenance: wg.value === 'true' } : s))
    } catch { /* ignore */ }
    setSites(list)
  }

  useEffect(() => {
    if (!sb) return
    loadSites()
    sb.auth.getSession().then(async ({ data }: any) => {
      const user = data?.session?.user
      if (user) {
        const profile = await ensureProfile(user.id, resolveNick(user))
        if (profile) setMe(profile)
      }
    })
    const { data: sub } = sb.auth.onAuthStateChange(async (_event: string, session: any) => {
      if (session?.user) {
        const profile = await ensureProfile(session.user.id, resolveNick(session.user))
        if (profile) setMe(profile)
      } else {
        setMe(null)
      }
    })
    const channel = sb.channel('nexus-sites')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'nexus_sites' }, loadSites)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'watchgrid_settings' }, loadSites)
      .subscribe()
    return () => { sub?.subscription?.unsubscribe?.(); sb.removeChannel(channel) }
  }, [])

  const onAuthed = async (profile: Me) => { setMe(profile); setAuthOpen(false); await loadSites() }

  const logout = async () => { setFounderOpen(false); setMe(null); if (sb) await sb.auth.signOut() }

  const toggleMaintenance = async (slug: string, value: boolean) => {
    setSites((list) => list.map((s) => (s.slug === slug ? { ...s, maintenance: value } : s)))
    if (!sb) return
    if (slug === 'watchgrid') {
      // WATCH_GRID держит техработы в своей таблице — используем её родной экран
      await sb.from('watchgrid_settings').upsert({ key: 'maintenance', value: String(value) })
    } else {
      await sb.from('nexus_sites').update({ maintenance: value, updated_at: new Date().toISOString() }).eq('slug', slug)
    }
  }

  const maintOf = (slug: string) => !!sites.find((s) => s.slug === slug)?.maintenance
  const hubMaint = maintOf('hub')

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch(`${STATUS_URL}?t=${Date.now()}`, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (alive && data && data.servers) setStatuses(data.servers)
      } catch {
        /* unreachable — keep previous values */
      }
    }
    load()
    const t = setInterval(load, 60000)
    return () => { alive = false; clearInterval(t) }
  }, [])

  useEffect(() => {
    if (!cyber) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setCyber(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cyber])

  const lbOpen = galleryIdx !== null
  useEffect(() => {
    if (!lbOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGalleryIdx(null)
      else if (e.key === 'ArrowRight') setGalleryIdx(i => (i === null ? i : (i + 1) % GALLERY.length))
      else if (e.key === 'ArrowLeft') setGalleryIdx(i => (i === null ? i : (i + GALLERY.length - 1) % GALLERY.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lbOpen])

  useEffect(() => {
    if (!galleryOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setGalleryOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [galleryOpen])

  if (hubMaint && !isFounder(me)) {
    return (
      <>
        <NexusMaintenance onFounderLogin={() => setAuthOpen(true)} />
        {authOpen && <NexusAuthModal sites={sites} onClose={() => setAuthOpen(false)} onAuth={onAuthed} />}
      </>
    )
  }

  return (
    <div
      className={rebel ? 'rebel-mode' : undefined}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #10162400 0%, #0e131f 100%), radial-gradient(ellipse 90% 70% at 50% 0%, #172136 0%, #0e131f 60%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'clamp(48px, 8vw, 88px) clamp(20px, 5vw, 60px)',
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      {/* animated wall background */}
      <div className="nexus-bg" aria-hidden="true" />

      {/* splash / заставка при заходе */}
      {splash && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: 'radial-gradient(ellipse 80% 60% at 50% 42%, #172136 0%, #0a0e18 72%)',
            transition: 'opacity 0.55s ease',
            opacity: splashFade ? 0 : 1,
            pointerEvents: splashFade ? 'none' : 'auto',
          }}
        >
          <div style={{ fontFamily: 'Outfit', fontSize: 'clamp(64px, 16vw, 96px)', fontWeight: 700, color: '#edf1fb', letterSpacing: '-0.03em', lineHeight: 1 }}>
            NEXUS
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
            <div style={{ width: '44px', height: '1px', background: 'linear-gradient(to left, #e0a86a, transparent)' }} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.28em', color: '#e0a86a', textTransform: 'uppercase' }}>
              HUB-NODE
            </span>
            <div style={{ width: '44px', height: '1px', background: 'linear-gradient(to right, #e0a86a, transparent)' }} />
          </div>
          <div style={{ display: 'flex', gap: '7px', marginTop: '28px' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#77d4e0', animation: `splash-dot 1.1s ease-in-out ${i * 0.18}s infinite` }} />
            ))}
          </div>
        </div>
      )}

      {/* slow-drifting aurora field */}
      <div
        style={{
          position: 'fixed',
          inset: '-20%',
          background:
            'radial-gradient(ellipse 50% 45% at 28% 18%, rgba(119,212,224,0.13), transparent 62%), radial-gradient(ellipse 45% 40% at 78% 32%, rgba(232,183,132,0.10), transparent 62%), radial-gradient(ellipse 65% 55% at 50% 92%, rgba(110,140,220,0.11), transparent 66%)',
          animation: 'aurora-drift 26s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* fine grain */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: NOISE_SVG,
          backgroundRepeat: 'repeat',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* soft vignette */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          boxShadow: 'inset 0 0 260px 40px rgba(6,9,18,0.55)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* top status bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '11px 26px',
          borderBottom: '1px solid rgba(32,41,63,0.6)',
          background: 'rgba(11,15,25,0.6)',
          backdropFilter: 'blur(12px)',
          zIndex: 50,
        }}
      >
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#4a5474', letterSpacing: '0.12em' }}>
          NEXUS // HUB-NODE
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <label className={'checkbox-wrapper' + (rebel ? ' on' : '')}>
            <input type="checkbox" checked={rebel} onChange={(e) => setRebel(e.target.checked)} />
            <span className="checkmark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 12 10 18 20 6" />
              </svg>
            </span>
            <span className="label">REBELLION MODE</span>
          </label>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#4a5474', letterSpacing: '0.1em' }}>
            {time}
          </span>
          {me ? (
            <div className="nx-user">
              {isFounder(me) && (
                <button className="nx-chip root" onClick={() => setFounderOpen(true)} title="Консоль основателя">
                  ⛭ {me.nick}
                </button>
              )}
              {!isFounder(me) && <span className="nx-chip">{me.nick}</span>}
              <button className="nx-logout" onClick={logout}>выйти</button>
            </div>
          ) : (
            <button className="nx-login-btn" onClick={() => setAuthOpen(true)}>ВОЙТИ</button>
          )}
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Меню"
            style={{ flexDirection: 'column', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px' }}
          >
            <span style={{ width: '18px', height: '2px', background: '#8b95b4', display: 'block' }} />
            <span style={{ width: '18px', height: '2px', background: '#8b95b4', display: 'block' }} />
            <span style={{ width: '18px', height: '2px', background: '#8b95b4', display: 'block' }} />
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setMenuOpen(false)} />
          <div
            style={{
              position: 'fixed',
              top: '49px',
              right: '14px',
              zIndex: 55,
              background: '#0d1322',
              border: '1px solid #253048',
              borderRadius: '12px',
              padding: '8px',
              minWidth: '230px',
              boxShadow: '0 24px 60px -20px rgba(0,0,0,0.7)',
              animation: 'menu-in 0.18s ease',
            }}
          >
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.background = '#16203a' }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'transparent' }}
                style={{
                  display: 'block',
                  padding: '11px 14px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '11px',
                  color: '#8b95b4',
                  textDecoration: 'none',
                  letterSpacing: '0.14em',
                  borderRadius: '8px',
                  transition: 'background 0.2s ease',
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </>
      )}

      <div style={{ width: '100%', maxWidth: '900px', paddingTop: '40px', position: 'relative', zIndex: 2 }}>
        {/* header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(52px, 8vw, 80px)' }}>
          <div
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '11px',
              color: '#e0a86a',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              animation: 'soft-breathe 6s ease-in-out infinite',
            }}
          >
            ◇ &nbsp; GAMING NETWORK &nbsp; ◇
          </div>
          <h1
            style={{
              fontFamily: 'Outfit',
              fontSize: 'clamp(44px, 9vw, 80px)',
              fontWeight: 700,
              color: '#edf1fb',
              margin: '0 0 18px',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              textShadow: '0 0 70px rgba(119,212,224,0.28)',
            }}
          >
            NEXUS
          </h1>
          <p
            style={{
              fontFamily: 'Outfit',
              fontSize: 'clamp(15px, 2vw, 18px)',
              fontWeight: 300,
              color: '#6a7498',
              margin: 0,
              letterSpacing: '0.05em',
            }}
          >
            Центральный узел — выбери направление
          </p>

          {/* decorative line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '36px', justifyContent: 'center' }}>
            <div style={{ flex: 1, maxWidth: '140px', height: '1px', background: 'linear-gradient(to left, #2a3654, transparent)' }} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#4a5474', letterSpacing: '0.18em' }}>
              SELECT SERVER
            </span>
            <div style={{ flex: 1, maxWidth: '140px', height: '1px', background: 'linear-gradient(to right, #2a3654, transparent)' }} />
          </div>

          <button
            onClick={() => { setCyberError(false); setCyber(true) }}
            style={{
              marginTop: '26px',
              fontFamily: 'JetBrains Mono',
              fontSize: '12px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#77d4e0',
              background: 'rgba(119,212,224,0.06)',
              border: '1px solid rgba(119,212,224,0.4)',
              padding: '10px 22px',
              borderRadius: '999px',
              cursor: 'pointer',
              transition: 'background 0.25s ease, color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
            }}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = 'rgba(119,212,224,0.14)'; el.style.boxShadow = '0 0 24px rgba(119,212,224,0.25)' }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = 'rgba(119,212,224,0.06)'; el.style.boxShadow = 'none' }}
          >
            ▶ ВКЛЮЧИТЬ ИНТРО
          </button>
        </div>

        {/* cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '24px',
            marginBottom: '56px',
          }}
        >
          <ServerCard
            code="SRV-001 // SCX"
            title="RU, EU (SCX)"
            subtitle="Barotrauma — Clown Voyages"
            desc="Сервер про путешествия клоунов с элементами РП-тематики. Заходи — мы тебя ждём."
            tag="// Roleplay Voyage"
            accentColor="#77d4e0"
            glowColor="rgba(119,212,224,0.35)"
            statusLabel="ONLINE"
            status={statuses?.barotrauma}
            floatDelay="0s"
            revealDelay="1.2s"
            href="https://retgar11099-crypto.github.io/barotrauma/"
            pattern="pattern-sonar"
            maintenance={maintOf('barotrauma')}
          />
          <ServerCard
            code="SRV-002 // SKYH"
            title="SkyHold"
            subtitle="Minecraft — Хроники Джандара"
            desc="Тёмный ролевой мир, где смерть не освобождает. Читай лор, вступай в Discord и подавай анкету."
            tag="// Fantasy Roleplay"
            accentColor="#c7a15a"
            glowColor="rgba(199,161,90,0.32)"
            statusLabel="ONLINE"
            status={statuses?.skyhold}
            floatDelay="-4.5s"
            revealDelay="1.32s"
            href="https://retgar11099-crypto.github.io/skyhold/"
            pattern="pattern-runes"
            maintenance={maintOf('skyhold')}
          />
          <ServerCard
            code="SRV-003 // MNTN"
            title="Prodject Mantani"
            subtitle="Project Zomboid — Survival"
            desc="Сервер по Project Zomboid. Выживи в мире мертвецов — каждый день на счету."
            tag="// Survival Horror"
            accentColor="#f0c93a"
            glowColor="rgba(240,201,58,0.32)"
            statusLabel="ONLINE"
            status={statuses?.mantani}
            floatDelay="-2s"
            revealDelay="1.44s"
            stripe
            href="https://retgar11099-crypto.github.io/project-zomboid/"
            pattern="pattern-hazard"
            maintenance={maintOf('project-zomboid')}
          />
          <ServerCard
            code="SRV-004 // DSV"
            title="DSV-Zombi"
            subtitle="Minecraft — Zombie Survival"
            desc="Мир после катастрофы, где припасы на исходе, а безопасных мест почти не осталось. Собери команду и выживи."
            note="Россия, Путин, Победа"
            tag="// Zombie Survival"
            accentColor="#91c7a5"
            glowColor="rgba(145,199,165,0.3)"
            statusLabel="ONLINE"
            status={statuses?.['dsv-zombi']}
            floatDelay="-6.5s"
            revealDelay="1.56s"
            href="https://retgar11099-crypto.github.io/dsv-zombi/"
            pattern="pattern-biohazard"
            maintenance={maintOf('dsv-zombi')}
          />
          <ServerCard
            code="SRV-005 // GHTN"
            title="Gihten"
            subtitle="Скоро"
            desc="Сайт ещё доделывается — скоро откроется."
            tag="// В разработке"
            accentColor="#7fe9ff"
            glowColor="rgba(127,233,255,0.35)"
            statusLabel="В РАЗРАБОТКЕ"
            floatDelay="-8s"
            revealDelay="1.68s"
            href="https://retgar11099-crypto.github.io/gihten/"
            pattern="pattern-grid"
            maintenance={maintOf('gihten')}
          />
          <ServerCard
            code="SRV-006 // NC"
            title="RED LAUNCHER"
            subtitle="Cyberpunk 2077 — Night City Node"
            desc="Терминал Ночного города: эпизоды, находки, шёпоты улиц и голос Джонни. Город, который никогда не спит."
            tag="// Night City Archive"
            accentColor="#ff4d4d"
            glowColor="rgba(255,60,60,0.35)"
            statusLabel="СИСТЕМА АКТИВНА"
            floatDelay="-3.4s"
            revealDelay="1.8s"
            glitch
            pattern="pattern-scan"
            href="https://red.protocold7.ru/"
            maintenance={maintOf('redlauncher')}
          />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <button className="gallery-btn" onClick={() => setGalleryOpen(true)}>
            🖼 СКРИНЫ СЕРВЕРОВ
          </button>
        </div>

        {/* footer */}
        <div
          style={{
            borderTop: '1px solid rgba(26,34,54,0.8)',
            paddingTop: '28px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '28px',
            flexWrap: 'wrap',
          }}
        >
          {['ДОКУМЕНТЫ', 'ПРАВИЛА', 'DISCORD', 'КОНТАКТЫ'].map((item) => (
            <a
              key={item}
              href={item === 'DISCORD' ? 'https://discord.gg/tqhwNTZgf3' : '#'}
              target={item === 'DISCORD' ? '_blank' : undefined}
              rel={item === 'DISCORD' ? 'noopener noreferrer' : undefined}
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '10px',
                color: '#4a5474',
                textDecoration: 'none',
                letterSpacing: '0.16em',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#8b95b4')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#4a5474')}
            >
              {item}
            </a>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '18px' }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#2a3450', letterSpacing: '0.12em' }}>
            NEXUS HUB // v1.0.0 // {new Date().getFullYear()}
          </span>
        </div>
      </div>

      {cyber && (
        <div className="cyber-overlay">
          <div className="cyber-scanlines" aria-hidden="true" />
          <div className="cyber-stripes" aria-hidden="true" />
          <div className="cyber-rgb" aria-hidden="true" />
          <div className="cyber-tag">CYBERDECK ACTIVE · NEXUS</div>
          <video
            className="cyber-video"
            src={import.meta.env.BASE_URL + 'intro.mp4'}
            autoPlay
            playsInline
            onEnded={() => setCyber(false)}
            onError={() => setCyberError(true)}
          />
          <button className="cyber-exit" onClick={() => setCyber(false)}>▣ ВЫКЛЮЧИТЬ · ESC</button>
          {cyberError && <div className="cyber-msg">Видео не найдено — добавь файл public/intro.mp4</div>}
        </div>
      )}

      {rebel && (
        <>
          <div className="rebel-tint" aria-hidden="true" />
          <div className="rebel-glitch" aria-hidden="true" />
          <div className="rebel-scanlines" aria-hidden="true" />
          <div className="rebel-alert">⚠ REBELLION MODE · СИСТЕМА НЕСТАБИЛЬНА</div>
        </>
      )}

      {galleryOpen && (
        <div className="gallery-modal" onClick={(e) => { if (e.target === e.currentTarget) setGalleryOpen(false) }}>
          <div className="gallery-modal-box">
            <button className="gallery-lb-close" onClick={() => setGalleryOpen(false)} aria-label="Закрыть">✕</button>
            <div className="gallery-modal-title">СКРИНЫ СЕРВЕРОВ</div>
            <div className="gallery-modal-grid">
              {GALLERY.map((s, i) => (
                <button key={s.src} className="gallery-item" onClick={() => setGalleryIdx(i)} aria-label={s.alt}>
                  <img src={shotSrc(s)} alt={s.alt} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {lbOpen && GALLERY[galleryIdx!] && (
        <div className="gallery-lb" onClick={(e) => { if (e.target === e.currentTarget) setGalleryIdx(null) }}>
          <button className="gallery-lb-close" onClick={() => setGalleryIdx(null)} aria-label="Закрыть">✕</button>
          <button
            className="gallery-lb-nav gallery-lb-prev"
            onClick={(e) => { e.stopPropagation(); setGalleryIdx(i => (i === null ? i : (i + GALLERY.length - 1) % GALLERY.length)) }}
            aria-label="Назад"
          >‹</button>
          {GALLERY[galleryIdx!].embed ? (
            <iframe
              className="gallery-lb-media"
              src={GALLERY[galleryIdx!].embed}
              title={GALLERY[galleryIdx!].alt}
              allowFullScreen
            />
          ) : (
            <img src={shotSrc(GALLERY[galleryIdx!])} alt={GALLERY[galleryIdx!].alt} />
          )}
          <button
            className="gallery-lb-nav gallery-lb-next"
            onClick={(e) => { e.stopPropagation(); setGalleryIdx(i => (i === null ? i : (i + 1) % GALLERY.length)) }}
            aria-label="Вперёд"
          >›</button>
          <div className="gallery-lb-meta">
            <span className="g-tag">{GALLERY[galleryIdx!].tag}</span>
            <span>{GALLERY[galleryIdx!].alt}</span>
            <span className="gallery-lb-counter">{galleryIdx! + 1} / {GALLERY.length}</span>
          </div>
        </div>
      )}

      {authOpen && <NexusAuthModal sites={sites} onClose={() => setAuthOpen(false)} onAuth={onAuthed} />}
      {founderOpen && isFounder(me) && <FounderConsole sites={sites} onToggle={toggleMaintenance} onClose={() => setFounderOpen(false)} />}
    </div>
  )
}
