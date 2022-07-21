/**
 * @fileoverview This file implements the Home Page component. By default, this 
 * is the first page to be shown when the GoHike app is opened.
 */
import * as React from "react"
import logo from "../Images/Logo.png"
import imageOne from "../Images/four.jpeg"
import imageTwo from "../Images/seven.jpeg"
import imageThree from "../Images/two.jpeg"
import "./Home.css"
import Plx from "react-plx";
import axios from 'axios'
import { Link } from 'react-router-dom';

/**
 * Renders Home page with animations and on scroll effects
 * 
 * @param {boolean} transparent State var holding state of Navbar background 
 * @param {function} setTransparent Sets the boolean in transparent
 * @returns Home component 
 */
export default function Home({ transparent, setTransparent }) {
  /**
   * Animation helper
   */
  function makeVisible() {
    var visibles = Array.from(document.getElementsByClassName("appear")) 
  
    for (let i = 0; i < visibles.length; i++) {
        visibles[i].classList.add("visible")
    }
  }
  
  /**
   * Makes animated components visible on render
   */
  React.useEffect(() => {
    makeVisible()
    if (!transparent) {
      setTransparent(true)
    }
  }, [])


  // Return React component
  return (
    <div className="home">
      <div className="hero">
        <img className="hero-logo" src={logo}/>
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
        <Plx parallaxData={[
          {
            start: 0,
            end: 1200,
            properties: [
              {
                startValue: 400,
                endValue: -100,
                property: "translateY"
              }
            ]
          }
        ]}
      ><img className="collage-item img-one" src={imageOne}/></Plx>
      <Plx parallaxData={[
          {
            start: 750,
            end: 1200,
            properties: [
              {
                startValue: 0,
                endValue: -500,
                property: "translateY"
              }
            ]
          }
        ]}
      ><img className="collage-item img-two" src={imageTwo}/></Plx>
      {/* <Plx parallaxData={[
          {
            start: 50,
            end: 1200,
            properties: [
              {
                startValue: 100,
                endValue: -1300,
                property: "translateY"
              }
            ]
          }
        ]}
      ><img className="collage-item img-three" src={imageThree}/></Plx> */}
      </div>
      <div>
        hi there
      </div>
    </div>
  )
}
