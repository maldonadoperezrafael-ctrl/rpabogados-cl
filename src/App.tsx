import { Routes, Route } from 'react-router'
import RouteEffects from '@/components/RouteEffects'
import ActualidadPage from './pages/ActualidadPage'
import AnalysisArticlePage from './pages/AnalysisArticlePage'
import AnalysisIndexPage from './pages/AnalysisIndexPage'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import PracticeAreaPage from './pages/PracticeAreaPage'
import PrivacyPage from './pages/PrivacyPage'
import './App.css'
import './pages/InnerPages.css'

export default function App() {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/areas/:slug" element={<PracticeAreaPage />} />
        <Route path="/actualidad" element={<ActualidadPage />} />
        <Route path="/actualidad/analisis" element={<AnalysisIndexPage />} />
        <Route path="/actualidad/analisis/:slug" element={<AnalysisArticlePage />} />
        <Route path="/privacidad" element={<PrivacyPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
