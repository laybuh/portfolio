import './App.css'
import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom'
import ContactForm from './ContactForm'
import laybaPhoto from './assets/layba.webp'
import animePhoto from './assets/anime.webp'
import mapPhoto from './assets/map.webp'
import dospacePhoto from './assets/dospace.webp'
import moonfadePhoto from './assets/moonfade.webp'
import hazefmPhoto from './assets/hazefm.webp'
import eliPhoto from './assets/3li3li.webp'
import michiferqueenPhoto from './assets/themichiferqueen.webp'
import laybadevPhoto from './assets/laybadev.webp'
import y2kFemininePhoto from './assets/y2k-feminine-tech.webp'

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
  { key: '1', label: 'about', to: '/#about' },
  { key: '2', label: 'projects', to: '/projects' },
  { key: '3', label: 'blog', to: '/blog' },
  { key: '4', label: 'contact', to: '/contact' },
]

const METER_SEGMENTS = 10
const METER_GOAL = 20

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

function Hero() {
  const navigate = useNavigate()
  return (
    <section className="hero">
      <div className="hero-stars" aria-hidden="true" />
      <div className="hero-stars2" aria-hidden="true" />
      <div className="hero-content">
        <div className="checker-row">
          <StarShape className="accent-star" />
          <span className="eyebrow">HI I'M LAYBA</span>
          <StarShape className="accent-star" />
        </div>
        <h1 className="welcome">WELCOME</h1>
        <p className="subtitle">I like building aesthetic digital experiences.</p>
        <div className="hero-buttons btn-visible">
          <button type="button" onClick={() => navigate('/projects')}>
            View My Work
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/contact')}>
            Work With Me
          </button>
        </div>
        <div className="hero-social">
          <a className="hero-social-link" href="mailto:hello@layba.dev" aria-label="Email">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
            </svg>
          </a>
          <a className="hero-social-link" href="https://linkedin.com/in/laybas" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a className="hero-social-link" href="https://www.instagram.com/laybacoded" target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
          <a className="hero-social-link" href="https://github.com/laybuh" target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <About />
    </>
  )
}

function About() {
  return (
    <section className="about" id="about">
      <div className="about-cover" aria-hidden="true">
        <div className="about-eyebrow-row">
          <span className="about-eyebrow">N&deg;01 &mdash; <span className="about-eyebrow-ar" lang="ar" dir="rtl">&#1604;&#1610;&#1576;&#1577;</span></span>
          <span className="about-rule" />
          <span className="about-eyebrow">2026</span>
        </div>
      </div>
      <div className="about-container">
        <div className="about-photo-wrap">
          <img src={laybaPhoto} alt="Layba" className="about-photo-placeholder" />
        </div>
        <div className="about-text">
          <h2>Profile</h2>
          <div className="about-desc">
            <p>I'm Layba, a full-stack developer who likes building things that are both functional and beautiful.</p>
            <p>On the frontend, I work with React, Angular, TypeScript, and Bootstrap; on the backend, Java, Spring Boot, Node.js, and Python. I'm also comfortable with C# and C++, with a strong OOP foundation that carries over to everything. I design RESTful APIs, work with PostgreSQL and MySQL, and lean on Git and Docker to keep projects organized and deployable.</p>
            <p>Tutoring taught me to break down hard problems and explain them clearly, which makes me a better developer. I care a lot about the user experience and getting the details right.</p>
            <p>I'm open to freelance work right now. Website, web app, or something custom, I'd love to help.</p>
            <p>Outside of coding, you'll find me with my cats, keeping up with fashion and beauty, or hunting for good Thai food, usually with a coffee or matcha in hand.</p>
          </div>
          <div className="about-meta">
            <span className="about-availability">Open to freelance opportunities</span>
            <span className="about-tag">full stack developer</span>
          </div>
        </div>
      </div>
    </section>
  )
}

