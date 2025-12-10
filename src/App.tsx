import { useState, useRef, useEffect } from 'react'
import './App.css'
import upsideImg from '../bg/upside.png'
import downImg from '../bg/down.png'
import upsideMobileImg from '../bg/upside mobile.png'
import downMobileImg from '../bg/down mobile.png'
import audioFile from './audio.mp3'
import { Analytics } from '@vercel/analytics/react'
function App() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [clickedButtons, setClickedButtons] = useState<Set<string>>(new Set())
  const [showDialog, setShowDialog] = useState(false)
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const faqs = [
    {
      question: "What is the hackathon theme?",
      answer: "The theme is based on Stranger Things - create something that would help you survive in the upside down world."
    },
    {
      question: "How long is the hackathon?",
      answer: "The hackathon runs for 12 hours, giving you plenty of time to build something amazing."
    },
    {
      question: "Can I participate solo or do I need a team?",
      answer: "You can participate only in teams of 4 members. While registering make sure every member registers individually and put the same team name. Those who do not have a team of 4, will be paired during the event."
    },
    {
      question: "How to register for the Upside Down Hacknight?",
      answer: `1. Registrations are individual — everyone on your team has to sign up.
2. Fill in your basic details.
3. Add your team name.
4. Drop your team lead's email.
5. Fill in the rest of the form and hit submit. And voila, you're officially part of the event.
See you in the Upside Down.`
    },
    {
      question: "What are the prizes?",
      answer: "Winners will receive Netflix Subscriptions, swags, and coffee to help you get through the Demogorgons! "
    },
    {
      question: "Do I need prior experience?",
      answer: "No! This hackathon welcomes everyone from beginners to experts. We have mentors to help you along the way."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleButtonClick = (buttonName: string) => {
    const newClickedButtons = new Set(clickedButtons)
    newClickedButtons.add(buttonName)
    setClickedButtons(newClickedButtons)

    // Check if both buttons have been clicked
    if (newClickedButtons.size === 2) {
      // Show dialog
      setShowDialog(true)
      
      // Play audio
      if (!audioRef.current) {
        audioRef.current = new Audio(audioFile)
        audioRef.current.addEventListener('ended', () => {
          setShowCodeInput(true)
        })
      }
      audioRef.current.play().catch(err => console.log('Audio play failed:', err))
    }
  }

  const closeDialog = () => {
    // Stop audio if it's playing
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setShowDialog(false)
    setShowCodeInput(false)
    setAccessCode('')
    setClickedButtons(new Set())
  }

  const handleCodeSubmit = () => {
    if (accessCode === '6.62607004') {
      alert('Congratulations! You just saved the worlddd')
      closeDialog()
    }
    else {
      alert("Uh oh- , the world ended, we hope you're happy. hmph. You should've paid attention to the episode.")
      setAccessCode('')
    }
  }

  return (
    <>
    <div 
      className="slider-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Bottom image (down) - always visible */}
      <div className="image-wrapper">
        <img src={isMobile ? downMobileImg : downImg} alt="Down design" className="background-image" />
        
        {/* Bottom buttons */}
        <div className="bottom-buttons">
          <button 
            className="image-button left-button"
            onClick={() => handleButtonClick('upside')}
          >
            Upside
          </button>
          <button 
            className="image-button right-button"
            onClick={() => handleButtonClick('down')}
          >
            Down
          </button>
        </div>

        {/* Register Button */}
        <div className="register-button-container">
          <a href="https://events.mlh.io/events/13447-upside-down-hacknight-make-a-ton-8-0?_gl=1*72t3br*_ga*MTkyMTAyODI4OS4xNzUwMjc1Mzk5*_ga_E5KT6TC4TK*czE3NjUyNjI2ODAkbzkkZzEkdDE3NjUyNjQxNjMkajU5JGwwJGgw" target="_blank" rel="noopener noreferrer" className="register-button">
            Register Now
          </a>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2 className="faq-title"></h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button 
                  className={`faq-question ${openFAQ === index ? 'active' : ''}`}
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">{openFAQ === index ? '−' : '+'}</span>
                </button>
                {openFAQ === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="social-media-container">
          <a href="https://instagram.com/makeaton.cusat" target="_blank" rel="noopener noreferrer" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://whatsapp.com/channel/0029ValGCQM60eBjNF5wS10C" target="_blank" rel="noopener noreferrer" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
          <a href="https://t.me/makeaton7" target="_blank" rel="noopener noreferrer" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </a>
          <a href="mailto:organizer@makeaton.in" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
        </a>
          <a href="https://linkedin.com/company/makeaton" target="_blank" rel="noopener noreferrer" className="social-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Easter Egg Dialog */}
      {showDialog && (
        <div className="dialog-overlay" onClick={closeDialog}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            {!showCodeInput ? (
              <>
                <h2>Congratulations!</h2>
                <p>You have found an easter egg. Wait.</p>
              </>
            ) : (
              <>
                <h2>Enter Access Code</h2>
                <p>Put the access code (psst. it's a constant)</p>
                <input 
                  type="text"
                  className="code-input"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
                  placeholder="type here..."
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
                <div className="dialog-buttons">
                  <button className="dialog-close-btn" onClick={handleCodeSubmit}>Submit</button>
                  <button className="dialog-close-btn secondary" onClick={closeDialog}>Cancel</button>
                </div>
              </>
            )}
            {!showCodeInput && (
              <button className="dialog-close-btn" onClick={closeDialog}>Close</button>
            )}
          </div>
        </div>
      )}

      {/* Top image (upside) - clipped based on slider position */}
      <div 
        className="image-wrapper top-image"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={isMobile ? upsideMobileImg : upsideImg} alt="Upside design" className="background-image" />
      </div>

      {/* Slider handle */}
      <div 
        className="slider-handle"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="slider-line" />
        <div className="slider-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 19l7-7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

    </div>
    <Analytics />
    </>
  )
}

export default App
