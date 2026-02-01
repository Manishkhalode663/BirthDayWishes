import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Birthday from './pages/Birthday';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/birthday" element={<Birthday />} />
    </Routes>
  );
}

export default App;
