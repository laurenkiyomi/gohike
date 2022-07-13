import * as React from "react"
import "./Feed.css"
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Select from 'react-select';

// initalize Parse
import Parse from 'parse/dist/parse.min.js'

// {(picture == "") ? "" : <img src={URL.createObjectURL(picture)}/> }
//       {/* <img src={URL.createObjectURL(picture)}/> */}

export default function Feed({ transparent, setTransparent, currUser }) {
    const TRAILS_URL = "http://localhost:3001/trails/"
    const [picture, setPicture] = React.useState(null)
    const [trail, setTrail] = React.useState("")
    const [caption, setCaption] = React.useState("")
    const [trailsList, setTrailsList] = React.useState([])

    React.useEffect(async () => {
      if (transparent) {
        setTransparent(false)
      }

      let data = await axios.get(TRAILS_URL)
      setTrailsList(data.data.trails)
    }, [])

    return (
      <nav className="feed">
        <CreatePost picture={picture} setPicture={setPicture} trail={trail} setTrail={setTrail} caption={caption} setCaption={setCaption} trailsList={trailsList} currUser={currUser}/>
      </nav>
    )
  }

  export function CreatePost({ picture, setPicture, trail, setTrail, caption, setCaption, trailsList, currUser }) {
    const CREATE_POST_URL = "http://localhost:3001/posts/create"

    const handleCreatePost = async (event) => {
      event.preventDefault()

      try {
        await axios.post(CREATE_POST_URL, { hikeId: trail.value, caption, sessionToken: currUser.sessionToken })

        event.target[1].value = ""
        setPicture(null)
        setTrail("")
        setCaption("")

      } catch {  
          console.log("Failed to create post.")
      }
    }
    return (
      <>
        <form className="create-post-form" onSubmit={handleCreatePost}>
          <Select
            options={trailsList}
            value={trail}
            placeholder="Select Trail"
            onChange={(value) => {setTrail(value)}}
            className="trail-post-input"
          />
          <input 
            type="file"
            className="picture-post-input"
            name="file"
            onChange={(event) => setPicture(event.target.files[0])}
            required
          />
          <input
            type="text"
            className="caption-post-input"
            onChange={(event) => setCaption(event.target.value)}
            value={caption}
            placeholder={`How was your hike, ${currUser.firstName}?`}
          />
          <button>Post</button>
        </form>
      </>
    )
  }