import * as React from "react"
import "./Register.css"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import logo from "../Images/Logo.png"

export default function Register({ currUser, setCurrUser, transparent, setTransparent }) {
      const REGISTER_URL = "http://localhost:3001/authorization/register"
      const GET_USER_URL = "http://localhost:3001/authorization/currUser"
      const [username, setUsername] = React.useState('')
      const [password, setPassword] = React.useState('')
      const [firstName, setFirstName] = React.useState('')
      const [lastName, setLastName] = React.useState('')
      const [age, setAge] = React.useState(0)
      const [email, setEmail] = React.useState('')
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
  
        axios.post(REGISTER_URL, { firstName, lastName, age: parseInt(age), username, password, email }).then(async function(results) {
          let registerUser = await axios.get(GET_USER_URL)
          setCurrUser({ username: registerUser.data.currUser.username, firstName: registerUser.data.currUser.firstName, lastName: registerUser.data.currUser.lastName  })
          setFirstName('')
          setLastName('')
          setAge(0)
          setUsername('')
          setPassword('')
          setEmail('')

          history('/')
        }).catch((err) => {
          setError("Failed to Register")
          errorRef.current.focus()
        })
      }
  
      return (
        <nav className="register">
          <div className="register-section-one">
            <img className="register-logo"src={logo} />
            <h1 className="register-header">Make an account to plan your next hiking adventure and connect with friends.</h1>
            <form onSubmit={() => {}} className="form-one">
              <div className="name-input">
                <input 
                      type="text"
                      className="first-name-input register-input"
                      id="firstName"
                      ref={userRef}
                      autoComplete="off"
                      onChange={(event) => setFirstName(event.target.value)}
                      value={firstName}
                      placeholder="First Name"
                      required
                  />
                <input 
                      type="text"
                      className="last-name-input register-input"
                      id="lastName"
                      autoComplete="off"
                      onChange={(event) => setLastName(event.target.value)}
                      value={lastName}
                      placeholder="Last Name"
                      required
                  />
              </div>
              <input 
                    type="number"
                    className="age-input register-input"
                    id="age"
                    autoComplete="off"
                    onChange={(event) => setAge(event.target.value)}
                    value={age}
                    placeholder="Age"
                    required
                />
              <button className="next-button">Next</button>
            </form>
            <div className="have-account">
                <p>Already have an account?</p>
                <Link to='/login'>Log In</Link>
            </div>
          </div>
          <div className="register-section-two part-two">
              <img className="register-logo"src={logo} />
              <h1 className="register-header">Make an account to plan your next hiking adventure and connect with friends.</h1>
              {error ? <p ref={errorRef} className="register-error" aria-live="assertive">{error}</p> : ""}
              <form onSubmit={handleSubmit} className="form-two">
                <input 
                    type="email"
                    className="register-input email-input"
                    id="email"
                    autoComplete="off"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email"
                    value={email}
                    required
                />
                <input 
                    type="text"
                    className="register-input register-username-input"
                    id="username"
                    autoComplete="off"
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Username"
                    value={username}
                    required
                />
                <input
                    type="password"
                    className="register-input register-password-input"
                    id="password"
                    autoComplete="off"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    value={password}
                    required
                />
                <button className="register-button">Register</button>
            </form>
            <div className="have-account">
                <p>Already have an account?</p>
                <Link to='/login'>Log In</Link>
            </div>
          </div>
        </nav>
      )
  }