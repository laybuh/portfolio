import './App.css'
import { useState, useEffect, useRef, useId, Fragment } from 'react'
import { Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom'
import ContactForm from './ContactForm'
import animePhoto from './assets/anime.webp'
import mapPhoto from './assets/map.webp'
import dospacePhoto from './assets/dospace.webp'
import moonfadePhoto from './assets/moonfade.webp'
import hazefmPhoto from './assets/hazefm.webp'
import eliPhoto from './assets/3li3li.webp'
import michiferqueenPhoto from './assets/themichiferqueen.webp'
import laybadevPhoto from './assets/laybadev.webp'
import y2kFemininePhoto from './assets/y2k-feminine-tech.webp'
import { startMoonRoom } from './moonRoom'
import avatarPhoto from './assets/avatar.webp'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

function StarShape({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
    </svg>
  )
}

function KofiButton() {
  return (
    <a
      href="https://ko-fi.com/layba"
      target="_blank"
      rel="noreferrer"
      className="kofi-float"
      aria-label="Buy me a coffee"
    >
      <svg
        className="kofi-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 8h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" />
        <path d="M16 9h2.5a2.5 2.5 0 0 1 0 5H16" />
        <path d="M8 2v2M11 2v2" />
      </svg>
      <span className="kofi-text"><span className="kofi-prompt">$</span>ko-fi</span>
    </a>
  )
}

const navLinks = [
  { key: '1', label: 'about', to: '/about' },
  { key: '2', label: 'projects', to: '/projects' },
  { key: '3', label: 'blog', to: '/blog' },
  { key: '4', label: 'contact', to: '/contact' },
]

const METER_SEGMENTS = 10
const METER_GOAL = 20

function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')

  return (
    <span className="nav-clock">{hh}<i>:</i>{mm}</span>
  )
}

