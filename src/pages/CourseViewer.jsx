import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getLeccionById, getCursoById, getScrollProgress } from '../db'
import './CourseViewer.css'

const IFRAME_HEIGHT_PX = 12000

function CourseViewer() {
  const { courseId, leccionId } = useParams()
  const curso = getCursoById(courseId)
  const leccion = getLeccionById(leccionId)

  const videoDuration = leccion?.video_duration || 96
  const [isPlaying, setIsPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [scrollOffset, setScrollOffset] = useState(0)
  const timerRef = useRef(null)
  const slidesContainerRef = useRef(null)

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    stopTimer()
    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1
        if (next >= videoDuration) {
          clearInterval(timerRef.current)
          timerRef.current = null
          setIsPlaying(false)
          return videoDuration
        }
        return next
      })
    }, 1000)
  }, [stopTimer, videoDuration])

  // Scroll basado en el mapping de secciones
  useEffect(() => {
    if (!slidesContainerRef.current || !leccion) return
    const containerHeight = slidesContainerRef.current.clientHeight
    const totalScrollable = IFRAME_HEIGHT_PX - containerHeight
    const progress = getScrollProgress(leccion.id, elapsed)
    setScrollOffset(progress * totalScrollable)
  }, [elapsed, leccion])

  useEffect(() => {
    return () => stopTimer()
  }, [stopTimer])

  function handlePlayPause() {
    if (isPlaying) {
      stopTimer()
      setIsPlaying(false)
    } else {
      if (elapsed >= videoDuration) setElapsed(0)
      startTimer()
      setIsPlaying(true)
    }
  }

  function handleReset() {
    stopTimer()
    setIsPlaying(false)
    setElapsed(0)
    setScrollOffset(0)
  }

  function handleScrollManual(direction) {
    const containerHeight = slidesContainerRef.current?.clientHeight ?? 500
    const totalScrollable = IFRAME_HEIGHT_PX - containerHeight
    const step = totalScrollable * 0.1
    const newOffset = Math.max(0, Math.min(totalScrollable, scrollOffset + direction * step))
    setScrollOffset(newOffset)
    setElapsed(Math.round((newOffset / totalScrollable) * videoDuration))
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (!curso || !leccion) {
    return (
      <div className="viewer-not-found">
        <h2>Lección no encontrada</h2>
        <Link to="/cursos" className="back-link">← Volver a Cursos</Link>
      </div>
    )
  }

  const slidesUrl = `${leccion.slides_url}?mode=doc`
  const progressPercent = Math.min((elapsed / videoDuration) * 100, 100)
  const currentSection = Math.floor(getScrollProgress(leccion.id, elapsed) * leccion.slides_sections)

  return (
    <div className="course-viewer">
      <div className="viewer-header">
        <Link to={`/cursos/${courseId}`} className="back-link">← {curso.nombre}</Link>
        <h1 className="viewer-title">{leccion.nombre}</h1>
      </div>

      <div className="viewer-content">
        {/* Video Panel */}
        <div className="panel video-panel">
          <div className="panel-header">
            <span className="panel-label">📹 Video</span>
            <span className="panel-duration">{formatTime(videoDuration)}</span>
          </div>
          <div className="iframe-container">
            {!isPlaying && elapsed === 0 && (
              <button className="play-overlay" onClick={handlePlayPause}>
                <span className="play-overlay-icon">▶</span>
                <span className="play-overlay-text">Reproducir Lección</span>
              </button>
            )}
            <iframe
              src={leccion.video_url}
              title="Course Video"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Slides Panel */}
        <div className="panel slides-panel">
          <div className="panel-header">
            <span className="panel-label">📄 Presentación</span>
            <span className="slide-indicator">
              Sección {currentSection + 1} / {leccion.slides_sections}
            </span>
          </div>
          <div className="slides-scroll-container" ref={slidesContainerRef}>
            <iframe
              src={slidesUrl}
              title="Course Slides"
              allow="fullscreen"
              allowFullScreen
              style={{
                transform: `translateY(-${scrollOffset}px)`,
              }}
              className="slides-iframe"
            />
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="controls-left">
          <button
            className={`ctrl-btn ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlayPause}
            title={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="ctrl-btn" onClick={handleReset} title="Reiniciar">
            ⏹
          </button>
          <button
            className="ctrl-btn"
            onClick={() => handleScrollManual(-1)}
            title="Scroll arriba"
          >
            ▲
          </button>
          <button
            className="ctrl-btn"
            onClick={() => handleScrollManual(1)}
            title="Scroll abajo"
          >
            ▼
          </button>
        </div>

        <div className="controls-center">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="time-display">
            {formatTime(elapsed)} / {formatTime(videoDuration)} &middot; {Math.round(progressPercent)}%
          </span>
        </div>

        <div className="controls-right">
          <span className="section-display">
            📄 {currentSection + 1}/{leccion.slides_sections}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CourseViewer
