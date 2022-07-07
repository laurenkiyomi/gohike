import * as React from "react"
import "./Register.css"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import logo from "../Images/Logo.png"

export default function Register({ currUser, setCurrUser, transparent, setTransparent }) {
      const [username, setUsername] = React.useState('')
      const [password, setPassword] = React.useState('')
      const [firstName, setFirstName] = React.useState('')
      const [lastName, setLastName] = React.useState('')
      const [age, setAge] = React.useState(0)
      const [email, setEmail] = React.useState('')
      const [error, setError] = React.useState("")
      const [partOne, setPartOne] = React.useState(true)
      const history = useNavigate()
      

      React.useEffect(() => {
        // userRef.current.focus();
        if (transparent) {
          setTransparent(false);
        }
      }, [])
  
      React.useEffect(() => {
        setError('')
      }, [username, password])
  
      return (
        <nav className="register">
          {partOne ? 
            <RegisterPartOne firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} age={age} setAge={setAge} setPartOne={setPartOne} /> : 
            <RegisterPartTwo username={username} setUsername={setUsername} password={password} setPassword={setPassword} firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} age={age} setAge={setAge} email={email}setEmail={setEmail} error={error} setError={setError} setPartOne={setPartOne} history={history} setCurrUser={setCurrUser}/>}
        </nav>
      )
  }

  export function RegisterPartOne({ firstName, setFirstName, lastName, setLastName, age, setAge, setPartOne }) {
    const nameRef = React.useRef()

    React.useEffect(() => {
      nameRef.current.focus();
    }, [])

    const handleNext = () => {
      setPartOne(false)
    }

    return (
      <div className="register-section-one">
            <img className="register-logo"src={logo} />
            <h1 className="register-header">Make an account to plan your next hiking adventure and connect with friends.</h1>
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

  export function RegisterPartTwo({ username, setUsername, password, setPassword, firstName, setFirstName, lastName, setLastName, age, setAge, email, setEmail, error, setError, setPartOne, history, setCurrUser }) {
    const REGISTER_URL = "http://localhost:3001/authorization/register"
    const GET_USER_URL = "http://localhost:3001/authorization/currUser"
    const emailRef = React.useRef()
    const errorRef = React.useRef();

    React.useEffect(() => {
      emailRef.current.focus();
    }, [])

    const handleBack = () => {
      setPartOne(true)
    }

    const handleSubmit = async(event) => {
      event.preventDefault();

      axios.post(REGISTER_URL, { firstName, lastName, age: parseInt(age), username, password, email }).then(async function(results) { 
        let registerUser = await axios.get(GET_USER_URL)
        console.log(registerUser)
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
      <div className="register-section-two">
              <img className="register-logo"src={logo} />
              <h1 className="register-header">Make an account to plan your next hiking adventure and connect with friends.</h1>
              {error ? <p ref={errorRef} className="register-error" aria-live="assertive">{error}</p> : ""}
              <form onSubmit={handleSubmit} className="form-two">
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
                <button className="register-button">Register</button>
            </form>
            <button className="register-back-button" onClick={handleBack}>Back</button>
          </div>
    )
  }