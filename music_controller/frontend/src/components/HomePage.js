import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoomJoin from "./RoomJoin";
import CreateRoom from "./CreateRoom";

function HomePage() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<p>Home page</p>} />
        <Route path="/join" element={<RoomJoin />} />
        <Route path="/create" element={<CreateRoom />} />
      </Routes>
    </Router>
  );
}

export default HomePage;
