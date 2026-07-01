import './App.css'
import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import ContactForm from './ContactForm'
import laybaPhoto from './assets/layba.webp'
import animePhoto from './assets/anime.webp'
import mapPhoto from './assets/map.webp'
import dospacePhoto from './assets/dospace.webp'
import hazefmPhoto from './assets/hazefm.webp'
import eliPhoto from './assets/3li3li.webp'
import michiferqueenPhoto from './assets/themichiferqueen.webp'
import laybadevPhoto from './assets/laybadev.webp'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function Sparkles() {
  const [sparkles, setSparkles] = useState([])

  useEffect(() => {
    let lastSpawn = 0
    const handleMouseMove = (e) => {
      const now = Date.now()
      if (now - lastSpawn < 50) return
      if (Math.random() > 0.6) return
      lastSpawn = now
      const sparkle = {
        id: Math.random(),
        x: e.clientX,
        y: e.clientY,
        symbol: ['✦', '✧', '⋆', '˚'][Math.floor(Math.random() * 4)]
      }
      setSparkles(prev => [...prev, sparkle])
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== sparkle.id))
      }, 600)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {sparkles.map(s => (
        <span key={s.id} className="sparkle" style={{ left: s.x, top: s.y }}>
          {s.symbol}
        </span>
      ))}
    </>
  )
}

