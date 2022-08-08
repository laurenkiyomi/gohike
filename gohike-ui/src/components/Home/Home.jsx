/**
 * @fileoverview This file implements the Home Page component. By default, this
 * is the first page to be shown when the GoHike app is opened.
 */
import * as React from "react";
import logo from "../Images/Logo.png";
import mountains from "../Images/Mountains.png";
import sun from "../Images/SunLogo.png";
import imageOne from "../Images/four.jpeg";
import imageTwo from "../Images/seven.jpeg";
import imageThree from "../Images/two.jpeg";
import "./Home.css";
import Plx from "react-plx";
import axios from "axios";
import { Link } from "react-router-dom";
import { pq } from "../../../../gohike-api/models/pq";
import hikers from "../Images/hikers.png"

/**
 * Renders Home page with animations and on scroll effects
 *
 * @param {{username: string, sessionToken: string}} currUser Current user info
 * @param {boolean} transparent State var holding state of Navbar background
 * @param {function} setTransparent Sets the boolean in transparent
 * @returns Home component
 */
export default function Home({ currUser, transparent, setTransparent }) {
  /**
   * URL to get all posts in database
   * @type {string}
   */
  const FRIENDS_POSTS_URL = `http://localhost:3001/posts/friends/${currUser?.username}`;
  /**
   * Animation helper
   */
  function makeVisible() {
    var visibles = Array.from(document.getElementsByClassName("appear"));

    for (let i = 0; i < visibles.length; i++) {
      visibles[i].classList.add("visible");
    }
  }

  /**
   * Fetches post id's to render
   */
  async function fetchData() {
    let data = await axios.get(FRIENDS_POSTS_URL);

    // Only get hikes near user if location is available
    if (navigator.geolocation) {
      // Get user location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          localStorage.setItem(
            "posts",
            JSON.stringify(
              pq.create(
                data.data.posts,
                position.coords.latitude,
                position.coords.longitude
              )
            )
          );
        },
        () => {
          // Getting location fails
          localStorage.setItem("posts", JSON.stringify(data.data.posts));
        }
      );
    } else {
      // Browser does not support geolocation
      localStorage.setItem("posts", JSON.stringify(data.data.posts));
    }
  }

  /**
   * Makes animated components visible on render
   */
  React.useEffect(async () => {
    makeVisible();
    if (!transparent) {
      setTransparent(true);
    }
  }, []);

  // Return React component
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-logo">
          <div className="logo-container">
            <img className="sun" src={sun} />
            <img className="mountains" src={mountains} />
          </div>
        </div>
        <h1 className="hero-text appear">GOHIKE</h1>
      </div>
      <div className="about">
        <div className="about-text about-text-one appear">
          <h2>Explore</h2>
          <p className="about-para">
            Find hikes near you and save them for later
          </p>
        </div>
        <div className="about-text about-text-two appear">
          <h2>Connect</h2>
          <p className="about-para">
            Add your friends to receive updates on their latest hikes
          </p>
        </div>
        <div className="about-text about-text-three appear">
          <h2>Track</h2>
          <p className="about-para">
            Keep track of your progress and how far you've hiked
          </p>
        </div>
      </div>
      <div className="collage">
        <Plx
          parallaxData={[
            {
              start: 0,
              end: 1200,
              properties: [
                {
                  startValue: 400,
                  endValue: -100,
                  property: "translateY",
                },
              ],
            },
          ]}
        >
          <img className="collage-item img-one" src={imageOne} />
        </Plx>
        <Plx
          parallaxData={[
            {
              start: 750,
              end: 1250,
              properties: [
                {
                  startValue: 0,
                  endValue: -500,
                  property: "translateY",
                },
              ],
            },
          ]}
        >
          <img className="collage-item img-two" src={imageTwo} />
        </Plx>
      </div>
      <div className="collage-title">ABOUT US</div>
        <div className="collage-text">
          GoHike is designed for you to get involved in the hiking community,
          find hikes around your area, and more.
        </div>
        <div className="footer">
          <span>
            <div className="title">CONTACT US</div>
            <div>Email: laurenklee02@gmail.com</div>
            <div>Phone: 1-800-GOHIKE</div>
            <div>Address: 123 Fake Street, San Francisco, CA</div>
          </span>
          <img src={hikers}/>
        </div>
        <div></div>
    </div>
  );
}
