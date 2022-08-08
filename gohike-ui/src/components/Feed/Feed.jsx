/**
 * @fileoverview This file implements the Feed component so that users can view
 * posts from other users and share their own posts.
 */
import * as React from "react";
import "./Feed.css";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import PostGrid from "./PostGrid";
import io from "socket.io-client"
import { pq } from "../../../../gohike-api/models/pq";

// Set up socket
let ENDPOINT = "https://stark-hamlet-74597.herokuapp.com"
let socket = io(ENDPOINT)

/**
 * Renders CreatePost and PostGrid component
 *
 * @param {boolean} transparent State var holding state of Navbar background
 * @param {function} setTransparent Sets the boolean in transparent
 * @param {{username: string, sessionToken: string, firstName: string,
 * lastName: string}} currUser Holds info on current user from local storage
 * @returns Feed component
 */
export default function Feed({ transparent, setTransparent, currUser }) {
  /**
   * URL to get all trails in database
   * @type {string}
   */
  const TRAILS_URL = "https://stark-hamlet-74597.herokuapp.com/trails/";
  /**
   * URL to get all posts in database
   * @type {string}
   */
  const FRIENDS_POSTS_URL = `https://stark-hamlet-74597.herokuapp.com/posts/friends/${currUser?.username}`;
  /**
   * URL to get friends posts in database
   * @type {string}
   */
  const POSTS_URL = "https://stark-hamlet-74597.herokuapp.com/posts";
  /**
   * State var that holds all trails in database including name and hike id
   * @type {Array<{name: string, value: number}>}
   */
  const [trailsList, setTrailsList] = React.useState([]);
  /**
   * State var that holds post number offset to render
   * @type {number}
   */
  const [numPosts, setNumPosts] = React.useState(0);
  /**
   * State var that holds post id's of posts to render
   * @type {Array<number>}
   */
  const [posts, setPosts] = React.useState(JSON.parse(localStorage.getItem("posts")));
  /**
   * State of whether to render loading page or not
   * @type {boolean}
   */
  const [spinner, setSpinner] = React.useState(false);
  /**
   * Navigation tool
   * @type {hook}
   */
  const history = useNavigate();

  // Listen for new post created by a friend
  socket.on("update", async () => {
    // Get new feed
    await axios.get(`https://stark-hamlet-74597.herokuapp.com/user/newFeed/${currUser?.username}`)
      .then((data) => {
        // Cache new posts in local storage
        localStorage.setItem(
          "posts",
          JSON.stringify(data.data.feed)
        )
        window.location.reload(true)
      })
  });

  /**
   * Fetches data on the trails on every render
   */
  React.useEffect(async () => {
    // Navigate to login page if user isn't logged in
    if (currUser == null) {
      history("/login");
    }

    if (transparent) {
      setTransparent(false);
    }

    let data = await axios.get(TRAILS_URL);
    setTrailsList(data.data.trails);
  }, [numPosts]);

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  // Return React component
  return (
    <nav className="feed">
      <CreatePost trailsList={trailsList} currUser={currUser} />
      {spinner ? (
        <LoadingScreen />
      ) : (
        <PostGrid posts={posts} currUser={currUser} setPosts={setPosts}/>
      )}
    </nav>
  );
}

/**
 * Renders form box for users to create a new post
 *
 * @param {Array<{name: string, value: number}>} trailsList
 * @param {{username: string, sessionToken: string, firstName: string,
 * lastName: string}} currUser
 * @returns CreatePost component
 */
export function CreatePost({ trailsList, currUser }) {
  /**
   * URL for making post request to create new post
   * @type {string}
   */
  const CREATE_POST_URL = "https://stark-hamlet-74597.herokuapp.com/posts/create";
  /**
   * State var that holds url of picture input
   * @type {string}
   */
  const [picture, setPicture] = React.useState(null);
  /**
   * State var that holds name and id of trail selected by user
   * @type {{name: string, value: number}}
   */
  const [trail, setTrail] = React.useState("");
  /**
   * Caption of post typed by user
   * @type {string}
   */
  const [caption, setCaption] = React.useState("");

  /**
   * Converts buffer to base64
   *
   * @param {string} buffer
   * @returns {string} base64 string of picture data
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

  // Creates a post on form submit
  const handleCreatePost = async (event) => {
    event.preventDefault();

    try {
      // Alert and throw error if missing trail selection
      if (trail == "") {
        alert("Please select a trail!");
        throw new Error();
      }

      // Get array buffer from file
      const arrayBuffer = await picture.arrayBuffer();
      // Convert the array to a base64 string
      let base64String = _arrayBufferToBase64(arrayBuffer);
      base64String = "data:image/jpeg;base64," + base64String;

      // Get trail id
      let trailId = trail.value;
      let captionValue = caption;

      // Resets form
      event.target[1].value = "";
      setPicture(null);
      setTrail("");
      setCaption("");

      // Upload to Parse
      await axios.post(CREATE_POST_URL, {
        hikeId: trailId,
        caption: captionValue,
        sessionToken: currUser?.sessionToken,
        picture: base64String,
      }).then((newPost) => {
        // Emit event that includes new post id
        socket.emit("newpost", newPost.data.id);
      })
    } catch (err) {
      console.log(err)
      console.log("Failed to create post.");
    }
  };

  // Return React component
  return (
    <form className="create-post-form" onSubmit={handleCreatePost}>
      <textarea
        type="text"
        className="caption-post-input"
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
        placeholder={`How was your hike, ${currUser?.firstName}?`}
        required
      />
      <div className="add-to-post">
        <Select
          menuPortalTarget={document.body}
          menuPosition="fixed"
          styles={{
            menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
            menu: (provided) => ({ ...provided, zIndex: 9999 }),
          }}
          options={trailsList}
          value={trail}
          placeholder="Select Trail"
          onChange={(value) => {
            setTrail(value);
          }}
          className="trail-post-input"
        />
        <label className="upload-images-label" htmlFor="file-input">
          <img
            className="upload-images-icon"
            src="https://icon-library.com/images/image-icon-png/image-icon-png-6.jpg"
          />
        </label>
        <input
          type="file"
          id="file-input"
          className="picture-post-input"
          name="file"
          onChange={(event) => {
            setPicture(event.target.files[0]);
          }}
          required
        />
        <button className="post-button">Post</button>
      </div>
    </form>
  );
}
