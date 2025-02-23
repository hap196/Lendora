import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NFTMarketplace from "./NFTMarketplace";
import Navbar from "./components/Navbar";
import Home from "./Home";
import StarryBackground from "./components/StarryBackground";
import Profile from "./Profile";

function App() {
  // used to trigger NFT refresh after minting a new NFT
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
