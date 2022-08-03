/**
 * @fileoverview This file implements the View Profile page so that logged in
 * users can view and interact with other users' profiles.
 */
import * as React from "react";
import "./ViewProfile.css";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import logo from "../Images/Logo.png";
import PostGrid from "../Feed/PostGrid";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

/**
 * Allows logged in users to view and interact with other users
 *
 * @param {boolean} transparent Holds state of Navbar visibility
 * @param {function} setTransparent
 * @param {{username: string, sessionToken: string, firstName: string,
 * lastName: string}} currUser Holds info on current user from local storage
 * @returns View Profile component
 */
export default function ViewProfile({ transparent, setTransparent, currUser }) {
  /**
   * URL for making put request to send friend request
   * @type {string}
   */
  const ADD_FRIEND_URL = "http://localhost:3001/user/addFriend";
  /**
   * URL for making put request to decline friend requeest
   * @type {string}
   */
  const DECLINE_FRIEND_URL = "http://localhost:3001/user/declineFriend";
  /**
   * URL for making put request to acceot friend requeest
   * @type {string}
   */
  const ACCEPT_FRIEND_URL = "http://localhost:3001/user/acceptFriend";

  /**
   * State var holding profile info on viewed user
   * @type {{coverPic: string, profilePic: string, firstName: string,
   * lastName: string, friends: Array<string>}}
   */
  const [profileData, setProfileData] = React.useState(null);
  /**
   * State var holding id's of post made by viewed user
   * @type {Array<number>}
   */
  const [posts, setPosts] = React.useState(null);
  /**
   * State var that handles navigation through profile
   * @type {string}
   */
  const [select, setSelect] = React.useState("posts");
  /**
   * State var that holds info on status of friendship with user and currUser
   * @type {string}
   */
  const [friendStatus, setFriendStatus] = React.useState("");
  const params = useParams();
  /**
   * Username of viewed user
   * @type {string}
   */
  const username = params.username;
  /**
   * State var that holds whether or not app is fetching data
   * @type {boolean}
   */
  const [spinner, setSpinner] = React.useState(false);
  /**
   * Navigation tool
   * @type {hook}
   */
  const history = useNavigate();

  // Show MyProfile page if viewing own user profile
  if (currUser.username == username) {
    history("/my-profile");
  }

  /**
   * OnClick handler of add friend button
   */
  const addFriend = async () => {
    try {
      // Make put request
      await axios.put(ADD_FRIEND_URL, {
        sessionToken: currUser.sessionToken,
        username: profileData.username,
      });
      setFriendStatus("sent");
    } catch {
      console.log("Failed to add friend");
    }
  };

  /**
   * OnClick handler of decline friend button
   */
  const declineFriend = async () => {
    try {
      // Make put request
      await axios.put(DECLINE_FRIEND_URL, {
        sessionToken: currUser.sessionToken,
        username: profileData.username,
      });
      setFriendStatus("no");
    } catch {
      console.log("Failed to decline friend");
    }
  };

  /**
   * OnClick handler of accept friend button
   */
  const acceptFriend = async () => {
    try {
      // Make put request
      await axios.put(ACCEPT_FRIEND_URL, {
        sessionToken: currUser.sessionToken,
        username: profileData.username,
      });
      setFriendStatus("yes");
    } catch {
      console.log("Failed to accept friend");
    }
  };

  /**
   * Fetches and sets data on viewed user
   */
  const fetchData = async () => {
    // Get profile data
    let data = await axios.get(`http://localhost:3001/user/view/${username}`);
    setProfileData(data.data.user);

    // Get user's posts
    let data2 = await axios.get(
      `http://localhost:3001/user/view/posts/${username}`
    );
    setPosts(data2.data.posts);

    // Set friend status
    if (
      data.data.user.sentFriendRequests != null &&
      data.data.user.sentFriendRequests != undefined
    ) {
      for (let i = 0; i < data.data.user.sentFriendRequests.length; i++) {
        if (data.data.user.sentFriendRequests[i] == currUser.username) {
          setFriendStatus("incoming");
          return;
        }
      }
    }

    if (
      data.data.user.incomingFriendRequests != null &&
      data.data.user.incomingFriendRequests != undefined
    ) {
      for (let i = 0; i < data.data.user.incomingFriendRequests.length; i++) {
        if (data.data.user.incomingFriendRequests[i] == currUser.username) {
          setFriendStatus("sent");
          return;
        }
      }
    }

    setFriendStatus("no");
    if (data.data.user.friends != undefined && data.data.user.friends != null) {
      for (let i = 0; i < data.data.user.friends.length; i++) {
        if (data.data.user.friends[i] == currUser.username) {
          setFriendStatus("yes");
          return;
        }
      }
    }
  };

  // Fetch data on user on every render
  React.useEffect(async () => {
    if (transparent) {
      setTransparent(false);
    }

    await fetchData();
    setSpinner(true);
  }, []);

  // Return React component
  return (
    <div className="view-profile">
      <div className="view-profile-header">
        <h1>GOHIKE</h1>
        <img className="logo-img" src={logo} />
      </div>
      {spinner ? (
        <ViewProfileBanner
          currUser={currUser}
          posts={posts}
          profileData={profileData}
          select={select}
          setSelect={setSelect}
          acceptFriend={acceptFriend}
          addFriend={addFriend}
          friendStatus={friendStatus}
        />
      ) : (
        <LoadingScreen />
      )}
    </div>
  );
}

