import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Editor from './components/Editor'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="/document/:docId" element={<Editor />} />
      </Routes>
    </Router>
  )
}

export default App

