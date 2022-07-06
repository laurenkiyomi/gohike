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
  const [currUser, setCurrUser] = React.useState(null)
  const [transparent, setTransparent] = React.useState(true)

  React.useEffect(async () => {
    let loginUser = await axios.get("http://localhost:3001/authorization/currUser")

    if (loginUser.data.currUser) {
      setCurrUser({ username: loginUser.data.currUser.username, firstName: loginUser.data.currUser.firstName, lastName: loginUser.data.currUser.lastName  })
    }
  }, [])
  
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

