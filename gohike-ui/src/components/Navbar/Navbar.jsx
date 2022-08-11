/**
 * @fileoverview This file implements the Navbar component so that users can
 * navigate through the GoHike app. This component is rendered on every page of
 * the GoHike app.
 */
import * as React from "react";
import Logo from "./Logo";
import "./Navbar.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";

// Set up socket
let ENDPOINT = "https://gohike-api.herokuapp.com";
let socket = io(ENDPOINT);

/**
 * Navigation bar that changes background color based on the page and shows
 * whether a user is logged in or not
 *
 * @param {boolean} color Whether or not Navbar should have color on homepage
 * @param {{username: string, sessionToken: string, firstName: string,
 * lastName: string}} currUser Holds info on current user from local storage
 * @param {function} setCurrUser
 * @param {boolean} transparent Hold the state of the Navbar background
 * @returns Navbar component
 */
export default function Navbar({ color, currUser, setCurrUser, transparent }) {
  /**
   * State of the dropdown visibility when logged in
   * @type {boolean}
   */
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  /**
   * State of the friend requests box visibility
   * @type {boolean}
   */
  const [friendsOpen, setFriendsOpen] = React.useState(false);
  /**
   * Navigatation tool
   * @type {hook}
   */
  const history = useNavigate();

  // Return React component
  return (
    <nav
      className={`navbar ${transparent ? "transparent" : ""} 
      ${color ? (useLocation().pathname == "/" ? "color" : "") : ""}`}
    >
      <Logo className="nav-logo" />
      <button
        className="nav-button"
        onClick={() => {
          history("/");
          setDropdownOpen(false);
        }}
      >
        Home
      </button>
      <button
        className="nav-button"
        onClick={() => {
          if (currUser == null) {
            history("/login");
          } else {
            history("/find-hikes");
          }
          setDropdownOpen(false);
        }}
      >
        Find Hikes
      </button>
      <button
        className="nav-button"
        onClick={() => {
          if (currUser == null) {
            history("/login");
          } else {
            history("/feed");
          }
          setDropdownOpen(false);
        }}
      >
        Feed
      </button>
      <button
        className="nav-button"
        onClick={() => {
          if (currUser == null) {
            history("/login");
          } else {
            history("/find-friends");
          }
          setDropdownOpen(false);
        }}
      >
        Find Friends
      </button>
      {currUser ? (
        <>
          <button
            className="nav-button dropdown-button"
            onClick={() => {
              if (dropdownOpen) {
                setDropdownOpen(false);
                setFriendsOpen(false);
              } else {
                setDropdownOpen(true);
              }
            }}
          >
            {dropdownOpen ? (
              <span className="material-icons md-48">expand_less</span>
            ) : (
              <span className="material-icons md-48">expand_more</span>
            )}
          </button>
          <div className="nav-button my-profile-button">
            {currUser.firstName} {currUser.lastName}
          </div>
          {dropdownOpen ? (
            <Dropdown
              view="open"
              setCurrUser={setCurrUser}
              currUser={currUser}
              setDropdownOpen={setDropdownOpen}
              friendsOpen={friendsOpen}
              setFriendsOpen={setFriendsOpen}
            />
          ) : (
            <Dropdown
              view="closed"
              setCurrUser={setCurrUser}
              currUser={currUser}
              setDropdownOpen={setDropdownOpen}
              friendsOpen={friendsOpen}
              setFriendsOpen={setFriendsOpen}
            />
          )}
        </>
      ) : (
        <button
          className="nav-button login-button"
          onClick={() => history("/login")}
        >
          Log In
        </button>
      )}
    </nav>
  );
}

/**
 * Renders dropdown box for navigation necessary for a logged in user
 *
 * @param {string} view "open" or "closed" depending on visiblity of dropdown
 * @param {function} setCurrUser Called on login and logout
 * @param {function} setDropdownOpen Called on click of expand_more, expand_less
 * @param {boolean} friendsOpen Holds state of friends box visibility
 * @param {function} setFriendsOpen Called on click of "pending friend requests"
 * @returns Dropdown component
 */
export function Dropdown({
  view,
  setCurrUser,
  currUser,
  setDropdownOpen,
  friendsOpen,
  setFriendsOpen,
}) {
  /**
   * URL to make post request for logging out
   * @type {string}
   */
  const LOGOUT_URL = "https://gohike-api.herokuapp.com/authorization/logout";
  /**
   * Navigatation tool
   * @type {hook}
   */
  const history = useNavigate();

  /**
   * OnClick handler of Logout button
   */
  const handleLogout = async () => {
    history("/");
    axios
      .post(LOGOUT_URL, {
        sessionToken: currUser.sessionToken,
        feed: JSON.parse(localStorage.getItem("posts")),
      })
      .then((results) => {
        setCurrUser(null);
        localStorage.clear();
        setDropdownOpen(false);
        setFriendsOpen(false);
      })
      .catch((err) => {
        console.log("Failed to logout");
      });
  };

  /**
   * OnClick handler of My Profile button
   */
  const handleProfile = () => {
    setDropdownOpen(false);
    setFriendsOpen(false);
    history("/my-profile");
  };

  /**
   * OnClick handler of Pending Friend Requests button
   */
  const toggleFriends = () => {
    if (friendsOpen == true) {
      setFriendsOpen(false);
    } else {
      setFriendsOpen(true);
    }
  };

  // Return React component
  return (
    <>
      <div className={`dropdown ${view}`}>
        <button className="dropdown-item" onClick={handleProfile}>
          MY PROFILE
        </button>
        <button className="dropdown-item" onClick={toggleFriends}>
          PENDING FRIEND REQUESTS
        </button>
        <button className="dropdown-item logout-item" onClick={handleLogout}>
          LOG OUT
        </button>
      </div>
      <FriendRequests friendsOpen={friendsOpen} currUser={currUser} />
    </>
  );
}

