import './App.css'
import { useState, useEffect } from 'react'
import laybaPhoto from './assets/blah.jpg'
import animePhoto from './assets/anime.png'
import mapPhoto from './assets/map.png'
import dospacePhoto from './assets/dospace.png'

function Sparkles() {
  const [sparkles, setSparkles] = useState([])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (Math.random() > 0.6) return
      const sparkle = {
        id: Math.random(),
        x: e.clientX,
        y: e.clientY,
        symbol: ['✦', '✧', '⋆'][Math.floor(Math.random() * 3)]
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

function App() {
  return (
    <main>
      <Sparkles />
      <section className="hero">
        <nav>
          <a href="#" className="logo">layba.dev</a>
          <ul>
            <li><a href="#about">#about</a></li>
            <li><a href="#projects">#projects</a></li>
            <li><a href="#contact">#contact</a></li>
          </ul>
        </nav>

        <div className="hero-content">
          <p className="tag">&gt; index</p>
          <h1>Hi, I'm <span>Layba</span>.</h1>
          <p className="subtitle">Designing and developing for the web.</p>
          <button>View My Work</button>
        </div>
      </section>
      <section className="about" id="about">
        <div className="about-container">
          <div className="about-photo-wrap">
            <img src={laybaPhoto} alt="Layba" className="about-photo-placeholder" />
          </div>
          <div className="about-text">
            <a className="tag" href="#about">#about</a>
            <h2>Nice to meet you.</h2>
            <p>I'm Layba, a full stack developer who loves building things that are both functional and beautiful.</p>
            <p>I build web applications using React, Angular, TypeScript, and Bootstrap on the frontend, and Java, Spring Boot, Node.js, and Python on the backend. I design RESTful APIs, work with PostgreSQL and MySQL databases, and write clean, maintainable code that actually makes sense.</p>
            <p>My background in technical tutoring taught me how to break down complex problems and communicate clearly, which makes me a better developer. I approach every project methodically and don't stop until I find the right solution.</p>
            <p>I'm currently open to freelance opportunities. Whether you need a website, a web app, or a custom solution, I'd love to work with you.</p>
            <p>When I'm not coding, you can find me obsessing over my cats, keeping up with fashion and beauty, or finding new ways to bring creativity into everything I do.</p>
          </div>
        </div>
      </section>
      <section className="projects" id="projects">
        <div className="projects-header">
          <a className="tag" href="#projects">#projects</a>
          <h2>Things I've built.</h2>
        </div>

        <div className="projects-grid">

          <div className="project-card">
            <div className="project-img-wrap">
              <img src={animePhoto} alt="Anime Searcher" />
            </div>
            <div className="project-info">
              <p className="project-title">Anime Searcher</p>
              <p className="project-desc">Built with React and Vite, this app connects to the Jikan API to search
                the MyAnimeList database in real time. Users can look up any anime and
                see cover art, genres, scores, and descriptions. Styled with a custom
                vaporwave aesthetic.</p>
              <div className="project-tags">
                <span className="project-tag">React</span>
                <span className="project-tag">Vite</span>
                <span className="project-tag">Jikan API</span>
              </div>
            </div>
            <div className="project-links">
              <a href="https://animesearcher.vercel.app" target="_blank" rel="noreferrer" className="project-link">↗ live</a>
              <a href="https://github.com/laybuh/anime-search" target="_blank" rel="noreferrer" className="project-link">github</a>
            </div>
          </div>
          <div className="project-card">
            <div className="project-img-wrap">
              <img src={mapPhoto} alt="Angular World Map" />
            </div>
            <div className="project-info">
              <p className="project-title">Angular World Map</p>
              <p className="project-desc">Built with Angular and TypeScript, this interactive world map connects to the World Bank API to fetch live country data. Click any country on the SVG map to display its name, capital city, region, income level, and coordinates in a sidebar panel. Built using Angular routing, HttpClient, component architecture, and event binding. Originally built for a university course, extended and deployed independently.</p>
              <div className="project-tags">
                <span className="project-tag">Angular</span>
                <span className="project-tag">TypeScript</span>
                <span className="project-tag">World Bank API</span>
                <span className="project-tag">SVG</span>
              </div>
            </div>
            <div className="project-links">
              <a href="https://layba-map.vercel.app" target="_blank" rel="noreferrer" className="project-link">↗ live</a>
              <a href="https://github.com/laybuh/angular-map/" target="_blank" rel="noreferrer" className="project-link">github</a>
            </div>
          </div>
          <div className="project-card">
            <div className="project-img-wrap">
              <img src={dospacePhoto} alt="dospace" />
            </div>
            <div className="project-info">
              <p className="project-title">dospace</p>
              <p className="project-desc">Built with React, Vite, Node.js, and PostgreSQL, this full-stack encrypted to-do list manager secures every task with AES-256 encryption so not even the admin can read them. To-dos are stored in the database as unreadable ciphertext. Features JWT authentication, bcrypt hashing, email verification with auto-expiry, password reset via domain-verified transactional email, password strength validation, idle session timeout with tab close detection, account deletion with email confirmation, and cascade delete.</p>
              <div className="project-tags">
                <span className="project-tag">React</span>
                <span className="project-tag">Vite</span>
                <span className="project-tag">Node.js</span>
                <span className="project-tag">Express</span>
                <span className="project-tag">PostgreSQL</span>
                <span className="project-tag">JWT</span>
                <span className="project-tag">AES-256</span>
              </div>
            </div>
            <div className="project-links">
              <a href="https://dospace.vercel.app" target="_blank" rel="noreferrer" className="project-link">↗ live</a>
              <a href="https://github.com/laybuh/todo-frontend" target="_blank" rel="noreferrer" className="project-link">github (FE)</a>
              <a href="https://github.com/laybuh/todo-app" target="_blank" rel="noreferrer" className="project-link">github (BE)</a>

            </div>
          </div>

          {/* Will add new projects here later */}

        </div>
      </section>
      <div className="floating-links">
        <a href="https://github.com/laybuh" target="_blank" rel="noreferrer" className="bubble">
          <svg fill="rgba(255,255,255,0.4)" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
        </a>
        <a href="https://linkedin.com/in/laybas" target="_blank" rel="noreferrer" className="bubble">
          <svg fill="rgba(255,255,255,0.4)" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 8c0 .557-.447 1.008-1 1.008s-1-.45-1-1.008c0-.557.447-1.008 1-1.008s1 .452 1 1.008zm0 2h-2v6h2v-6zm3 0h-2v6h2v-2.861c0-1.722 2.002-1.881 2.002 0v2.861h1.998v-3.359c0-3.284-3.128-3.164-4-1.548v-1.093z" /></svg>
        </a>
      </div>
    </main>
  )
}

export default App