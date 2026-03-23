import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <Link to="/cursos" className="navbar-brand">
        <span className="brand-icon">▶</span>
        <span className="brand-text">Learning Platform</span>
      </Link>
      <div className="navbar-links">
        <Link
          to="/cursos"
          className={`nav-link ${location.pathname.startsWith('/cursos') ? 'active' : ''}`}
        >
          Cursos
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
