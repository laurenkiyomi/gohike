/**
 * @fileoverview This file implements the My Profile Page so that logged in
 * users can view and edit their own profile.
 */
import * as React from "react";
import "./MyProfile.css";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../Images/Logo.png";
import PostGrid from "../Feed/PostGrid";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

/**
 * Allows logged in users to view and edit their own profile
 *
 * @param {{username: string, sessionToken: string, firstName: string,
 * lastName: string}} currUser Holds info on current user from local storage
 * @param {function} setCurrUser
 * @param {boolean} transparent Hold the state of the Navbar background
 * @returns My Profile component
 */
export default function MyProfile({ transparent, setTransparent, currUser }) {
  /**
   * URL to make put request to change profile picture
   * @type {string}
   */
  const EDIT_PROFILE_PIC_URL = "https://stark-hamlet-74597.herokuapp.com/user/profilePhoto";
  /**
   * URL to make put request to change cover picture
   * @type {string}
   */
  const EDIT_COVER_PIC_URL = "https://stark-hamlet-74597.herokuapp.com/user/coverPhoto";
  /**
   * State var holding profile info on currUser
   * @type {{coverPic: string, profilePic: string, firstName: string,
   * lastName: string, friends: Array<string>}}
   */
  const [profileData, setProfileData] = React.useState(null);
  /**
   * State var holding id's of post made by currUser
   * @type {Array<number>}
   */
  const [posts, setPosts] = React.useState(null);
  /**
   * State var that handles navigation through profile
   * @type {string}
   */
  const [select, setSelect] = React.useState("posts");
  /**
   * State var that holds whether or not app is fetching data
   * @type {boolean}
   */
  const [spinner, setSpinner] = React.useState(false);

  /**
   * Converts buffer to base64 format in order to save pictures to Parse
   * @param {buffer} buffer
   * @returns {string} base64 of picture data
   */
  const _arrayBufferToBase64 = (buffer) => {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  /**
   * OnClick handler of submitting change profile picture form
   * @param {event} event
   */
  const changeProfilePicture = async (event) => {
    try {
      // Get array buffer from file
      const arrayBuffer = await event.target.files[0].arrayBuffer();
      // Convert the array to a base64 string
      let base64String = _arrayBufferToBase64(arrayBuffer);
      base64String = "data:image/jpeg;base64," + base64String;

      // Make put request
      await axios.put(EDIT_PROFILE_PIC_URL, {
        sessionToken: currUser.sessionToken,
        picture: base64String,
      });

      // Reset form
      event.target.value = "";

      // Re-fetch profile data
      let data = await axios.get(
        `https://stark-hamlet-74597.herokuapp.com/user/${currUser.sessionToken}`
      );
      setProfileData(data.data.user);
      return;
    } catch (err) {
      console.log(err);
      console.log("Failed to change profile picture.");
    }
  };

  /**
   * OnClick handler of submitting change cover picture form
   * @param {event} event
   */
  const changeCoverPicture = async (event) => {
    try {
      // Get array buffer from file
      const arrayBuffer = await event.target.files[0].arrayBuffer();
      // Convert the array to a base64 string
      let base64String = _arrayBufferToBase64(arrayBuffer);
      base64String = "data:image/jpeg;base64," + base64String;

      // Make put request
      await axios.put(EDIT_COVER_PIC_URL, {
        sessionToken: currUser.sessionToken,
        picture: base64String,
      });

      // Reset form
      event.target.value = "";

      // Re-fetch profile data
      let data = await axios.get(
        `https://stark-hamlet-74597.herokuapp.com/user/${currUser.sessionToken}`
      );
      setProfileData(data.data.user);
      return;
    } catch (err) {
      console.log("Failed to change profile picture.");
    }
  };

  /**
   * Fetches and sets profile data
   */
  const fetchData = async () => {
    let data = await axios.get(
      `https://stark-hamlet-74597.herokuapp.com/user/${currUser.sessionToken}`
    );
    setProfileData(data.data.user);

    let data2 = await axios.get(
      `https://stark-hamlet-74597.herokuapp.com/user/posts/${currUser.username}`
    );
    setPosts(data2.data.posts);
  };

  /**
   * Fetches profile data on every render
   */
  React.useEffect(async () => {
    if (transparent) {
      setTransparent(false);
    }

    await fetchData();
    setSpinner(true);
  }, []);

  // Return React component
  return (
    <div className="my-profile">
      <div className="my-profile-header">
        <h1>GOHIKE</h1>
        <img className="logo-img" src={logo} />
      </div>
      {spinner ? (
        <ProfileBanner
          currUser={currUser}
          posts={posts}
          profileData={profileData}
          changeCoverPicture={changeCoverPicture}
          changeProfilePicture={changeProfilePicture}
          select={select}
          setSelect={setSelect}
        />
      ) : (
        <LoadingScreen />
      )}
    </div>
  );
}

/**
 * Renders main information of current user
 *
 * @param {{username: string, sessionToken: string, firstName: string,
 * lastName: string}} currUser Holds info on current user from local storage
 * @param {Array<number>} posts
 * @param {{coverPic: string, profilePic: string, firstName: string,
 * lastName: string, friends: Array<string>}} profileData
 * @param {function} changeCoverPicture
 * @param {function} changeProfilePicture
 * @param {string} select Sets selected navigation menu item
 * @param {function} setSelect
 * @returns Profile Banner component
 */
export function ProfileBanner({
  currUser,
  posts,
  profileData,
  changeCoverPicture,
  changeProfilePicture,
  select,
  setSelect,
}) {
  // Don't return until profileData and posts are set
  if (profileData == null || posts == null) {
    return null;
  }

  // Return React component
  return (
    <>
      <div className="profile-banner">
        <div className="cover-pic-container">
          <img className="cover-pic" src={profileData.coverPic} />
        </div>
        <label className="cover-pic-label" htmlFor="file-input2">
          <button className="cover-pic-button">Edit Cover Picture</button>
        </label>
        <input
          type="file"
          id="file-input2"
          className="cover-pic-input"
          name="file"
          onChange={async (event) => {
            await changeCoverPicture(event);
          }}
        />
        <div className="profile-pic-container">
          <img className="profile-pic" src={profileData.profilePic} />
        </div>
        <h2 className="profile-name">{`${profileData.firstName} ${profileData.lastName}`}</h2>
        <p className="profile-friends">{`${
          profileData.friends == undefined ? "0" : profileData.friends.length
        } Friends`}</p>
        <label className="profile-pic-label" htmlFor="file-input1">
          <img
            className="profile-pic-icon"
            src="https://i.pinimg.com/originals/e2/bc/2b/e2bc2b005d593253f62a4727d3da5d4f.png"
          />
        </label>
        <input
          type="file"
          id="file-input1"
          className="profile-pic-input"
          name="file"
          onChange={async (event) => {
            await changeProfilePicture(event);
          }}
        />
        <div className="line"></div>
        <ul className="profile-nav">
          <li
            className={`profile-posts-button ${
              select != "posts" ? "" : "active"
            }`}
            onClick={() => {
              if (select != "posts") {
                setSelect("posts");
              }
            }}
          >
            Posts
          </li>
          <li
            className={`profile-stats-button ${
              select == "posts" ? "" : "active"
            }`}
            onClick={() => {
              if (select == "posts") {
                setSelect("stats");
              }
            }}
          >
            Stats
          </li>
        </ul>
      </div>
      {select == "stats" ? (
        <Stats profileData={profileData}/>
      ) : (
        <PostGrid posts={posts} currUser={currUser}></PostGrid>
      )}
    </>
  );
}

/**
 * Renders information on hikes that logged in user has completed
 * @param {{ completed: Array<number>, saved: Array<number> }} profileData data 
 * on the current user
 * @returns Stats component
 */
export function Stats({ profileData }) {
  return (
    <div className="profile-stats">
      <div>{`${profileData.completed.length} Completed Hikes`}</div>
      <div>{`${profileData.saved.length} Saved Hikes`}</div>
    </div>
  )
}
