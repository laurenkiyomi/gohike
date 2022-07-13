import * as React from "react"
import Logo from "./Logo"
import "./Navbar.css"
import axios from 'axios'
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'

export default function Navbar({ currUser, setCurrUser, transparent }) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
 
  return (
    <nav className={`navbar ${transparent ? "transparent" : ""}`}>
      <Logo className="nav-logo"/>
      <Link to="/"><button className="nav-button" onClick={() => {setDropdownOpen(false)}}>Home</button></Link>
      <Link to="/find-hikes"><button className="nav-button" onClick={() => {setDropdownOpen(false)}} >Find Hikes</button></Link>
      <Link to="/feed"><button className="nav-button" onClick={() => {setDropdownOpen(false)}} >Feed</button></Link>
      {currUser ? (
        <>
          <button 
            className="nav-button dropdown-button" 
            onClick={() => {
              if (dropdownOpen) {
                setDropdownOpen(false)
              } else {
                setDropdownOpen(true)
              }
          }}>{dropdownOpen ? 
            <span className="material-icons md-48">expand_less</span> : 
            <span className="material-icons md-48">expand_more</span>}</button>
          <div className="nav-button my-profile-button">{currUser.username}</div></>) : 
        <Link to="/login"><button className="nav-button login-button" >Log In</button></Link>}
      {dropdownOpen ? <Dropdown view="open" setCurrUser={setCurrUser} currUser={currUser} setDropdownOpen={setDropdownOpen} /> : <Dropdown view="closed" setCurrUser={setCurrUser} setDropdownOpen={setDropdownOpen} />}
    </nav>
  )
}

export function Dropdown({ view, setCurrUser, currUser, setDropdownOpen }) {
  const LOGOUT_URL = "http://localhost:3001/authorization/logout"
  const history = useNavigate()

  const handleLogout = async() => {
    axios.post(LOGOUT_URL, { sessionToken: currUser.sessionToken }).then((results) => {
      setCurrUser(null)
      localStorage.clear()
      setDropdownOpen(false)
      history('/')
    }).catch((err) => {
      console.log("Failed to logout")
    })
  }

  return (
    <div className={`dropdown ${view}`}>
      <button className="dropdown-item">SAVED</button>
      <button className="dropdown-item">COMPLETED</button>
      <button className="dropdown-item">PENDING FRIEND REQUESTS</button>
      <button className="dropdown-item logout-item" onClick={handleLogout}>LOG OUT</button>
    </div>
  )
}