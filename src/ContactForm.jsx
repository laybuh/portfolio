import { useState } from 'react'

const ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY

function ContactForm() {
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    const formData = new FormData(e.target)
    formData.append('access_key', ACCESS_KEY)
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        e.target.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input type="checkbox" name="botcheck" className="contact-botcheck" tabIndex="-1" autoComplete="off" />
      <div className="contact-row">
        <label className="contact-field">
          <span className="contact-field-label">name</span>
          <input type="text" name="name" required autoComplete="name" />
        </label>
        <label className="contact-field">
          <span className="contact-field-label">email</span>
          <input type="email" name="email" required autoComplete="email" />
        </label>
      </div>
      <label className="contact-field">
        <span className="contact-field-label">subject</span>
        <input type="text" name="subject" required />
      </label>
      <label className="contact-field">
        <span className="contact-field-label">message</span>
        <textarea name="message" required rows={5}></textarea>
      </label>
      <button type="submit" className="contact-send" disabled={status === 'sending'}>
        {status === 'sending' ? 'sending…' : 'send message'}
      </button>
      {status === 'success' && (
        <p className="contact-status contact-status-ok">✓ Your message has been sent successfully.</p>
      )}
      {status === 'error' && (
        <p className="contact-status contact-status-err">✗ Your message could not be sent. Please try again.</p>
      )}
    </form>
  )
}

export default ContactForm
