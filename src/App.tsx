import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/context/GameContext";
import Home from "@/pages/Home";
import Game from "@/pages/Game";
import ThankYou from "@/pages/ThankYou";
import Admin from "@/pages/Admin";

export default function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}