function KofiButton() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  return (
    <a
      href="https://ko-fi.com/layba"
      target="_blank"
      rel="noreferrer"
      className={`kofi-float${isHome ? ' kofi-home' : ''}`}
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

function Nav() {
  return (
    <nav>
      <Link to="/" className="logo">layba.dev</Link>
      <ul>
        <li><Link to="/">index</Link></li>
        <li><Link to="/about">about</Link></li>
        <li><Link to="/projects">projects</Link></li>
        <li><Link to="/contact">contact</Link></li>
      </ul>
    </nav>
  )
}

function Home() {
  const navigate = useNavigate()
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-dark" aria-hidden="true" />
      <div className="hero-crt" aria-hidden="true" />
      <pre className="hero-code" aria-hidden="true">{`01001100 01100001 01111001 01100010 01100001
10110010 00101110 01100100 01100101 01110110
0110 1001 0010 1110 0100 1010 0101 1100 0011
11010010 01000110 10011010 00101101 01110011
0101 0110 1000 1110 0011 1101 0010 1010 0110
00110100 01011010 11100110 01001111 00001010
1001 1110 0100 0010 0111 1011 0010 1100 1000
01101000 01101001 00101100 00100000 01001001
0011 1010 0010 1011 0101 1100 1001 0010 0110
11110000 10101011 01001101 00101110 01111111
0100 1100 0110 0001 0111 1001 0110 0010 0001
10010100 00101110 11010010 01100101 01110110`}</pre>
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-content">
        <span className="hero-eyebrow"><span className="term-sign">$</span>cat intro.txt<span className="term-caret" /></span>
        <h1 className="glitch" data-text="Hi, I'm Layba.">Hi, I'm <span>Layba</span>.</h1>
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

function About() {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <div className="about-photo-wrap">
          <img src={laybaPhoto} alt="Layba" className="about-photo-placeholder" />
        </div>
        <div className="about-text">
          <h2>Profile</h2>
          <div className="about-desc">
            <p>I'm Layba, a full stack developer who likes building things that are both functional and beautiful.</p>
            <p>On the frontend I work with React, Angular, TypeScript, and Bootstrap; on the backend, Java, Spring Boot, Node.js, and Python. I'm also comfortable in C# and C++, with a strong OOP foundation that carries across everything. I design RESTful APIs, work with PostgreSQL and MySQL, and lean on Git and Docker to keep projects organized and deployable.</p>
            <p>Tutoring taught me to break down hard problems and explain them clearly, which makes me a better developer. I care a lot about the user experience and getting the details right.</p>
            <p>I'm open to freelance work right now. Website, web app, or something custom, I'd love to help.</p>
            <p>Outside of coding you'll find me with my cats, keeping up with fashion and beauty, or hunting for good Thai food, usually with a coffee or matcha in hand.</p>
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
  img: laybadevPhoto,
  alt: 'layba.dev',
  title: 'layba.dev',
  status: 'you are here',
  statusHref: 'https://layba.dev',
  desc: "The site you're on. React, Vite, and React Router, with every style hand-written in CSS and no UI framework. The hero blends two photos into one scene using masked blend modes, then layers a CRT grille, film grain, glitch lines, a vignette, and a slanted binary overlay for the cyberpunk look. Images are served as WebP, routes scroll back to the top, and a sparkle cursor trails the mouse.",
  tags: ['React', 'Vite', 'React Router', 'CSS'],
  links: [
    { href: 'https://github.com/laybuh/portfolio', label: 'github' },
  ]
}

const projects = [
  {
    img: eliPhoto,
    alt: '3LI3LI',
    title: '3LI3LI',
    instagram: { href: 'https://www.instagram.com/3li3lielieli', label: '@3li3lielieli' },
    desc: 'A Y2K/vaporwave site for independent music artist 3LI3LI. React, Vite, and CSS Modules across multiple routes, with an AIM-style intro window, a scrolling Y2K ticker bar, and a sparkle cursor. The music page runs a Spotify embed, ElfSight pulls in her latest TikTok and Instagram posts automatically, and fans can buy and download her EP through a Web3Forms and Cash App setup.',
    tags: ['React', 'Vite', 'CSS Modules', 'Elfsight', 'Spotify Embed', 'Web3Forms API'],
    links: [
      { href: 'https://3li3li.com', label: 'live' },
    ]
  },
  {
    img: michiferqueenPhoto,
    alt: 'themichiferqueen',
    title: 'themichiferqueen',
    status: 'Custom Build · Launching Soon',
    instagram: { href: 'https://instagram.com/themichiferqueen', label: '@themichiferqueen' },
    desc: 'A retro-pixel/Y2K site for independent author Jasmine Plaskon, built as a full handoff so she runs every page (stories, blog, gallery, lore, and shop) through Sanity without touching code. Next.js 16, React 19, TypeScript, and Tailwind CSS v4. The Stripe shop is locked down server-side so prices and checkout can\'t be tampered with, plus an SSR-safe 18+ age gate, an image and video gallery, a floating Spotify player, and a Web3Forms newsletter. She\'s filling it with her own stories and art ahead of launch.',
    tags: ['Next.js', 'React', 'TypeScript', 'Sanity CMS', 'Stripe API', 'Tailwind CSS', 'Spotify Embed', 'Web3Forms API'],
    links: [
      { href: 'https://aliveafterparadise.vercel.app/', label: 'view demo' },
    ]
  },
  {
    img: dospacePhoto,
    alt: 'lunev',
    title: 'lunev',
    desc: 'A full-stack mental wellness and productivity app that pulls tasks, journaling, mood tracking, affirmations, and focus tools into one private space. React, Vite, and Tailwind up front, with Node.js, Express, and PostgreSQL behind it. Everything a user writes is encrypted with AES-256-GCM before it reaches the database, so a leak would only expose unreadable ciphertext. Auth is hardened with JWT refresh-token rotation and reuse detection, bcrypt hashing, two-step email verification, rate limiting, CSRF checks, a strict Content-Security-Policy, and idle session timeout.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'JWT', '2FA', 'AES-256-GCM', 'bcrypt'],
    links: [
      { href: 'https://lunev.app', label: 'live' },
      { href: 'https://github.com/laybuh/todo-frontend', label: 'github (FE)' },
      { href: 'https://github.com/laybuh/todo-app', label: 'github (BE)' },
    ]
  },
  {
    img: hazefmPhoto,
    alt: 'haze.fm',
    title: 'haze.fm',
    desc: 'A music discovery app that builds playlists from a mood or a favorite artist. Next.js and TypeScript, with Last.fm mapping emotional tags to tracks and the YouTube Data API streaming full songs in-app. Custom mood-to-tag logic, real-time playlist generation, shuffle, skip, and regenerate controls, and cycling background scenes to set the tone.',
    tags: ['Next.js', 'TypeScript', 'Last.fm API', 'YouTube API', 'Tailwind CSS'],
    links: [
      { href: 'https://hazefm.vercel.app', label: 'live' },
      { href: 'https://github.com/laybuh/hazefm', label: 'github' },
    ]
  },
  {
    img: animePhoto,
    alt: 'Anime Search Terminal',
    title: 'Anime Search Terminal',
    desc: 'A React and Vite app wired to the Jikan API for live MyAnimeList data. Search by title, filter by type, genre, and minimum score, then sort by rating or name. Each result shows cover art, score, and a hover-to-reveal synopsis, with a light/dark toggle and a responsive dark neon interface.',
    tags: ['React', 'Vite', 'Jikan API'],
    links: [
      { href: 'https://animesearcher.vercel.app', label: 'live' },
      { href: 'https://github.com/laybuh/anime-search', label: 'github' },
    ]
  },
  {
    img: mapPhoto,
    alt: 'Angular World Map',
    title: 'Angular World Map',
    desc: 'An interactive world map in Angular and TypeScript, pulling live country data from the World Bank API. Click any country on the SVG map to see its name, capital, region, income level, and coordinates in a sidebar. Uses Angular routing, HttpClient, and event binding. Started as a university project, then extended and deployed on my own.',
    tags: ['Angular', 'TypeScript', 'World Bank API', 'SVG'],
    links: [
      { href: 'https://layba-map.vercel.app', label: 'live' },
      { href: 'https://github.com/laybuh/angular-map/', label: 'github' },
    ]
  },
]

function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="project-featured">
        <div className="project-featured-media">
          <img src={featured.img} alt={featured.alt} />
        </div>
        <div className="project-featured-body">
          <a className="project-status" href={featured.statusHref}>{featured.status}</a>
          <p className="project-featured-title">{featured.title}</p>
          <p className="project-desc">{featured.desc}</p>
          <div className="project-tags">
            {featured.tags.map(tag => (
              <span className="project-tag" key={tag}>{tag}</span>
            ))}
          </div>
          <div className="project-featured-links">
            {featured.links.map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="project-link">{l.label}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="projects-header">
        <h2>Things I've built.</h2>
      </div>
      <div className="projects-grid">
        {projects.map((p, i) => (
          <div className="project-card" key={p.title}>
            <div className="project-window-bar">
              <span className="project-window-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="project-window-name">~/{p.title.toLowerCase()}/</span>
            </div>
            <div className="project-img-wrap">
              <img src={p.img} alt={p.alt} />
            </div>
            <div className="project-info">
              <p className="project-title">{p.title}</p>
              {(p.instagram || p.status) && (
                <div className="project-badges">
                  {p.instagram && (
                    <a className="project-handle" href={p.instagram.href} target="_blank" rel="noreferrer">{p.instagram.label}</a>
                  )}
                  {p.status && (p.statusHref
                    ? <a className="project-status" href={p.statusHref}>{p.status}</a>
                    : <span className="project-status">{p.status}</span>
                  )}
                </div>
              )}
              <p className="project-desc">{p.desc}</p>
              <div className="project-tags">
                {p.tags.map(tag => (
                  <span className="project-tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="project-links">
              {p.links.map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="project-link">{l.label}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Credits() {
  return (
    <section className="credits" id="credits">
      <div className="credits-container">
        <h2>Credits</h2>
        <ul className="credits-list">
          <li>
            <a href="https://unsplash.com/photos/a-room-with-tables-and-chairs-hzBQyvjM59Y?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank" rel="noreferrer">Interior · Unsplash</a>
          </li>
          <li>
            <a href="https://unsplash.com/photos/people-walking-on-street-during-night-time-6-cvDnp9y7I?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank" rel="noreferrer">Ray ZHUANG · Unsplash</a>
          </li>
        </ul>
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
  return (
    <main>
      <ScrollToTop />
      <Sparkles />
      <KofiButton />
      <Nav />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/credits" element={<Credits />} />
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
      <Link to="/credits" className="footer-tag">
        <span className="footer-prompt">$</span>photo
      </Link>
    </footer>
  )
}

export default App
