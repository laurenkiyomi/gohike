/**
 * @fileoverview This file implements the Register Page so that users can 
 * create an account for the GoHike app.
 */
import * as React from "react"
import "./Register.css"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import logo from "../Images/Logo.png"

/**
 * Allows users to create an account
 * 
 * @param {function} setCurrUser Called on successful registration
 * @param {boolean} transparent Holds state of Navbar visibility
 * @param {function} setTransparent
 * @returns Register component
 */
export default function Register({ setCurrUser, transparent, setTransparent }) {
      /**
       * State variable holding username input
       * @type {string}
       */
      const [username, setUsername] = React.useState('')
      /**
       * State variable holding password input
       * @type {string}
       */
      const [password, setPassword] = React.useState('')
      /**
       * State variable holding first name input
       * @type {string}
       */
      const [firstName, setFirstName] = React.useState('')
      /**
       * State variable holding last name input
       * @type {string}
       */
      const [lastName, setLastName] = React.useState('')
      /**
       * State variable holding age input
       * @type {number}
       */
      const [age, setAge] = React.useState(0)
      /**
       * State variable holding email input
       * @type {string}
       */
      const [email, setEmail] = React.useState('')
      /**
       * State variable holding error message
       * @type {string}
       */
      const [error, setError] = React.useState("")
      /**
       * State variable holding whether or not user is on first part of form
       * @type {boolean}
       */
      const [partOne, setPartOne] = React.useState(true)
      /**
       * Navigation tool
       * @type {hook}
       */
      const history = useNavigate()
      
      /**
       * Set transparency on every render
       */
      React.useEffect(() => {
        if (transparent) {
          setTransparent(false);
        }
      }, [])
  
      /**
       * Reset error message whenver username or password changes
       */
      React.useEffect(() => {
        setError('')
      }, [username, password])
  
      // Return React component
      return (
        <nav className="register">
          {partOne ? 
            <RegisterPartOne 
              firstName={firstName} 
              setFirstName={setFirstName} 
              lastName={lastName} 
              setLastName={setLastName} 
              age={age} setAge={setAge} 
              setPartOne={setPartOne} /> : 
            <RegisterPartTwo 
              username={username} 
              setUsername={setUsername} 
              password={password} 
              setPassword={setPassword} 
              firstName={firstName} 
              setFirstName={setFirstName} 
              lastName={lastName} 
              setLastName={setLastName} 
              age={age} setAge={setAge} 
              email={email}setEmail={setEmail} 
              error={error} setError={setError} 
              setPartOne={setPartOne} 
              history={history} 
              setCurrUser={setCurrUser}/>}
        </nav>
      )
  }

  /**
   * First part of registration form
   * 
   * @param {string} firstName
   * @param {function} setFirstName
   * @param {string} lastName
   * @param {function} setLastName
   * @param {number} age
   * @param {function} setAge
   * @param {function} setPartOne
   * @returns Register Part One component
   */
  export function RegisterPartOne({ firstName, setFirstName, lastName, 
    setLastName, age, setAge, setPartOne }) {
    /**
     * First name input reference
     */
    const nameRef = React.useRef()

    /**
     * Set focut on name input on every render
     */
    React.useEffect(() => {
      nameRef.current.focus();
    }, [])

    /**
     * OnClick handler of next button
     */
    const handleNext = () => {
      setPartOne(false)
    }

    // Return React component
    return (
      <div className="register-section-one">
            <img className="register-logo"src={logo} />
            <h1 className="register-header">
              Make an account to plan your next hiking adventure and connect 
              with friends.
            </h1>
            <form className="form-one">
              <div className="name-input">
                <input 
                      type="text"
                      className="first-name-input register-input"
                      id="firstName"
                      ref={nameRef}
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
            </form>
            <button className="next-button" onClick={handleNext}>Next</button>
            <div className="have-account">
                <p>Already have an account?</p>
                <Link to='/login'>Log In</Link>
            </div>
          </div>
    )
  }

  /**
   * Second part of registration form
   * 
   * @param {string} username 
   * @param {function} setUsername
   * @param {string} password
   * @param {function} setPassword
   * @param {string} firstName
   * @param {function} setFirstName
   * @param {string} lastName
   * @param {function} setLastName
   * @param {number} age
   * @param {function} setAge
   * @param {string} email
   * @param {function} setEmail
   * @param {string} error
   * @param {function} setError
   * @param {function} setPartOne Called on click of back button
   * @param {hook} history Navigation tool 
   * @param {function} setCurrUser Called on successful registration 
   * @returns Register Part Two component
   */
  export function RegisterPartTwo({ username, setUsername, password, 
    setPassword, firstName, setFirstName, lastName, setLastName, age, setAge, 
    email, setEmail, error, setError, setPartOne, history, setCurrUser }) {
    /**
     * URL for making post request to create new user
     */
    const REGISTER_URL = "http://localhost:3001/authorization/register"
    /**
     * Reference to email input
     * @type {hook}
     */
    const emailRef = React.useRef()
    /**
     * Reference to error message
     * @type {hook}
     */
    const errorRef = React.useRef();

    /**
     * Set focus on email input on every render
     */
    React.useEffect(() => {
      emailRef.current.focus();
    }, [])

    /**
     * OnClick handler of back button
     */
    const handleBack = () => {
      setPartOne(true)
    }

    /**
     * OnClick handler of form submission
     * @param {event} event 
     */
    const handleSubmit = async(event) => {
      event.preventDefault();

      // Post request to create new user
      axios.post(REGISTER_URL, { firstName, lastName, age: parseInt(age), 
        username, password, email }).then(function(registerUser) { 
        setCurrUser({ username: registerUser.data.username, 
          sessionToken: registerUser.data.sessionToken, 
          firstName: registerUser.data.firstName, 
          lastName: registerUser.data.lastName })
        // Set local storage to hold necessary info on current user
        localStorage.setItem("username", registerUser.data.username)
        localStorage.setItem("sessionToken", registerUser.data.sessionToken)
        localStorage.setItem("firstName", registerUser.data.firstName)
        localStorage.setItem("lastName", registerUser.data.lastName)

        // Reset form
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

    // Return React component
    return (
      <div className="register-section-two">
              <img className="register-logo"src={logo} />
              <h1 className="register-header">
                Make an account to plan your next hiking adventure and connect 
                with friends.
              </h1>
              {error ? 
                <p 
                  ref={errorRef} 
                  className="register-error" 
                  aria-live="assertive">{error}</p> : 
                  ""}
              <form 
                onSubmit={handleSubmit} 
                className="form-two">
                <input 
                    type="email"
                    className="register-input email-input"
                    id="email"
                    ref={emailRef}
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
                <button className="register-button">
                  Register
                </button>
            </form>
            <button className="register-back-button" onClick={handleBack}>
              Back
            </button>
          </div>
    )
  }