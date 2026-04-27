import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/:username" element={<Home />} />
        <Route path="/:username/booking" element={<Booking />} />
      </Routes>
    </Router>
  );
}

export default App;
