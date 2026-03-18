import './App.css'
import { useState, useEffect } from 'react'
import laybaPhoto from './assets/blah.jpg'
import animePhoto from './assets/anime.png'
import mapPhoto from './assets/map.png'
import dospacePhoto from './assets/dospace.png'
import hazefmPhoto from './assets/hazefm.png'

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
            <li><a href="#">index</a></li>
            <li><a href="#about">about</a></li>
            <li><a href="#projects">projects</a></li>
            <li><a href="#contact">contact</a></li>
          </ul>
        </nav>

        <div className="hero-content">
          <p className="tag">&gt; index</p>
          <h1>Hi, I'm <span>Layba</span>.</h1>
          <p className="subtitle">Turning ideas into beautiful, functional web experiences.</p>
          <div className="hero-buttons">
            <button
              type="button"
              onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work
            </button>

          </div>
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
            <p>I build web applications using React, Angular, TypeScript, and Bootstrap on the frontend, and Java, Spring Boot, Node.js, and Python on the backend. I'm also proficient in C# and C++, with a strong foundation in object-oriented programming that carries across everything I build. I design RESTful APIs, work with PostgreSQL and MySQL databases, and write clean, maintainable code that actually makes sense. My standard workflow includes Git, Docker, and the tools that keep projects organized and deployable.</p>
            <p>My background in technical tutoring taught me how to break down complex problems and communicate clearly, which makes me a better developer. I care deeply about the user experience and a detailed, intentional implementation.</p>
            <p>I'm currently open to freelance opportunities. Whether you need a website, a web app, or a custom solution, I'd love to work with you.</p>
            <p>When I'm not coding, you can find me spending time with my cats, keeping up with fashion and beauty, or searching for good Thai food. I'm always fueled by coffee and matcha.</p></div>
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
          <div className="project-card">
            <div className="project-img-wrap">
              <img src={hazefmPhoto} alt="haze.fm" />
            </div>
            <div className="project-info">
              <p className="project-title">haze.fm</p>
              <p className="project-desc">Built with Next.js and TypeScript, this music discovery app generates curated playlists based on your mood or a favorite artist. It connects to the Last.fm API to fetch tracks using emotional tag mapping and artist data, and uses the YouTube Data API to stream full songs directly in the app. Features a custom mood-to-tag mapping system, real-time playlist generation, shuffle, skip, and regenerate controls, and an immersive aesthetic visual experience with cycling background scenes.</p>
              <div className="project-tags">
                <span className="project-tag">Next.js</span>
                <span className="project-tag">TypeScript</span>
                <span className="project-tag">Last.fm API</span>
                <span className="project-tag">YouTube API</span>
                <span className="project-tag">Tailwind CSS</span>
              </div>
            </div>
            <div className="project-links">
              <a href="https://hazefm.vercel.app" target="_blank" rel="noreferrer" className="project-link">↗ live</a>
              <a href="https://github.com/laybuh/hazefm" target="_blank" rel="noreferrer" className="project-link">github</a>


            </div>
          </div>
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
          {/* Will add new projects here later */}

        </div>
      </section>
      <section className="contact" id="contact">
        <div className="contact-container">
          <a className="tag" href="#contact">#contact</a>
          <h2>Let's connect.</h2>
          <p className="contact-sub">Have a project in mind or just want to connect?</p>
          <p className="contact-sub">I'd love to hear from you.</p>
          <a href="mailto:hello@layba.dev" className="contact-email">hello@layba.dev</a>
          <div className="contact-links">
            <a href="https://linkedin.com/in/laybas" target="_blank" rel="noreferrer" className="contact-social">linkedin</a>
            <a href="https://github.com/laybuh" target="_blank" rel="noreferrer" className="contact-social">github</a>
          </div>
        </div>
      </section>
    </main>

  )
}

export default App