import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Editor from './components/Editor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Editor />} />
        <Route path='/document/:docId' element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;

