import { cursos } from './cursos'
import { lecciones } from './lecciones'
import { slidesMapping } from './slidesMapping'

export { cursos, lecciones, slidesMapping }

// ── Queries ──

export function getCursoById(id) {
  return cursos.find((c) => c.id === id)
}

export function getLeccionesByCurso(cursoId) {
  return lecciones.filter((l) => l.curso_id === cursoId)
}

export function getLeccionById(leccionId) {
  return lecciones.find((l) => l.id === leccionId)
}

export function getMappingByLeccion(leccionId) {
  return slidesMapping
    .filter((m) => m.leccion_id === leccionId)
    .sort((a, b) => a.slide_index - b.slide_index)
}

/**
 * Dado el tiempo transcurrido, calcula el progreso de scroll (0..1)
 * interpolando entre las secciones mapeadas.
 */
export function getScrollProgress(leccionId, elapsedSec) {
  const mapping = getMappingByLeccion(leccionId)
  if (!mapping.length) return 0

  const leccion = getLeccionById(leccionId)
  const totalSections = leccion?.slides_sections || mapping.length
  const duration = leccion?.video_duration || 96

  // Clamp elapsed
  const t = Math.max(0, Math.min(elapsedSec, duration))

  // Find the two mapping entries we're between
  let prev = mapping[0]
  let next = mapping[mapping.length - 1]

  for (let i = 0; i < mapping.length - 1; i++) {
    if (t >= mapping[i].timestamp && t < mapping[i + 1].timestamp) {
      prev = mapping[i]
      next = mapping[i + 1]
      break
    }
  }

  // If we're past the last mapping entry
  if (t >= mapping[mapping.length - 1].timestamp) {
    prev = mapping[mapping.length - 1]
    // Interpolate from last section to end of document
    const timeSinceLast = t - prev.timestamp
    const timeRemaining = duration - prev.timestamp
    const fraction = timeRemaining > 0 ? timeSinceLast / timeRemaining : 1
    const progressStart = prev.slide_index / totalSections
    const progressEnd = 1
    return progressStart + fraction * (progressEnd - progressStart)
  }

  // Interpolate between prev and next
  const segmentTime = next.timestamp - prev.timestamp
  const fraction = segmentTime > 0 ? (t - prev.timestamp) / segmentTime : 0
  const progressStart = prev.slide_index / totalSections
  const progressEnd = next.slide_index / totalSections
  return progressStart + fraction * (progressEnd - progressStart)
}
