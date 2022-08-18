import './App.css';
import WelcomePage from './pages/WelcomePage';
import BlackjackRoom from './pages/BlackjackRoom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<WelcomePage/>}/>
          <Route path="/blackjack" element={<BlackjackRoom/>}/>
      </Routes>
    </Router>
  );
}

export default App;
