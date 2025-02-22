import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NFTMarketplace from "./NFTMarketplace";
import Navbar from "./components/Navbar";
import Home from "./Home";
import StarryBackground from "./components/StarryBackground";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Used to trigger NFT refresh

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/marketplace"
          element={<NFTMarketplace refreshTrigger={refreshTrigger} />}
        />
        <Route path="/profile" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