/**
 * Renders any incoming friend requests
 *
 * @param {boolean} friendsOpen Holds state of friends box visibility
 * @param {{username: string, sessionToken: string, firstName: string,
 * lastName: string}} currUser Holds info on current user from local storage
 * @returns Friend Request component
 */
export function FriendRequests({ friendsOpen, currUser }) {
  /**
   * State variable holding friend requests
   * @type {Array<string>}
   */
  const [friendRequests, setFriendRequests] = React.useState(null);
  /**
   * Fetches friend request data on every render
   */
  React.useEffect(async () => {
    let data = await axios.get(
      `https://gohike-api.herokuapp.com/user/${currUser?.sessionToken}`
    );

    if (
      data.data.user.incomingFriendRequests == null ||
      data.data.user.incomingFriendRequests == undefined ||
      data.data.user.incomingFriendRequests.length == 0
    ) {
      setFriendRequests([]);
    } else {
      setFriendRequests(data.data.user.incomingFriendRequests);
    }
  }, []);

  // Listen for new friend request sent to current user
  socket.on("updatefriendrequests", async (receiver) => {
    // Update friend requests if receiver is current user
    if (receiver == currUser.username) {
      let data = await axios.get(
        `https://gohike-api.herokuapp.com/user/${currUser?.sessionToken}`
      );

      if (
        data.data.user.incomingFriendRequests == null ||
        data.data.user.incomingFriendRequests == undefined ||
        data.data.user.incomingFriendRequests.length == 0
      ) {
        setFriendRequests([]);
      } else {
        setFriendRequests(data.data.user.incomingFriendRequests);
      }
    } else {
      // Do nothing
    }
  });

  // Don't return until friend requests data is set
  if (friendRequests == null) {
    return null;
  }

  // Return React component
  return (
    <div className="friend-requests">
      {friendRequests.length == 0 ? (
        <div
          className={`no-friend-requests ${
            friendsOpen ? "" : "friends-closed"
          }`}
        >
          No pending friend requests
        </div>
      ) : (
        // Render Request component for each friend request
        friendRequests.map((username) => {
          return (
            <Request
              key={username}
              friendsOpen={friendsOpen}
              username={username}
              currUser={currUser}
              setFriendRequests={setFriendRequests}
            />
          );
        })
      )}
    </div>
  );
}

/**
 * Formats each friend request in the FriendRequests component
 *
 * @param {boolean} friendsOpen
 * @param {string} username Username of friend request sender
 * @param {{username: string, sessionToken: string, firstName: string,
 * lastName: string}} currUser Holds info on current user from local storage
 * @param {function} setFriendRequests
 * @returns Request component
 */
export function Request({
  friendsOpen,
  username,
  currUser,
  setFriendRequests,
}) {
  /**
   * URL for put request to decline friend request
   * @type {string}
   */
  const DECLINE_FRIEND_URL = "https://gohike-api.herokuapp.com/user/declineFriend";
  /**
   * URL for put request to accept friend request
   * @type {string}
   */
  const ACCEPT_FRIEND_URL = "https://gohike-api.herokuapp.com/user/acceptFriend";

  /**
   * OnClick handler of accept friend request button
   */
  const acceptFriend = async () => {
    try {
      // Make put request
      await axios
        .put(ACCEPT_FRIEND_URL, {
          sessionToken: currUser.sessionToken,
          username,
        })
        .then((data) => {
          socket.emit("acceptedfriend", currUser?.username);
        });

      // Reset friend requests
      let data = await axios.get(
        `https://gohike-api.herokuapp.com/user/${currUser.sessionToken}`
      );
      if (
        data.data.user.incomingFriendRequests == null ||
        data.data.user.incomingFriendRequests == undefined ||
        data.data.user.incomingFriendRequests.length == 0
      ) {
        setFriendRequests([]);
      } else {
        setFriendRequests(data.data.user.incomingFriendRequests);
      }
    } catch {
      console.log("Failed to accept friend");
    }
  };

  /**
   * OnClick handler of decline friend request button
   */
  const declineFriend = async () => {
    try {
      // Make put request to decline friend request
      await axios
        .put(DECLINE_FRIEND_URL, {
          sessionToken: currUser.sessionToken,
          username,
        })
        .then((data) => {
          socket.emit("declinedfriend", currUser?.username);
        });

      // Reset friend requests
      let data = await axios.get(
        `https://gohike-api.herokuapp.com/user/${currUser.sessionToken}`
      );
      if (
        data.data.user.incomingFriendRequests == null ||
        data.data.user.incomingFriendRequests == undefined ||
        data.data.user.incomingFriendRequests.length == 0
      ) {
        setFriendRequests([]);
      } else {
        setFriendRequests(data.data.user.incomingFriendRequests);
      }
    } catch {
      console.log("Failed to decline friend");
    }
  };

  // Return React component
  return (
    <div className={`request ${friendsOpen ? "" : "friends-closed"}`}>
      <p className="request-username request-item">{username.toUpperCase()}</p>
      <div className="request-buttons request-item">
        <button className="accept-button request-item" onClick={acceptFriend}>
          ✓
        </button>
        <button className="decline-button request-item" onClick={declineFriend}>
          x
        </button>
      </div>
    </div>
  );
}
