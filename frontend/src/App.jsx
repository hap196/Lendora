import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NFTMarketplace from "./NFTMarketplace";
import Navbar from "./components/Navbar";
import Home from "./Home";
import StarryBackground from "./components/StarryBackground";
import Profile from "./Profile";
import AllWalletsProvider from "./wallets/AllWalletsProvider"; // ✅ default import

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <AllWalletsProvider>
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
    </AllWalletsProvider>
  );
}

export default App;
