import { useState, useRef } from 'react'
import './App.css'
import upsideImg from '../bg/upside.png'
import downImg from '../bg/down.png'
import audioFile from './audio.mp3'
function App() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [clickedButtons, setClickedButtons] = useState<Set<string>>(new Set())
  const [showDialog, setShowDialog] = useState(false)
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
    } else {
      alert("Uh oh- , the world ended, we hope you're happy. hmph. You should've paid attention to the episode.")
      setAccessCode('')
    }
  }

  return (
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
        <img src={downImg} alt="Down design" className="background-image" />
        
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
        <img src={upsideImg} alt="Upside design" className="background-image" />
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
  )
}

export default App
