/**
 * @fileoverview This file implements the Login Page for users with existing
 * accounts.
 */
import * as React from "react";
import "./Login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Images/Logo.png";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

/**
 * Holds form to log in users
 *
 * @param {function} setCurrUser Sets currUser on login
 * @param {boolean} transparent State var holding state of Navbar background
 * @param {function} setTransparent Sets the boolean in transparent
 * @returns Login component
 */
export default function Login({ setCurrUser, transparent, setTransparent }) {
  /**
   * URL to make post request to login to app
   * @type {string}
   */
  const LOGIN_URL = "https://stark-hamlet-74597.herokuapp.com/login";
  /**
   * Holds username input
   * @type {string}
   */
  const [username, setUsername] = React.useState("");
  /**
   * Holds password input
   * @type {string}
   */
  const [password, setPassword] = React.useState("");
  /**
   * Spinner for loading state
   * @type {boolean}
   */
  const [spinner, setSpinner] = React.useState(false);
  /**
   * Holds error message
   * @type {string}
   */
  const [error, setError] = React.useState("");
  /**
   * Navigation tool
   * @type {hook}
   */
  const history = useNavigate();
  /**
   * Reference to user input
   * @type {hook}
   */
  const userRef = React.useRef();
  /**
   * Reference to error message
   * @type {hook}
   */
  const errorRef = React.useRef();

  // Set focus on user input on every render
  React.useEffect(() => {
    userRef.current.focus();
    if (transparent) {
      setTransparent(false);
    }
  }, []);

  // Empty error message whenver username or password input changes
  React.useEffect(() => {
    setError("");
  }, [username, password]);

  /**
   * Handles submit of login form
   * @param {event} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSpinner(true);

    // Only get hikes near user if location is available
    if (navigator.geolocation) {
      // Get user location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Login user by making post request
          await axios
            .post(LOGIN_URL, { username, password })
            .then(async (loginUser) => {
              setCurrUser({
                username: loginUser.data.username,
                sessionToken: loginUser.data.sessionToken,
                firstName: loginUser.data.firstName,
                lastName: loginUser.data.lastName,
              });

              // Update feed and location if location has changed since last time
              // Set local storage
              if (
                loginUser.data.location.lat - position.coords.latitude > 1 ||
                loginUser.data.location.lat - position.coords.latitude < -1 ||
                loginUser.data.location.lng - position.coords.longitude > 1 ||
                loginUser.data.location.lng - position.coords.longitude < -1
              ) {
                // Update feed and location
                await axios
                  .put("https://stark-hamlet-74597.herokuapp.com/user/update-location", {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    username: loginUser.data.username,
                  })
                  .then((data) => {
                    // Set cache
                    localStorage.setItem("username", loginUser.data.username);
                    localStorage.setItem(
                      "sessionToken",
                      loginUser.data.sessionToken
                    );
                    localStorage.setItem("firstName", loginUser.data.firstName);
                    localStorage.setItem("lastName", loginUser.data.lastName);

                    // Set feed/location cache
                    if (JSON.stringify(data.data.posts) == undefined) {
                      localStorage.setItem("posts", JSON.stringify([]));
                    } else {
                      localStorage.setItem(
                        "posts",
                        JSON.stringify(data.data.posts)
                      );
                    }
                    localStorage.setItem(
                      "location",
                      JSON.stringify(data.data.location)
                    );
                  });
              }
              // Otherwise just set local storage
              else {
                // Set cache
                localStorage.setItem("username", loginUser.data.username);
                localStorage.setItem(
                  "sessionToken",
                  loginUser.data.sessionToken
                );
                localStorage.setItem("firstName", loginUser.data.firstName);
                localStorage.setItem("lastName", loginUser.data.lastName);
                if (JSON.stringify(loginUser.data.posts) == undefined) {
                  localStorage.setItem("posts", JSON.stringify([]));
                } else {
                  localStorage.setItem(
                    "posts",
                    JSON.stringify(loginUser.data.posts)
                  );
                }
                localStorage.setItem(
                  "location",
                  JSON.stringify(loginUser.data.location)
                );
              }

              // Reset login form
              setSpinner(false);
              setUsername("");
              setPassword("");
              history("/");
            })
            .catch((err) => {
              setSpinner(false);
              setError("Invalid Username or Password");
              errorRef.current.focus();
            });
        },
        async () => {
          // Getting location fails
          // Can still login but cannot get location
          await axios
            .post(LOGIN_URL, { username, password })
            .then(async (loginUser) => {
              setCurrUser({
                username: loginUser.data.username,
                sessionToken: loginUser.data.sessionToken,
                firstName: loginUser.data.firstName,
                lastName: loginUser.data.lastName,
              });

              // Set cache
              localStorage.setItem("username", loginUser.data.username);
              localStorage.setItem("sessionToken", loginUser.data.sessionToken);
              localStorage.setItem("firstName", loginUser.data.firstName);
              localStorage.setItem("lastName", loginUser.data.lastName);
              if (JSON.stringify(loginUser.data.posts) == undefined) {
                localStorage.setItem("posts", JSON.stringify([]));
              } else {
                localStorage.setItem(
                  "posts",
                  JSON.stringify(loginUser.data.posts)
                );
              }
              localStorage.setItem(
                "location",
                JSON.stringify(loginUser.data.location)
              );
            });

          // Reset login form
          setUsername("");
          setPassword("");
          history("/");
        }
      );
    } else {
      // Browser does not support geolocation
      alert("Please allow access to current location before logging in");
    }
  };

  // Return React component
  return (
    <>
      {spinner ? (
        <div className="loading-container">
          <LoadingScreen />
        </div>
      ) : (
        <nav className="login">
          <div className="login-section">
            <img className="login-logo" src={logo} />
            <h1 className="login-header">
              Log in to plan your next hiking adventure and connect with
              friends.
            </h1>
            {error ? (
              <p ref={errorRef} className="login-error" aria-live="assertive">
                {error}
              </p>
            ) : (
              ""
            )}
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
              <Link to="/register">Register Here</Link>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