const featured = {
  slug: 'layba-dev',
  img: laybadevPhoto,
  alt: 'layba.dev',
  title: 'layba.dev',
  status: 'this site',
  short: "The site you're on. React, Vite, and React Router, with every style hand-written in plain CSS instead of a component library.",
  desc: "The site you're on. React, Vite, and React Router, with every style hand-written in plain CSS instead of a component library. The hero blends two photos into one scene using masked blend modes, then layers a CRT grille, film grain, glitch lines, and a vignette for the cyberpunk look. Images are served as WebP, routes scroll back to the top, and a sparkle cursor trails the mouse.",
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
    short: 'A Y2K/vaporwave site for 3LI3LI, an independent singer, songwriter, and DJ.',
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
    short: 'A retro-pixel/Y2K site for independent author and artist Jasmine Plaskon.',
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
    title: 'Moonfade',
    status: 'launching soon',
    short: 'A pastel desktop-OS site for lighting virtual candles tied to goals and intentions.',
    desc: "A pastel desktop-OS site for lighting virtual candles tied to goals and intentions. Next.js, TypeScript, and CSS across the altar, history, and account pages, with a main candle at the new moon that lasts the whole cycle and phase candles that only light while their phase is out. Moon phase data comes from the U.S. Naval Observatory, with a local calculation as a backup when that is down, and Postgres on Supabase stores the candles so people can search, edit, and put out their own intentions.",
    tags: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Supabase', 'USNO API', 'JWT Auth', 'CSS Animation'],
    links: []
  },
  {
    slug: 'lunev',
    img: dospacePhoto,
    alt: 'lunev',
    title: 'lunev',
    short: 'A full-stack mental wellness and productivity app that pulls tasks, journaling, mood tracking, affirmations, and focus tools into one private space.',
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
    short: 'A music discovery app that builds playlists from a mood or a favorite artist.',
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
    title: 'Anime Search Terminal',
    short: 'A React and Vite app wired to the Jikan API for live MyAnimeList data.',
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
    title: 'Angular World Map',
    short: 'An interactive world map in Angular and TypeScript, pulling live country data from the World Bank API.',
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

function ProjectBadges({ project }) {
  if (!project.instagram && !project.status) return null
  return (
    <div className="project-badges">
      {project.instagram && (
        <a className="project-handle" href={project.instagram.href} target="_blank" rel="noreferrer">{project.instagram.label}</a>
      )}
      {project.status && (project.statusHref
        ? <a className="project-status" href={project.statusHref}>{project.status}</a>
        : <span className="project-status">{project.status}</span>
      )}
    </div>
  )
}

function FolderIcon() {
  return (
    <svg className="folder-icon" viewBox="0 0 32 26" aria-hidden="true">
      <path className="folder-back" d="M1 3h11l3 3h16v17H1z" />
      <path className="folder-front" d="M1 8h30v15H1z" />
    </svg>
  )
}

const folderRows = allProjects.reduce((rows, p, i) => {
  if (i % 2 === 0) rows.push([p])
  else rows[rows.length - 1].push(p)
  return rows
}, [])

function Projects() {
  const [openSlug, setOpenSlug] = useState(null)
  const active = allProjects.find(p => p.slug === openSlug)

  return (
    <section className="projects" id="projects">
      <div className="projects-header">
        <h2>Things I've built.</h2>
        <p className="projects-note">Personal projects and freelance client work.</p>
        <p className="projects-hint">click a folder to open it.</p>
      </div>

      <div className="folder-grid">
        {folderRows.map((row, r) => {
          const openHere = row.some(p => p.slug === openSlug)
          return (
            <div className="folder-row-wrap" key={`row-${r}`}>
              <div className="folder-row">
                {row.map((p, i) => (
                  <button
                    type="button"
                    key={p.slug}
                    className={`folder${openSlug === p.slug ? ' folder-open' : ''}`}
                    aria-expanded={openSlug === p.slug}
                    onClick={() => setOpenSlug(cur => (cur === p.slug ? null : p.slug))}
                  >
                    <FolderIcon />
                    <span className="folder-name">{p.title}</span>
                    {p.status
                      ? <span className="folder-status">{p.status}</span>
                      : <span className="folder-index">{String(r * 2 + i + 1).padStart(2, '0')}</span>}
                  </button>
                ))}
              </div>

              {openHere && active && (
                <div className="folder-window">
                  <div className="project-window-bar">
                    <span className="project-window-name">~/{active.slug}/</span>
                    <button
                      type="button"
                      className="folder-window-close"
                      onClick={() => setOpenSlug(null)}
                      aria-label="Close"
                    >
                      x
                    </button>
                  </div>
                  <div className="folder-window-body">
                    <Link to={`/projects/${active.slug}`} className="folder-window-media">
                      <img src={active.img} alt={active.alt} />
                    </Link>
                    <div className="folder-window-info">
                      <p className="project-title">{active.title}</p>
                      <ProjectBadges project={active} />
                      <p className="project-desc">{active.desc}</p>
                      <div className="project-tags">
                        {active.tags.map(tag => (
                          <span className="project-tag" key={tag}>{tag}</span>
                        ))}
                      </div>
                      <div className="project-links">
                        <Link to={`/projects/${active.slug}`} className="project-readmore">permalink</Link>
                        {active.links.map(l => (
                          <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="project-link">{l.label}</a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

    </section>
  )
}

function Blog() {
  return (
    <section className="blog" id="blog">
      <div className="projects-header">
        <h2>Things I've written.</h2>
      </div>
      <div className="blog-list">
        {posts.map((p, i) => (
          <article className="project-card blog-card" key={p.slug}>
            <div className="project-window-bar">
              <span className="project-window-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="project-window-name">~/blog/{p.slug}/</span>
            </div>
            <div className="blog-card-body">
              <Link to={`/blog/${p.slug}`} className="blog-cover">
                <img src={p.img} alt={p.alt} />
              </Link>
              <div className="project-info">
                <span className="blog-date">{p.date}</span>
                <p className="project-title">{p.title}</p>
                <p className="project-desc">{p.excerpt}</p>
              </div>
            </div>
            <div className="project-links">
              <Link to={`/blog/${p.slug}`} className="project-readmore">read more</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function BlogPost() {
  const { slug } = useParams()
  const post = posts.find(p => p.slug === slug)

  if (!post) {
    return (
      <section className="project-detail">
        <div className="project-detail-container">
          <Link to="/blog" className="project-back">&larr; back to blog</Link>
          <h2 className="project-detail-title">Post not found</h2>
          <p className="project-detail-desc">That post doesn't exist. Head back and pick another.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="project-detail blog-post">
      <div className="project-detail-container">
        <Link to="/blog" className="project-back">&larr; back to blog</Link>
        <div className="project-detail-body">
          <span className="blog-date">{post.date}</span>
          <h2 className="project-detail-title">{post.title}</h2>
          <div className="blog-post-cover">
            <img src={post.img} alt={post.alt} />
          </div>
          <div className="blog-body">
            {post.body.map((para, i) => (
              <p className="project-detail-desc" key={i}>{para}</p>
            ))}
          </div>
          <div className="blog-sources">
            <p className="blog-sources-title">Sources</p>
            <ul className="blog-sources-list">
              {post.sources.map(s => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectDetail() {
  const { slug } = useParams()
  const project = allProjects.find(p => p.slug === slug)

  if (!project) {
    return (
      <section className="project-detail">
        <div className="project-detail-container">
          <Link to="/projects" className="project-back">&larr; back to projects</Link>
          <h2 className="project-detail-title">Project not found</h2>
          <p className="project-detail-desc">That project doesn't exist. Head back and pick another.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="project-detail">
      <div className="project-detail-container">
        <Link to="/projects" className="project-back">&larr; back to projects</Link>
        <div className="project-detail-media">
          <img src={project.img} alt={project.alt} />
        </div>
        <div className="project-detail-body">
          <h2 className="project-detail-title">{project.title}</h2>
          <ProjectBadges project={project} />
          <p className="project-detail-desc">{project.desc}</p>
          <div className="project-tags">
            {project.tags.map(tag => (
              <span className="project-tag" key={tag}>{tag}</span>
            ))}
          </div>
          <div className="project-detail-links">
            {project.links.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="project-link">{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <h2>Let's connect.</h2>
        <p className="contact-sub">Have a project in mind or just want to say hi? Send a message.</p>
        <ContactForm />
        <div className="contact-links">
          <a href="mailto:hello@layba.dev" className="contact-link">hello@layba.dev</a>
          <a href="https://linkedin.com/in/laybas" target="_blank" rel="noreferrer" className="contact-link">linkedin</a>
          <a href="https://www.instagram.com/laybacoded" target="_blank" rel="noreferrer" className="contact-link">instagram</a>
          <a href="https://github.com/laybuh" target="_blank" rel="noreferrer" className="contact-link">github</a>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [score, setScore] = useState(0)

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
      <Nav score={score} />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer />
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
