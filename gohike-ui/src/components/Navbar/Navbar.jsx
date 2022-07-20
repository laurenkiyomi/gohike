import * as React from "react"
import Logo from "./Logo"
import "./Navbar.css"
import axios from 'axios'
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'

export default function Navbar({ currUser, setCurrUser, transparent }) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [friendsOpen, setFriendsOpen] = React.useState(false)
 
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
                setFriendsOpen(false)
              } else {
                setDropdownOpen(true)
              }
          }}>{dropdownOpen ? 
            <span className="material-icons md-48">expand_less</span> : 
            <span className="material-icons md-48">expand_more</span>}</button>
          <div className="nav-button my-profile-button">{currUser.firstName} {currUser.lastName}</div>
          {dropdownOpen ? 
            <Dropdown view="open" setCurrUser={setCurrUser} currUser={currUser} setDropdownOpen={setDropdownOpen} friendsOpen={friendsOpen} setFriendsOpen={setFriendsOpen}/> : 
            <Dropdown view="closed" setCurrUser={setCurrUser} currUser={currUser} setDropdownOpen={setDropdownOpen} friendsOpen={friendsOpen} setFriendsOpen={setFriendsOpen}/>}
        </>) : 
        <Link to="/login"><button className="nav-button login-button" >Log In</button></Link>}
    </nav>
  )
}

export function Dropdown({ view, setCurrUser, currUser, setDropdownOpen, friendsOpen, setFriendsOpen }) {
  const LOGOUT_URL = "http://localhost:3001/authorization/logout"
  const history = useNavigate()

  const handleLogout = async() => {
    axios.post(LOGOUT_URL, { sessionToken: currUser.sessionToken }).then((results) => {
      setCurrUser(null)
      localStorage.clear()
      setDropdownOpen(false)
      setFriendsOpen(false)
      history('/')
    }).catch((err) => {
      console.log("Failed to logout")
    })
  }

  const handleProfile = () => {
    setDropdownOpen(false)
    setFriendsOpen(false)
    history('/my-profile')
  }

  const toggleFriends = () => {
    if (friendsOpen == true) {
      setFriendsOpen(false)
    } else {
      setFriendsOpen(true)
    }
  }

  return (
    <>
      <div className={`dropdown ${view}`}>
        <button className="dropdown-item" onClick={handleProfile}>MY PROFILE</button>
        <button className="dropdown-item" onClick={toggleFriends}>PENDING FRIEND REQUESTS</button>
        <button className="dropdown-item logout-item" onClick={handleLogout}>LOG OUT</button>
      </div>
      <FriendRequests friendsOpen={friendsOpen} currUser={currUser} />
    </>
  )
}

export function FriendRequests({ friendsOpen, currUser }) {
  const [friendRequests, setFriendRequests] = React.useState(null)
  React.useEffect(async () => {
    let data = await axios.get(`http://localhost:3001/user/${currUser.sessionToken}`)

    if (data.data.user.incomingFriendRequests == null || data.data.user.incomingFriendRequests == undefined || data.data.user.incomingFriendRequests.length ==0) {
      setFriendRequests([])
    } else {
      setFriendRequests(data.data.user.incomingFriendRequests)
    }
  }, [])

  if (friendRequests == null) {
    return null
  }

  return (
    <div className="friend-requests">
      {friendRequests.length == 0 ? 
        <div className={`no-friend-requests ${friendsOpen ? "" : "friends-closed"}`}>No pending friend requests</div> :
        friendRequests.map((username) => {
          return (
            <Request key={username} friendsOpen={friendsOpen} username={username} currUser={currUser} setFriendRequests={setFriendRequests} />
          )
        })}
    </div>
  )
}

export function Request({ friendsOpen, username, currUser, setFriendRequests }) {
  const DECLINE_FRIEND_URL = "http://localhost:3001/user/declineFriend"
  const ACCEPT_FRIEND_URL = "http://localhost:3001/user/acceptFriend"

  const acceptFriend = async() => {
        try {
            await axios.put(ACCEPT_FRIEND_URL, { sessionToken: currUser.sessionToken, username })

            // Reset friend requests
            let data = await axios.get(`http://localhost:3001/user/${currUser.sessionToken}`)
            if (data.data.user.incomingFriendRequests == null || data.data.user.incomingFriendRequests == undefined || data.data.user.incomingFriendRequests.length ==0) {
              setFriendRequests([])
            } else {
              setFriendRequests(data.data.user.incomingFriendRequests)
            }
        } catch {
            console.log("Failed to accept friend")
        }
  }

  const declineFriend = async() => {
      try {
          await axios.put(DECLINE_FRIEND_URL, { sessionToken: currUser.sessionToken, username })

          // Reset friend requests
          let data = await axios.get(`http://localhost:3001/user/${currUser.sessionToken}`)
          if (data.data.user.incomingFriendRequests == null || data.data.user.incomingFriendRequests == undefined || data.data.user.incomingFriendRequests.length ==0) {
            setFriendRequests([])
          } else {
            setFriendRequests(data.data.user.incomingFriendRequests)
          }
      } catch {
          console.log("Failed to decline friend")
      }
  }

  return (
    <div className={`request ${friendsOpen ? "" : "friends-closed"}`}>
      <p className="request-username request-item">{username.toUpperCase()}</p>
      <div className="request-buttons request-item">
        <button className="accept-button request-item" onClick={acceptFriend}>✓</button>
        <button className="decline-button request-item" onClick={declineFriend}>x</button>
      </div>
    </div>
  )
}