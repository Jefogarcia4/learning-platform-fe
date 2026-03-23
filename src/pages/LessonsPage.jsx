import { useParams, Link } from 'react-router-dom'
import { getCursoById, getLeccionesByCurso } from '../db'
import './LessonsPage.css'

function LessonsPage() {
  const { courseId } = useParams()
  const curso = getCursoById(courseId)
  const leccionesDelCurso = getLeccionesByCurso(courseId)

  if (!curso) {
    return (
      <div className="lessons-not-found">
        <h2>Curso no encontrado</h2>
        <Link to="/cursos" className="back-link">← Volver a Cursos</Link>
      </div>
    )
  }

  function formatDuration(sec) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="lessons-page">
      <div className="lessons-header">
        <Link to="/cursos" className="back-link">← Cursos</Link>
        <h1>{curso.nombre}</h1>
        <p className="lessons-subtitle">{curso.descripcion}</p>
      </div>

      <div className="lessons-list">
        {leccionesDelCurso.map((leccion, idx) => (
          <Link
            to={`/cursos/${courseId}/lecciones/${leccion.id}`}
            key={leccion.id}
            className="lesson-card"
          >
            <div className="lesson-number">{idx + 1}</div>
            <div className="lesson-info">
              <h3 className="lesson-title">{leccion.nombre}</h3>
              <div className="lesson-meta">
                <span>⏱ {formatDuration(leccion.video_duration)}</span>
                <span>📄 {leccion.slides_sections} secciones</span>
              </div>
            </div>
            <div className="lesson-action">▶</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default LessonsPage
