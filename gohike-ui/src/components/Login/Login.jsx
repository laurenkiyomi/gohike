import * as React from "react"
import "./Login.css"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import logo from "../Images/Logo.png"

export default function Login({ currUser, setCurrUser, transparent, setTransparent }) {
    const LOGIN_URL = "http://localhost:3001/authorization/login"
    const GET_USER_URL = "http://localhost:3001/authorization/currUser"
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState("")
    const history = useNavigate()

    const userRef = React.useRef()
    const errorRef = React.useRef();

    React.useEffect(() => {
      userRef.current.focus();
      if (transparent) {
        setTransparent(false);
      }
    }, [])

    React.useEffect(() => {
      setError('')
    }, [username, password])

    const handleSubmit = async(event) => {
      event.preventDefault();

      axios.post(LOGIN_URL, {username, password}).then(async function(results) {
        let loginUser = await axios.get(GET_USER_URL)
        setCurrUser({ username: loginUser.data.currUser.username, firstName: loginUser.data.currUser.firstName, lastName: loginUser.data.currUser.lastName  })
        setUsername('')
        setPassword('')
        history('/')
      }).catch((err) => {
        setError("Invalid Username or Password")
        errorRef.current.focus()
      })
    }

    return (
      <nav className="login">
        <div className="login-section">
          <img className="login-logo"src={logo} />
          <h1 className="login-header">Log in to plan your next hiking adventure and connect with friends.</h1>
          {error ? <p ref={errorRef} className="login-error" aria-live="assertive">{error}</p> : ""}
          <form className="form" onSubmit={handleSubmit}>
              <input
                  className="username-input login-input" 
                  type="text"
                  id="username"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(event) => setUsername(event.target.value)}
                  value={username}
                  placeholder="Username"
                  required
              />

              <input
                  className="password-input login-input"
                  type="password"
                  id="password"
                  autoComplete="off"
                  onChange={(event) => setPassword(event.target.value)}
                  value={password}
                  placeholder="Password"
                  required
              />
              <button className="login-page-button">Log In</button>
          </form>
          <div className="need-account">
              <p>Need an account?</p>
              <Link to='/register'>Register Here</Link>
          </div>
        </div>
      </nav>
    )
  }