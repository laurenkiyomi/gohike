import * as React from "react"
import Navbar from "../Navbar/Navbar"
import Home from "../Home/Home"
import FindHikes from "../FindHikes/FindHikes"
import "./App.css"
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "../Login/Login"
import Register from "../Register/Register"
import Feed from "../Feed/Feed"

export default function App() {
  const [currUser, setCurrUser] = React.useState(() => {
    if (localStorage.getItem("username") == null|| localStorage.getItem("sessionToken") == null || localStorage.getItem("username") == "" || localStorage.getItem("sessionToken") == "") {
      return null
    } else {
      return { username: localStorage.getItem("username"), sessionToken: localStorage.getItem("sessionToken") }
    }
  })
  const [transparent, setTransparent] = React.useState(true)

  return (
    <div className="app">
      <BrowserRouter>
        <main>
          {/*Always shows Navbar*/}
          <Navbar currUser={currUser} setCurrUser={setCurrUser} transparent={transparent} />
          {/*Routes*/}
          <Routes>
            <Route path="/" element={<Home transparent={transparent} setTransparent={setTransparent} />}/>
            <Route path="/find-hikes" element={<FindHikes transparent={transparent} setTransparent={setTransparent} currUser={currUser}/>}/>
            <Route path="/feed" element={<Feed transparent={transparent} setTransparent={setTransparent} currUser={currUser}/>}/>
            <Route path="/register" element={<Register currUser={currUser} setCurrUser={setCurrUser} transparent={transparent} setTransparent={setTransparent}/>} />
            <Route path="/login" element={<Login currUser={currUser} setCurrUser={setCurrUser} transparent={transparent} setTransparent={setTransparent}/>} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  )
}

