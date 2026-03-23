import { Link } from 'react-router-dom'
import { cursos } from '../db'
import './CoursesPage.css'

function CoursesPage() {
  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1>Cursos</h1>
        <p className="courses-subtitle">
          Explora nuestros cursos interactivos con video y presentaciones sincronizadas
        </p>
      </div>

      <div className="courses-grid">
        {cursos.map((curso) => (
          <Link to={`/cursos/${curso.id}`} key={curso.id} className="course-card">
            <div className="course-thumbnail">
              <span className="course-emoji">{curso.thumbnail}</span>
            </div>
            <div className="course-info">
              <h3 className="course-title">{curso.nombre}</h3>
              <p className="course-description">{curso.descripcion}</p>
            </div>
            <div className="course-action">
              <span className="play-btn">▶ Ver lecciones</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CoursesPage
