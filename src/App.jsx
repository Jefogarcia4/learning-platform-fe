import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import CoursesPage from './pages/CoursesPage'
import LessonsPage from './pages/LessonsPage'
import CourseViewer from './pages/CourseViewer'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/cursos" replace />} />
          <Route path="/cursos" element={<CoursesPage />} />
          <Route path="/cursos/:courseId" element={<LessonsPage />} />
          <Route path="/cursos/:courseId/lecciones/:leccionId" element={<CourseViewer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
