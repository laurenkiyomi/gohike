import * as React from "react"
import "./Feed.css"
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Select from 'react-select';
import PostGrid from "./PostGrid";

export default function Feed({ transparent, setTransparent, currUser }) {
    const TRAILS_URL = "http://localhost:3001/trails/"
    const FRIENDS_POSTS_URL = `http://localhost:3001/posts/friends/${currUser.sessionToken}`
    const POSTS_URL = "http://localhost:3001/posts"
    const [trailsList, setTrailsList] = React.useState([])
    const [numPosts, setNumPosts] = React.useState(5)
    const [posts, setPosts] = React.useState(null)

    async function fetchData() {
      let data = await axios.get(POSTS_URL)
      setPosts(data.data.posts)
    }

    React.useEffect(async () => {
      if (transparent) {
        setTransparent(false)
      }

      let data = await axios.get(TRAILS_URL)
      setTrailsList(data.data.trails)
    }, [])

    React.useEffect(async () => {
      fetchData()
    }, [numPosts])
   
    return (
      <nav className="feed">
        <CreatePost trailsList={trailsList} currUser={currUser} fetchData={fetchData}/>
        <PostGrid posts={posts} currUser={currUser} />
      </nav>
    )
  }

  export function CreatePost({ trailsList, currUser, fetchData }) {
    const CREATE_POST_URL = "http://localhost:3001/posts/create"
    const [picture, setPicture] = React.useState(null)
    const [trail, setTrail] = React.useState("")
    const [caption, setCaption] = React.useState("")

    const _arrayBufferToBase64 = (buffer) => {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa( binary );
  }

    const handleCreatePost = async (event) => {
      event.preventDefault()

      try {
        // Alert and throw error if missing trail selection
        if (trail == "") {
          alert("Please select a trail!")
          throw new Error()
        }

        // Get array buffer from file
        const arrayBuffer = await picture.arrayBuffer()
        // Convert the array to a base64 string
        let base64String = _arrayBufferToBase64(arrayBuffer)
        base64String = "data:image/jpeg;base64," + base64String
        // Upload to Parse
        await axios.post(CREATE_POST_URL, { hikeId: trail.value, caption, sessionToken: currUser.sessionToken, picture: base64String })

        event.target[1].value = ""
        setPicture(null)
        setTrail("")
        setCaption("")
      } catch {  
          console.log("Failed to create post.")
      }
    }
    
    return (
        <form className="create-post-form" onSubmit={handleCreatePost}>
          <input
            type="text"
            className="caption-post-input"
            onChange={(event) => setCaption(event.target.value)}
            value={caption}
            placeholder={`How was your hike, ${currUser.firstName}?`}
            required
          />
          <div className="add-to-post">
            <Select
              options={trailsList}
              value={trail}
              placeholder="Select Trail"
              onChange={(value) => {setTrail(value)}}
              className="trail-post-input"
            />
            <label className="upload-images-label" htmlFor="file-input">
              <img className="upload-images-icon" src="https://icon-library.com/images/image-icon-png/image-icon-png-6.jpg"/>
            </label>
            <input 
              type="file"
              id="file-input"
              className="picture-post-input"
              name="file"
              onChange={(event) => {
                setPicture(event.target.files[0])
              }}
              required
            />
            <button className="post-button">Post</button>
          </div>
        </form>
    )
  }