function Nav({ score }) {
  const cycle = score % METER_GOAL
  const filled = score > 0 && cycle === 0
    ? METER_SEGMENTS
    : Math.ceil(cycle / (METER_GOAL / METER_SEGMENTS))
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [typing, setTyping] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return undefined
    if (typing) inputRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, typing])

  const go = (to) => {
    setOpen(false)
    setValue('')
    setError(false)
    navigate(to)
  }

  const submit = (e) => {
    e.preventDefault()
    const match = navLinks.find(l => l.key === value.trim())
    if (match) go(match.to)
    else setError(true)
  }

  return (
    <nav className="nav-term">
      <span className="nav-score">
        <span className="nav-score-label">xp:</span>
        <b>{String(score).padStart(2, '0')}</b>
        <span className="nav-score-meter" aria-hidden="true">
          {Array.from({ length: METER_SEGMENTS }, (_, i) => (
            <i key={i} className={i < filled ? 'nav-score-seg-on' : undefined} />
          ))}
        </span>
      </span>
      <Clock />
      <Link to="/" className="nav-term-home">
        <span className="nav-term-prompt">&gt;</span>index
      </Link>
      <div className="nav-term-inner">
      <button
        type="button"
        className="nav-term-trigger"
        aria-expanded={open}
        onClick={() => { setTyping(true); setOpen(v => !v) }}
      >
        <span className="nav-term-prompt">&gt;</span>
        {open ? 'close' : 'navigation'}
        <span className="nav-term-caret" />
      </button>

      {open && (
        <div className="nav-term-panel">
          <p className="nav-term-head">select a destination</p>
          <ul className="nav-term-list">
            {navLinks.map(l => (
              <li key={l.key}>
                <Link to={l.to} onClick={() => go(l.to)}>
                  <span className="nav-term-key">[{l.key}]</span>
                  <span className="nav-term-label">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <form className="nav-term-form" onSubmit={submit}>
            <span className="nav-term-prompt">&gt;</span>
            <input
              ref={inputRef}
              onFocus={() => setTyping(true)}
              className="nav-term-input"
              value={value}
              onChange={(e) => {
                const v = e.target.value.trim()
                setValue(v)
                const match = navLinks.find(l => l.key === v)
                if (match) go(match.to)
                else setError(v.length > 0)
              }}
              inputMode="numeric"
              maxLength={1}
              aria-label="Enter a destination number"
            />
          </form>
          <p className={`nav-term-foot${error ? ' nav-term-err' : ''}`}>
            {error ? `unknown command: ${value}` : 'type a number.'}
          </p>
        </div>
      )}
      </div>
    </nav>
  )
}

const ROOM_TAGS = [
  { label: 'contact', to: '/contact', x: 95, y: 46 },
  { label: 'blog', to: '/blog', x: 186.5, y: 20 },
  { label: 'about', to: '/about', x: 246.5, y: 105 },
  { label: 'projects', to: '/projects', x: 329.5, y: 98 },
]

const PHONE = '(max-width: 600px)'
const HALF_SPOTS = [118, 306]

function GameHelp({ className, label = 'controls', verb = 'click', target = 'a label', arrows = false }) {
  const ref = useRef(null)
  const id = useId()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (!ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  return (
    <div className={`game-help ${className}`} ref={ref}>
      <button
        type="button"
        className="game-help-btn"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(o => !o)}
      >
        {label}
      </button>
      {open && (
        <ul className="game-help-tip" id={id}>
          <li><b>{verb} anywhere</b> to walk</li>
          <li><b>{verb} her</b> to hop</li>
          <li><b>{verb} the lamp</b> for lights</li>
          {arrows && <li><b>{verb} the arrow</b> to switch sides</li>}
          <li><b>{verb} {target}</b> to open it</li>
        </ul>
      )}
    </div>
  )
}

function MoonRoom() {
  const mainRef = useRef(null)
  const grainRef = useRef(null)
  const roomRef = useRef(null)
  const [half, setHalf] = useState(0)

  useEffect(() => {
    const room = startMoonRoom(mainRef.current, grainRef.current)
    roomRef.current = room
    if (window.matchMedia(PHONE).matches) room.placeAt(HALF_SPOTS[0])
    return room.stop
  }, [])

  const goHalf = (h) => {
    setHalf(h)
    roomRef.current.walkTo(HALF_SPOTS[h])
  }

  return (
    <div className="moon-stage">
      <nav className="moon-nav">
        {ROOM_TAGS.map(tag => (
          <Link key={tag.to} to={tag.to}>{tag.label}</Link>
        ))}
      </nav>
      <div className="moon-view">
        <div className={half ? 'moon-room moon-room-right' : 'moon-room'}>
          <canvas ref={mainRef} className="moon-main" width="376" height="197" aria-label="Layba's bedroom" />
          <canvas ref={grainRef} className="moon-grain" width="376" height="197" aria-hidden="true" />
          <span className="moon-sign" aria-hidden="true">layba.dev</span>
          <div className="moon-vignette" aria-hidden="true" />
          <GameHelp className="game-help-room" />
          {ROOM_TAGS.map(tag => (
            <Link key={tag.to} to={tag.to} className="moon-tag" style={{ left: `${((tag.x - 24) / 376) * 100}%`, top: `${(tag.y / 197) * 100}%` }}>
              {tag.label}
            </Link>
          ))}
        </div>
        {half === 0
          ? <button type="button" className="moon-arrow moon-arrow-right" onClick={() => goHalf(1)} aria-label="Look right">&gt;</button>
          : <button type="button" className="moon-arrow moon-arrow-left" onClick={() => goHalf(0)} aria-label="Look left">&lt;</button>}
      </div>
    </div>
  )
}

function Dialogue({ line }) {
  return (
    <div className={line.length > 90 ? 'vn-box vn-box-long' : 'vn-box'}>
      <span className="vn-name">LAYBA</span>
      <h1 className="vn-line">{line}</h1>
    </div>
  )
}

function GameShell({ line, onHome, help = false, children }) {
  return (
    <section className="hero">
      <div className="game">
        <aside className="game-side">
          <Link to="/" className="game-side-link" onClick={onHome} aria-label="Home">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3L12 3z" />
            </svg>
          </Link>
          <a className="game-side-link" href="mailto:hello@layba.dev" aria-label="Email">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
            </svg>
          </a>
          <a className="game-side-link" href="https://linkedin.com/in/laybas" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a className="game-side-link" href="https://www.instagram.com/layba.dev" target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
          <a className="game-side-link" href="https://github.com/laybuh" target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
          <a className="game-side-link" href="https://ko-fi.com/layba" target="_blank" rel="noreferrer" aria-label="Ko-fi">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 8h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" />
              <path d="M16 9h2.5a2.5 2.5 0 0 1 0 5H16" />
              <path d="M8 2v2M11 2v2" />
            </svg>
          </a>
          {help && <GameHelp className="game-help-side" label="?" verb="tap" target="a link" arrows />}
        </aside>
        <div className="game-main">
          {children}
          <Dialogue line={line} />
        </div>
      </div>
    </section>
  )
}

function Home() {
  const [run, setRun] = useState(0)
  return (
    <GameShell line="Welcome! I'm Layba. I like building aesthetic digital experiences." onHome={() => setRun(r => r + 1)} help>
      <MoonRoom key={run} />
    </GameShell>
  )
}

const PIXEL_COLORS = { P: '#f0a8d2', L: '#f8d3e9', D: '#b86198', W: '#ffffff' }

const PIXEL_ICONS = {
  room: [
    '............',
    '....PPPP....',
    '..PPPLL.....',
    '.PPLL.......',
    '.PPL........',
    'PPLL........',
    'PPLL........',
    'PPLL.......P',
    '.PPLL....PP.',
    '.PPPLLLLPP..',
    '..PPPPPPP...',
    '....PPP.....',
  ],
  about: [
    '............',
    '.PPPP..PPPP.',
    'PWLLPPPPLLLP',
    'PWLLLLLLLLLP',
    'PLLLLLLLLLLP',
    '.PLLLLLLLLP.',
    '..PLLLLLLP..',
    '...PLLLLP...',
    '....PLLP....',
    '.....PP.....',
    '............',
    '............',
  ],
  projects: [
    '............',
    '.DDDD.......',
    'DPPPPD......',
    'DPPPPPDDDDD.',
    'DLLLLLLLLLLD',
    'DLPPPPPPPPLD',
    'DLPPPPPPPPLD',
    'DLPPPPPPPPLD',
    'DLPPPPPPPPLD',
    'DLPPPPPPPPLD',
    'DDDDDDDDDDDD',
    '............',
  ],
  blog: [
    '..D..D..D...',
    '.PDPPDPPDPP.',
    '.PLLLLLLLLP.',
    '.PLDDDDDDLP.',
    '.PLLLLLLLLP.',
    '.PLDDDDDLLP.',
    '.PLLLLLLLLP.',
    '.PLDDDDDDLP.',
    '.PLLLLLLLLP.',
    '.PLDDDLLLLP.',
    '.PLLLLLLLLP.',
    '.PPPPPPPPPP.',
  ],
  contact: [
    '............',
    '............',
    'PPPPPPPPPPPP',
    'PLPLLLLLLPLP',
    'PLLPLLLLPLLP',
    'PLLLPLLPLLLP',
    'PLLLLPPLLLLP',
    'PLLLLLLLLLLP',
    'PLLLLLLLLLLP',
    'PPPPPPPPPPPP',
    '............',
    '............',
  ],
}

function PixelIcon({ name }) {
  return (
    <svg className="pixel-icon" viewBox="0 0 12 12" shapeRendering="crispEdges" aria-hidden="true">
      {PIXEL_ICONS[name].flatMap((row, y) => [...row].map((c, x) => (
        c === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={PIXEL_COLORS[c]} />
      )))}
    </svg>
  )
}

const DESK_ICONS = [
  { name: 'room', label: 'index', to: '/' },
  { name: 'about', label: 'about', to: '/about' },
  { name: 'projects', label: 'projects', to: '/projects' },
  { name: 'blog', label: 'blog', to: '/blog' },
  { name: 'contact', label: 'contact', to: '/contact' },
]

const SKILLS = [
  'JavaScript', 'TypeScript', 'HTML', 'CSS', 'React', 'Next.js', 'Angular', 'Bootstrap', 'Vite',
  'Java', 'Spring Boot', 'Node.js', 'Python', 'FastAPI', 'C#', '.NET', 'C++', 'Kotlin', 'Android',
  'RESTful APIs', 'OOP', 'PostgreSQL', 'MySQL', 'Git', 'Gradle', 'Docker', 'AWS',
  'Linux', 'Vercel', 'Jest', 'VS Code', 'Visual Studio', 'Agile',
]

function SkillList() {
  return (
    <div className="skill-chips">
      {SKILLS.map(item => <span key={item}>{item}</span>)}
    </div>
  )
}

const CERTS = [
  ['Python Full Stack Developer (Python + React Intern)', 'Oriented In Silence Designs Inc. · Riipen'],
  ['AWS Certified Cloud Practitioner', 'Amazon Web Services Training and Certification'],
  ['ITIL 4 Foundation Certificate in IT Service Management', 'PeopleCert'],
  ['WGU Certificate: Back-End Developer', 'Western Governors University'],
  ['WGU Certificate: Front-End Developer', 'Western Governors University'],
]

function CertList() {
  return (
    <ul className="cert-list">
      {CERTS.map(([name, from]) => (
        <li key={name}>
          <span className="cert-name">{name}</span>
          <span className="cert-from">{from}</span>
        </li>
      ))}
    </ul>
  )
}

const ORIGIN = { x: 0, y: 0 }

function DeskWindow({ title, className, front, offset, onMove, onClose, onFocus, children }) {
  const startDrag = (e) => {
    if (e.button !== 0 || e.target.closest('button') || window.matchMedia(PHONE).matches) return
    e.preventDefault()
    const win = e.currentTarget.parentElement
    const desk = win.parentElement.getBoundingClientRect()
    const box = win.getBoundingClientRect()
    const bar = e.currentTarget.offsetHeight
    const start = { x: e.clientX, y: e.clientY }
    const move = (ev) => {
      const dx = Math.min(Math.max(ev.clientX - start.x, desk.left - box.left), desk.right - box.right)
      const dy = Math.min(Math.max(ev.clientY - start.y, desk.top - box.top), desk.bottom - box.top - bar)
      onMove({ x: offset.x + dx, y: offset.y + dy })
    }
    const stop = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
  }

  return (
    <section
      className={front ? `desk-win ${className} desk-win-front` : `desk-win ${className}`}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      onPointerDown={onFocus}
    >
      <header className="desk-bar" onPointerDown={startDrag}>
        <span className="desk-bar-title">{title}</span>
        <button type="button" className="desk-close" onClick={onClose} aria-label={`Close ${title}`}>&times;</button>
      </header>
      {children}
    </section>
  )
}

function useDeskWindows(ids, firstFront = ids[0]) {
  const [open, setOpen] = useState(() => Object.fromEntries(ids.map(id => [id, true])))
  const show = (id) => {
    setOpen(o => ({ ...o, [id]: true }))
    setFront(id)
  }
  const [front, setFront] = useState(firstFront)
  const [pos, setPos] = useState({})
  const reopen = () => {
    setOpen(Object.fromEntries(ids.map(id => [id, true])))
    setFront(ids[0])
  }
  const win = (id) => ({
    front: front === id,
    offset: pos[id] || ORIGIN,
    onMove: (p) => setPos(o => ({ ...o, [id]: p })),
    onClose: () => setOpen(o => ({ ...o, [id]: false })),
    onFocus: () => setFront(id),
  })
  return { open, show, reopen, win }
}


function Desktop({ onReopen, children }) {
  const { pathname } = useLocation()
  return (
    <>
      <nav className="moon-nav">
        {ROOM_TAGS.map(tag => (
          <Link key={tag.to} to={tag.to} className={tag.to === pathname ? 'moon-nav-on' : undefined}>{tag.label}</Link>
        ))}
      </nav>
      <div className="desk">
        <div className="desk-icons">
          {DESK_ICONS.map(icon => (
            icon.to === pathname
              ? (
                <button key={icon.name} type="button" className="desk-icon desk-icon-on" onClick={onReopen}>
                  <PixelIcon name={icon.name} />
                  <span>{icon.label}</span>
                </button>
              )
              : (
                <Link key={icon.name} to={icon.to} className="desk-icon">
                  <PixelIcon name={icon.name} />
                  <span>{icon.label}</span>
                </Link>
              )
          ))}
        </div>
        {children}
      </div>
    </>
  )
}

function About() {
  const { open, reopen, win } = useDeskWindows(['about', 'skills', 'certs'])

  return (
    <GameShell line="Here's more about me!">
      <Desktop onReopen={reopen}>
        {open.about && (
          <DeskWindow title="about_me.txt" className="desk-win-main" {...win('about')}>
            <div className="desk-doc">
              <img className="about-avatar" src={avatarPhoto} alt="Layba" />
              <h2>PROFILE</h2>
              <p className="desk-hi">{'// hi hi!'}</p>
              <p>I'm Layba, a software engineer and full-stack developer who likes building things that are both functional and beautiful.</p>
              <p>My experience taught me to break down hard problems and explain them clearly, which makes me a better developer. I care a lot about the user experience and getting the details right.</p>
              <p>Right now I'm focused on UX/UI and getting better at creative coding, while challenging my current skills and learning how to improve them more efficiently.</p>
              <p>Outside of coding, you'll find me with my cats, keeping up with fashion and beauty, or hunting for good Thai food, usually with a coffee or matcha in hand.</p>
              <div className="desk-skills-inline">
                <SkillList />
                <CertList />
              </div>
            </div>
          </DeskWindow>
        )}
        {open.skills && (
          <DeskWindow title="skills.exe" className="desk-win-skills" {...win('skills')}>
            <div className="desk-doc">
              <SkillList />
            </div>
          </DeskWindow>
        )}
        {open.certs && (
          <DeskWindow title="certs.txt" className="desk-win-certs" {...win('certs')}>
            <div className="desk-doc">
              <CertList />
            </div>
          </DeskWindow>
        )}
      </Desktop>
    </GameShell>
  )
}

const featured = {
  slug: 'layba-dev',
  img: laybadevPhoto,
  alt: 'layba.dev',
  title: 'layba.dev',
  status: 'this site',
  short: "The site you're currently on.",
  desc: "The site you're on. React, Vite, and React Router with plain CSS instead of a component library. The hero is a pixel wordmark over a starfield, with film grain over the whole site. Navigation is a terminal panel where you click a destination or type its number, and the top bar has a clock and an XP meter that fills as you click around. Projects open as folders in place instead of separate pages. Images are WebP and routes scroll back to the top.",
  tags: ['React', 'Vite', 'React Router', 'CSS'],
  links: [
    { href: 'https://layba.dev', label: 'live' },
    { href: 'https://github.com/laybuh/portfolio', label: 'github' },
  ]
}

const projects = [
  {
    slug: '3li3li',
    img: eliPhoto,
    alt: '3LI3LI',
    title: '3LI3LI',
    instagram: { href: 'https://www.instagram.com/3li3lielieli', label: '@3li3lielieli' },
    short: 'A site for singer, songwriter, and DJ 3LI3LI.',
    desc: 'A Y2K/vaporwave site for independent music artist 3LI3LI. React, Vite, and CSS Modules across multiple routes, with an AIM-style intro window, a scrolling Y2K ticker bar, and a sparkle cursor. The music page runs a Spotify embed, ElfSight pulls in her latest TikTok and Instagram posts automatically, and fans can buy and download her EP through a Web3Forms and Cash App setup.',
    tags: ['React', 'Vite', 'CSS Modules', 'Elfsight', 'Spotify Embed', 'Web3Forms API'],
    links: [
      { href: 'https://3li3li.com', label: 'live' },
    ]
  },
  {
    slug: 'themichiferqueen',
    img: michiferqueenPhoto,
    alt: 'themichiferqueen',
    title: 'themichiferqueen',
    instagram: { href: 'https://instagram.com/themichiferqueen', label: '@themichiferqueen' },
    short: 'A site for independent author and artist Jasmine Plaskon.',
    desc: 'A retro-pixel/Y2K site for independent author and artist Jasmine Plaskon. Next.js, TypeScript, and Tailwind across stories, blog, gallery, lore, and shop, with an 18+ age gate, a floating Spotify player, and a gallery for her art and video. Sanity lets her run every page and post her own work without touching code, and readers can buy her books through a Stripe shop or keep up through a Web3Forms newsletter.',
    tags: ['Next.js', 'React', 'TypeScript', 'Sanity CMS', 'Stripe API', 'Tailwind CSS', 'Spotify Embed', 'Web3Forms API'],
    links: [
      { href: 'https://themichiferqueen.com', label: 'live' },
    ]
  },
  {
    slug: 'moonfade',
    img: moonfadePhoto,
    alt: 'Moonfade',
    title: 'moonfade',
    status: 'launching soon',
    short: 'A goal and intention tracker where each intention is represented by a virtual candle you light as you commit to it.',
    preview: moonfadePhoto,
    desc: "A pastel desktop-OS site for lighting virtual candles tied to goals and intentions. Next.js, TypeScript, and CSS across the altar, history, and account pages, with a main candle at the new moon that lasts the whole cycle and phase candles that only light while their phase is out. Moon phase data comes from the U.S. Naval Observatory, with a local calculation as a backup when that is down, and Postgres on Supabase stores the candles so people can search, edit, and put out their own intentions.",
    tags: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Supabase', 'USNO API', 'JWT Auth', 'CSS Animation'],
    links: []
  },
  {
    slug: 'lunev',
    img: dospacePhoto,
    alt: 'lunev',
    title: 'lunev',
    short: 'A mental wellness and productivity app that brings tasks, journaling, mood tracking, and focus tools into one private space.',
    desc: 'A full-stack mental wellness and productivity app that pulls tasks, journaling, mood tracking, affirmations, and focus tools into one private space. React, Vite, and Tailwind up front, with Node.js, Express, and PostgreSQL behind it. Everything a user writes is encrypted with AES-256-GCM before it reaches the database, so a leak would only expose unreadable ciphertext. Auth is hardened with JWT refresh-token rotation and reuse detection, bcrypt hashing, two-step email verification, rate limiting, CSRF checks, a strict Content-Security-Policy, and idle session timeout.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'JWT', '2FA', 'AES-256-GCM', 'bcrypt'],
    links: [
      { href: 'https://lunev.app', label: 'live' },
      { href: 'https://github.com/laybuh/todo-frontend', label: 'github (FE)' },
      { href: 'https://github.com/laybuh/todo-app', label: 'github (BE)' },
    ]
  },
  {
    slug: 'haze-fm',
    img: hazefmPhoto,
    alt: 'haze.fm',
    title: 'haze.fm',
    short: 'A music discovery app that builds playlists from a mood or an artist.',
    note: 'Work in progress: it runs on a free tier, so it may be rate limited.',
    desc: 'A music discovery app that builds playlists from a mood or a favorite artist. Next.js and TypeScript, with Last.fm mapping emotional tags to tracks and the YouTube Data API streaming full songs in-app. Custom mood-to-tag logic, real-time playlist generation, shuffle, skip, and regenerate controls, and cycling background scenes to set the tone.',
    tags: ['Next.js', 'TypeScript', 'Last.fm API', 'YouTube API', 'Tailwind CSS'],
    links: [
      { href: 'https://hazefm.vercel.app', label: 'live' },
      { href: 'https://github.com/laybuh/hazefm', label: 'github' },
    ]
  },
  {
    slug: 'anime-search-terminal',
    img: animePhoto,
    alt: 'Anime Search Terminal',
    title: 'anime search terminal',
    short: 'A search terminal for finding anime.',
    desc: 'A React and Vite app wired to the Jikan API for live MyAnimeList data. Search by title, filter by type, genre, and minimum score, then sort by rating or name. Each result shows cover art, score, and a hover-to-reveal synopsis, with a light/dark toggle and a responsive dark neon interface.',
    tags: ['React', 'Vite', 'Jikan API'],
    links: [
      { href: 'https://animesearcher.vercel.app', label: 'live' },
      { href: 'https://github.com/laybuh/anime-search', label: 'github' },
    ]
  },
  {
    slug: 'angular-world-map',
    img: mapPhoto,
    alt: 'Angular World Map',
    title: 'world data map',
    short: 'An interactive world map that pulls live country data.',
    desc: 'An interactive world map in Angular and TypeScript, pulling live country data from the World Bank API. Click any country on the SVG map to see its name, capital, region, income level, and coordinates in a sidebar. Uses Angular routing, HttpClient, and event binding. Started as a university project, then extended and deployed on my own.',
    tags: ['Angular', 'TypeScript', 'World Bank API', 'SVG'],
    links: [
      { href: 'https://layba-map.vercel.app', label: 'live' },
      { href: 'https://github.com/laybuh/angular-map/', label: 'github' },
    ]
  },
]

const allProjects = [featured, ...projects]

const posts = [
  {
    slug: 'y2k-feminine',
    img: y2kFemininePhoto,
    alt: 'The Rise of Y2K and Feminine Tech',
    title: 'The Rise of Y2K and Feminine Tech',
    date: 'July 2026',
    excerpt: "I'm a software engineer bringing femininity and creativity to a traditionally male-dominated industry.",
    body: [
      `I build all kinds of sites, but Y2K-style or girly websites are my favorite kind to build. It has, unfortunately, become an unspoken rule that "professional" web design means gray, minimal, corporate. neutral fonts, muted palettes, a lot of white space, and somewhere along the way, we decided that look is what professionalism is.`,
      `The tech industry is very male-dominated, and that type of mentality is a form of misogyny. It came from an industry that's still overwhelmingly male at every senior level, and it quietly coded gray and neutral as competent. At the same time, anything colorful, maximalist, or femme-coded got read as less serious, less technical, more "just design", as if a hot pink gradient site is somehow easier to build than a black, white, and beige one.`,
      `A sparkly, glittery design with lots of effects and many different functions can be more complex and time-consuming to build than a minimal, gray website that the industry finds "professional". Anyone can throw a template together in a neutral palette and call it clean. Building something with custom cursors, layered gradients, glitchy hover states, and a whole visual world that still loads fast and works on every screen takes real skill; it's just skill that doesn't get coded as professionalism or skilled because it doesn't look like what men have been building for decades.`,
      `In 1843, Ada Lovelace published what's widely credited as the first computer algorithm: notes she wrote for Charles Babbage's Analytical Engine, which was the only way it was recognized, as it was discouraged for women to post their own work. Software has feminine roots. Yet 180 years later, women make up only around a quarter of the global core technical workforce, a figure that shrinks even further at senior levels.`,
      `Women reclaiming tech has been making a comeback. Cyberdecks, small custom-built computers, used to live almost entirely in a black-metal, minimal aesthetic. Now there's a whole wave of women building theirs in pink, in decorative cases, tucked into purses and dollhouses, deliberately choosing hackable ones, combining with makeup and personal tech, over another sealed, optimized device that was never embraced by creativity.`,
      `Some of my clients are creators who don't see themselves reflected in typical "professional" web design: LGBTQ+ artists, femmes, women, people of color told that serious work has to look minimal and safe. I would argue the opposite. A site that's creative, maximalist, and specific to you is a lot more memorable, and it's not any less skilled just because it is fun to look at.`,
    ],
    sources: [
      `Haugtvedt, K. & Abata, A., "Ada Lovelace: First Computer Programmer and Hacker?", ASEE, 2021`,
      `Metana, "Women in Tech Statistics (2026)"`,
      `TechCrunch, "Cyberdecks are having a moment"`,
    ]
  },
]

function FolderGrid({ items, icon, keep, renderPanel }) {
  const [openKey, setOpenKey] = useState(null)
  const [aboutKey, setAboutKey] = useState(null)
  const panelRef = useRef(null)
  const perRow = 2
  const active = items.find(item => item.slug === openKey)
  const activeRow = active ? Math.floor(items.indexOf(active) / perRow) : -1

  useEffect(() => {
    panelRef.current?.scrollIntoView({ block: 'nearest' })
  }, [openKey, aboutKey])

  useEffect(() => {
    if (!openKey) return undefined
    const onDown = (e) => {
      if (e.target.closest(`.proj-folder, .proj-panel, ${keep}`)) return
      setOpenKey(null)
      setAboutKey(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [openKey, keep])

  const toggle = (key) => {
    setOpenKey(cur => (cur === key ? null : key))
    setAboutKey(null)
  }

  return (
    <div className="desk-doc proj-grid">
      {items.map((item, i) => {
        const endOfRow = (i + 1) % perRow === 0 || i === items.length - 1
        return (
          <Fragment key={item.slug}>
            <button
              type="button"
              className={openKey === item.slug ? 'proj-folder proj-folder-on' : 'proj-folder'}
              aria-expanded={openKey === item.slug}
              onClick={() => toggle(item.slug)}
            >
              <PixelIcon name={icon} />
              <span>{item.title}</span>
            </button>
            {endOfRow && Math.floor(i / perRow) === activeRow && (
              <div className="proj-panel" ref={panelRef}>
                {renderPanel(active, {
                  aboutOpen: aboutKey === active.slug,
                  aboutButton: (
                    <button type="button" className={aboutKey === active.slug ? 'proj-btn proj-btn-on' : 'proj-btn'} onClick={() => setAboutKey(cur => (cur === active.slug ? null : active.slug))}>
                      about
                    </button>
                  ),
                })}
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

function Projects() {
  const { open, show, win } = useDeskWindows(['web'])
  const [preview, setPreview] = useState(null)

  const openPreview = (project) => {
    setPreview(project)
    show('preview')
  }

  return (
    <GameShell line="This page is still under construction and will be updated with more projects, but in the meantime, enjoy the projects that are listed!">
      <Desktop onReopen={() => show('web')}>
        {open.web && (
          <DeskWindow title="projects.exe" className="desk-win-web" {...win('web')}>
            <FolderGrid
              items={allProjects}
              icon="projects"
              keep=".desk-win-preview"
              renderPanel={(project, { aboutOpen, aboutButton }) => {
                const live = project.links.find(link => link.label === 'live')
                return (
                  <>
                    <p className="proj-panel-name">~/{project.title}/</p>
                    <div className="proj-panel-btns">
                      {aboutButton}
                      {live
                        ? <a className="proj-btn" href={live.href} target="_blank" rel="noreferrer">visit</a>
                        : <button type="button" className="proj-btn" onClick={() => openPreview(project)}>preview</button>}
                    </div>
                    {aboutOpen && (
                      <>
                        <p className="proj-panel-desc">
                          {project.short}
                          {project.note && <em className="proj-note">{project.note}</em>}
                        </p>
                        <div className="skill-chips proj-panel-tags">
                          {project.tags.map(tag => <span key={tag}>{tag}</span>)}
                        </div>
                      </>
                    )}
                  </>
                )
              }}
            />
          </DeskWindow>
        )}
        {open.preview && preview && (
          <DeskWindow title={`${preview.title}.png`} className="desk-win-preview" {...win('preview')}>
            <img className="proj-preview-img" src={preview.preview} alt={`${preview.title} preview`} />
          </DeskWindow>
        )}
      </Desktop>
    </GameShell>
  )
}

function Blog() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { open, show, win } = useDeskWindows(['blog'], slug ? 'read' : 'blog')
  const reading = posts.find(post => post.slug === slug)

  return (
    <GameShell line="My blog page consists of just one entry talking about my thoughts on sexism in the tech industry, but I plan to write more as time goes on.">
      <Desktop onReopen={() => show('blog')}>
        {open.blog && (
          <DeskWindow title="blog.log" className="desk-win-web desk-win-blog" {...win('blog')}>
            <div className="desk-doc blog-entries">
              {posts.map(post => (
                <article key={post.slug} className="blog-entry">
                  <PixelIcon name="blog" />
                  <h2>{post.title}</h2>
                  <p className="read-date">{post.date}</p>
                  <p>{post.excerpt}</p>
                  <Link className="proj-btn" to={`/blog/${post.slug}`} onClick={() => show('read')}>read</Link>
                </article>
              ))}
            </div>
          </DeskWindow>
        )}
        {reading && (
          <DeskWindow title={`${reading.slug}.txt`} className="desk-win-read" {...win('read')} onClose={() => navigate('/blog')}>
            <article className="desk-doc read-doc">
              <p className="read-date">{reading.date}</p>
              <h2>{reading.title}</h2>
              {reading.body.map((para, i) => (
                <Fragment key={i}>
                  <p>{para}</p>
                  {i === 1 && <img className="read-cover" src={reading.img} alt={reading.alt} />}
                </Fragment>
              ))}
              <p className="read-sources-title">sources</p>
              <ul className="read-sources">
                {reading.sources.map(source => <li key={source}>{source}</li>)}
              </ul>
            </article>
          </DeskWindow>
        )}
      </Desktop>
    </GameShell>
  )
}

function Contact() {
  const { open, show, win } = useDeskWindows(['contact'])

  return (
    <GameShell line="Do you want to work together? Do you have feedback, questions, or concerns? Do you just want to say hi? Send me a message, and I will get back to you!">
      <Desktop onReopen={() => show('contact')}>
        {open.contact && (
          <DeskWindow title="contact.exe" className="desk-win-web desk-win-contact" {...win('contact')}>
            <div className="desk-doc">
              <h2>Let's connect!</h2>
              <p className="contact-hint">Send a message.</p>
              <ContactForm />
            </div>
          </DeskWindow>
        )}
      </Desktop>
    </GameShell>
  )
}

function App() {
  const [score, setScore] = useState(0)
  const { pathname } = useLocation()
  const inGame = ['/', '/about', '/projects', '/blog', '/contact'].includes(pathname) || pathname.startsWith('/blog/')

  useEffect(() => {
    const onClick = (e) => {
      const el = e.target
      if (el && typeof el.closest === 'function' && el.closest('a, button')) {
        setScore(s => s + 1)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <main>
      <ScrollToTop />
      {!inGame && <Nav score={score} />}
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      {!inGame && <Footer />}
    </main>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <Link to="/" className="footer-tag">© {new Date().getFullYear()} layba.dev</Link>
      <KofiButton />
    </footer>
  )
}

export default App
