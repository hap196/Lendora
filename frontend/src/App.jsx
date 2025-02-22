import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NFTMarketplace from "./NFTMarketplace";
import Mint from "./Mint";
import Navbar from "./components/Navbar";
import Home from "./Home";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Used to trigger NFT refresh

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/marketplace"
          element={<NFTMarketplace refreshTrigger={refreshTrigger} />}
        />
        <Route path="/mint" element={<Mint />} />
      </Routes>
    </div>
  );
}

export default App;
