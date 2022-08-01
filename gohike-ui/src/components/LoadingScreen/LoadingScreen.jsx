/**
 * @fileoverview This file implements the Loading Screen components which is
 * rendered when the GoHike app is fetching data.
 */
import * as React from "react";
import "./LoadingScreen.css";

/**
 *
 * @returns Loading Screen component
 */
export default function LoadingScreen() {
  // Return React component
  return <div className="loading-screen">
    <div className="walking-man"></div>
    <div>Loading...</div>
  </div>;
}
