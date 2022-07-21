/**
 * @fileoverview This file implements the App component for the GoHike App.
 */
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
import MyProfile from "../MyProfile/MyProfile"
import ViewProfile from "../ViewProfile/ViewProfile"

/**
 * Holds the BrowserRoutes for all pages of the GoHike app and always 
 * renders the Navbar component
 * 
 * @returns App component
 */
export default function App() {
  /**
   * Holds information on current user from local storage
   * @type {{username: string, sessionToken: string, firstName: string, 
   * lastName: string}}
   */
  const [currUser, setCurrUser] = React.useState(() => {
    if (localStorage.getItem("username") == null || localStorage.getItem(
      "sessionToken") == null || localStorage.getItem("firstName") == null || 
      localStorage.getItem("lastName") == null) {
      return null
    } else {
      return { username: localStorage.getItem("username"), 
        sessionToken: localStorage.getItem("sessionToken"), 
        firstName: localStorage.getItem("firstName"), 
        lastName: localStorage.getItem("lastName") }
    }
  })
  /**
   * Holds the state of the Navbar background color
   * @type {boolean}
   */
  const [transparent, setTransparent] = React.useState(true)

  // Return React component
  return (
    <div className="app">
      <BrowserRouter>
        <main>
          {/*Always shows Navbar*/}
          <Navbar 
            currUser={currUser} 
            setCurrUser={setCurrUser} 
            transparent={transparent} />
          {/*Routes*/}
          <Routes>
            <Route 
              path="/" 
              element={<Home 
                transparent={transparent} 
                setTransparent={setTransparent} />}/>
            <Route 
              path="/find-hikes" 
              element={<FindHikes 
                transparent={transparent} 
                setTransparent={setTransparent} 
                currUser={currUser}/>}/>
            <Route 
              path="/find-hikes/:id" 
              element={<FindHikes 
                transparent={transparent} 
                setTransparent={setTransparent} 
                currUser={currUser}/>}/>
            <Route 
              path="/feed" 
              element={<Feed 
                transparent={transparent} 
                setTransparent={setTransparent} 
                currUser={currUser}/>}/>
            <Route 
              path="/register" 
              element={<Register 
                currUser={currUser} 
                setCurrUser={setCurrUser} 
                transparent={transparent} 
                setTransparent={setTransparent}/>} />
            <Route 
              path="/login" 
              element={<Login 
                currUser={currUser} 
                setCurrUser={setCurrUser} 
                transparent={transparent} 
                setTransparent={setTransparent}/>} />
            <Route 
              path="/my-profile" 
              element={<MyProfile 
                currUser={currUser} 
                setCurrUser={setCurrUser} 
                transparent={transparent} 
                setTransparent={setTransparent} />} />
            <Route 
              path="/view-profile/:username" 
              element={<ViewProfile 
                currUser={currUser} 
                setCurrUser={setCurrUser} 
                transparent={transparent} 
                setTransparent={setTransparent} />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  )
}

