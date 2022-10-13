import './App.css';
import React,{useState} from 'react';
import {BrowserRouter,Route,Routes,Link} from "react-router-dom";

import Game from "./Game";
import Start from "./Start";

import io from "socket.io-client";
const socket = io.connect("http://localhost:8000");


function App() {
  return (
      <div className="App">
        <BrowserRouter>
          <nav>
            <Link to="/">Home</Link>
            <br></br>
            <Link to="/game">Game</Link>
            <br></br>
            <Link to="/start">Lobbies</Link>
          </nav>

          <Routes>
            <Route path="/Game/:roomname" element={<Game socket={socket}/>}/>
            <Route path="/Start" element={<Start socket={socket}/>}/>
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
