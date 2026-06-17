import './App.css'
import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import laybaPhoto from './assets/blah.png'
import animePhoto from './assets/anime.png'
import mapPhoto from './assets/map.png'
import dospacePhoto from './assets/dospace.png'
import hazefmPhoto from './assets/hazefm.png'
import eliPhoto from './assets/3li3li.png'

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
        symbol: ['✦', '✧', '⋆', '♡', '˚', '✿'][Math.floor(Math.random() * 6)]
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
  return (
    <a
      href="https://ko-fi.com/layba"
      target="_blank"
      rel="noreferrer"
      className="kofi-float"
    >
      <span className="kofi-text">BUY ME A COFFEE</span>
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
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-content">
        <span className="hero-eyebrow">visitor@layba:~$ whoami</span>
        <h1>Hi, I'm <span>Layba</span>.</h1>
        <p className="subtitle">I like building aesthetic digital experiences.</p>
        <div className="hero-buttons btn-visible">
          <button type="button" onClick={() => navigate('/projects')}>
            View My Work
          </button>
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
            <p>I'm Layba, a full stack developer who loves building things that are both functional and beautiful.</p>
            <p>I build web applications using React, Angular, TypeScript, and Bootstrap on the frontend, and Java, Spring Boot, Node.js, and Python on the backend. I'm also proficient in C# and C++, with a strong foundation in object-oriented programming that carries across everything I build. I design RESTful APIs, work with PostgreSQL and MySQL databases, and write clean, maintainable code that actually makes sense. My standard workflow includes Git, Docker, and the tools that keep projects organized and deployable.</p>
            <p>My background in technical tutoring taught me how to break down complex problems and communicate clearly, which makes me a better developer. I care deeply about the user experience and a detailed, intentional implementation.</p>
            <p>I'm currently open to freelance opportunities. Whether you need a website, a web app, or a custom solution, I'd love to work with you.</p>
            <p>When I'm not coding, you can find me spending time with my cats, keeping up with fashion and beauty, or searching for good Thai food. I'm always fueled by coffee or matcha.</p>
          </div>
          <div className="about-meta">
            <div className="about-availability">
              <span className="availability-dot" />
              Currently open to freelance opportunities
            </div>
            <span className="about-tag"># full stack developer</span>
          </div>
        </div>
      </div>
    </section>
  )
}

const projects = [
  {
    img: dospacePhoto,
    alt: 'lunev',
    title: 'lunev',
    desc: ' Built with React, Vite, Tailwind, Node.js, Express, and PostgreSQL, this full-stack mental wellness and productivity app brings tasks, journaling, mood tracking, affirmations, and focus tools into one private space. Every piece of user-written content is encrypted with AES-256-GCM before it reaches the database, so a leak would only expose unreadable ciphertext. Features JWT authentication with rotating refresh tokens and reuse detection, bcrypt hashing, email-based two-step verification, email verification with auto-expiry, password reset via domain-verified transactional email, password strength validation, rate limiting, CSRF origin checks, a strict Content-Security-Policy, idle session timeout with tab close detection, and password-confirmed account deletion.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'JWT', '2FA', 'AES-256-GCM', 'bcrypt'],
    links: [
      { href: 'https://lunev.app', label: 'live' },
      { href: 'https://github.com/laybuh/todo-frontend', label: 'github (FE)' },
      { href: 'https://github.com/laybuh/todo-app', label: 'github (BE)' },
    ]
  },
  {
    img: eliPhoto,
    alt: '3li3li',
    title: '3li3li',
    desc: 'A Y2K/vaporwave artist website built for independent music artist 3LI3LI. Built with React, Vite, and CSS Modules. Features a multi-page layout with React Router, an AIM-style intro window, scrolling Y2K ticker bar, ElfSight TikTok and Instagram embed for live updates, Spotify embed on the music page, custom sparkle cursor effects, and a fully responsive mobile design.',
    tags: ['React', 'Vite', 'CSS Modules', 'Elfsight', 'Spotify Embed', 'Web3Forms API'],
    links: [
      { href: 'https://3li3li.com', label: 'live' },
    ]
  },
  {
    img: hazefmPhoto,
    alt: 'haze.fm',
    title: 'haze.fm',
    desc: 'Built with Next.js and TypeScript, this music discovery app generates curated playlists based on your mood or a favorite artist. It connects to the Last.fm API to fetch tracks using emotional tag mapping and artist data, and uses the YouTube Data API to stream full songs directly in the app. Features a custom mood-to-tag mapping system, real-time playlist generation, shuffle, skip, and regenerate controls, and an immersive aesthetic visual experience with cycling background scenes.',
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
    desc: 'Built with React and Vite, this app connects to the Jikan API to search the MyAnimeList database using live data. Search by title and filter by type, genre, and minimum score, then sort results by rating or name. Each result shows cover art, score, and a hover-to-reveal synopsis, with a light/dark toggle and a responsive, dark neon interface.',
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
    desc: 'Built with Angular and TypeScript, this interactive world map connects to the World Bank API to fetch live country data. Click any country on the SVG map to display its name, capital city, region, income level, and coordinates in a sidebar panel. Built using Angular routing, HttpClient, component architecture, and event binding. Originally built for a university course, extended and deployed independently.',
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
      <div className="projects-header">
        <h2>Things I've built.</h2>
      </div>
      <div className="projects-grid">
        {projects.map((p) => (
          <div className="project-card" key={p.title}>
            <div className="project-img-wrap">
              <img src={p.img} alt={p.alt} />
            </div>
            <div className="project-info">
              <p className="project-title">{p.title}</p>
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

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <h2>Let's connect.</h2>
        <p className="contact-sub">Have a project in mind or just want to connect?</p>
        <p className="contact-sub">I'd love to hear from you.</p>
        <a href="mailto:hello@layba.dev" className="contact-email">hello@layba.dev</a>
        <div className="contact-links">
          <a href="https://linkedin.com/in/laybas" target="_blank" rel="noreferrer" className="contact-social">linkedin</a>
          <a href="https://www.instagram.com/laybacoded" target="_blank" rel="noreferrer" className="contact-social">instagram</a>
          <a href="https://github.com/laybuh" target="_blank" rel="noreferrer" className="contact-social">github</a>
        </div>
      </div>
    </section>
  )
}

function App() {
  return (
    <main>
      <Sparkles />
      <KofiButton />
      <Nav />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </main>
  )
}

export default App