/**
 * Renders main information on viewed user
 *
 * @param {{username: string, sessionToken: string, firstName: string,
 * lastName: string}} currUser Holds info on current user from local storage
 * @param {Array<number>} posts Id's of posts made by viewed user
 * @param {{coverPic: string, profilePic: string, firstName: string,
 * lastName: string, friends: Array<string>}} profileData
 * @param {string} select
 * @param {function} setSelect
 * @param {function} acceptFriend
 * @param {function} addFriend
 * @param {string} friendStatus
 * @returns
 */
export function ViewProfileBanner({
  currUser,
  posts,
  profileData,
  select,
  setSelect,
  acceptFriend,
  addFriend,
  friendStatus = { friendStatus },
}) {
  // Don't reutnr until profile data, posts, and friend status are set
  if (profileData == null || posts == null || friendStatus == "") {
    return null;
  }

  // Return React component
  return (
    <>
      <div className="view-profile-banner">
        <div className="view-cover-pic-container">
          <img className="view-cover-pic" src={profileData.coverPic} />
        </div>
        <div className="view-profile-pic-container">
          <img className="view-profile-pic" src={profileData.profilePic} />
        </div>
        {friendStatus == "no" ? (
          <button className="friend-button" onClick={addFriend}>
            Add Friend +
          </button>
        ) : friendStatus == "yes" ? (
          <button className="friend-button">Your Friend</button>
        ) : friendStatus == "incoming" ? (
          <button className="friend-button" onClick={acceptFriend}>
            Accept Friend Request
          </button>
        ) : (
          <button className="friend-button">Pending</button>
        )}
        <h2 className="view-profile-name">
          {`${profileData.firstName} ${profileData.lastName}`}
        </h2>
        <p className="view-profile-friends">
          {`${
            profileData.friends == undefined ? "0" : profileData.friends.length
          } Friends`}
        </p>
        <div className="line"></div>
        <ul className="view-profile-nav">
          <li
            className={`view-profile-posts-button 
                        ${select != "posts" ? "" : "active"}`}
            onClick={() => {
              if (select != "posts") {
                setSelect("posts");
              }
            }}
          >
            Posts
          </li>
          <li
            className={`view-profile-about-button ${
              select == "posts" ? "" : "active"
            }`}
            onClick={() => {
              if (select == "posts") {
                setSelect("about");
              }
            }}
          >
            About
          </li>
        </ul>
      </div>
      {select == "posts" ? (
        <PostGrid posts={posts} currUser={currUser}></PostGrid>
      ) : (
        <About profileData={profileData}/>
      )}
    </>
  );
}

/**
 * Renders additional information on the user being viewed
 *
 * @param {{ completed: Array<number>, saved: Array<number> }} profileData data 
 * on the user
 * @returns About component
 */
export function About({ profileData }) {
  // Return React component
  return (
    <div className="profile-about">
      <div>{`${profileData.completed.length} Completed Hikes`}</div>
      <div>{`${profileData.saved.length} Saved Hikes`}</div>
    </div>
  )
}
