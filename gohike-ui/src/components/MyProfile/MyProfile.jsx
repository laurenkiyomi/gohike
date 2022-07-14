import * as React from "react"
import "./MyProfile.css"
import axios from 'axios'
import { Link } from 'react-router-dom';
import logo from "../Images/Logo.png"
import PostGrid from "../Feed/PostGrid"

export default function MyProfile({ transparent, setTransparent, currUser, setCurrUser }) {
    const EDIT_PROFILE_PIC_URL = "http://localhost:3001/user/profilePhoto"
    const [profileData, setProfileData] = React.useState(null)
    const [posts, setPosts] = React.useState(null)
    const [select, setSelect] = React.useState("posts")

    const _arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
    }

    const changeProfilePicture = async (event) => {  
        try {
          // Get array buffer from file
          const arrayBuffer = await event.target.files[0].arrayBuffer()
          // Convert the array to a base64 string
          const base64String = _arrayBufferToBase64(arrayBuffer)
  
          console.log(base64String)
          await axios.put(EDIT_PROFILE_PIC_URL, { sessionToken: currUser.sessionToken, picture: base64String })
        
          event.target.value = ""

          let data = await axios.get(`http://localhost:3001/user/${currUser.sessionToken}`)
          setProfileData(data.data.user)
        } catch (err){  
            console.log(err)
            console.log("Failed to change profile picture.")
        }
      }

     React.useEffect(async () => {
        if (transparent) {
          setTransparent(false)
        }

        let data = await axios.get(`http://localhost:3001/user/${currUser.sessionToken}`)
        setProfileData(data.data.user)

        let data2 = await axios.get(`http://localhost:3001/user/posts/${currUser.sessionToken}`)
        setPosts(data2.data.posts)
    }, [])

    if (profileData == null || posts == null) {
        return null
    }

    return (
        <div className="my-profile">
            <div className="my-profile-header">
                <h1>GOHIKE</h1>
                <img className="logo-img" src={logo}/>
            </div>
            <div className="profile-banner">
                <div className="cover-pic-container">
                    <img className="cover-pic" src={profileData.coverPic.url}/>
                </div>
                <div className="profile-pic-container">
                    <img className="profile-pic" src={profileData.profilePic.url}/>
                </div>
                <h2 className="profile-name">{`${profileData.firstName} ${profileData.lastName}`}</h2>
                <p className="profile-friends">Friends</p>
                <div className="line"></div>
                <ul className="profile-nav">
                    <li className={`profile-posts-button ${select != "posts" ? "" : "active"}`} onClick={() => {
                        if (select != "posts") {
                            setSelect("posts")
                        }    
                    }}>Posts</li>
                    <li className={`profile-stats-button ${select == "posts" ? "" : "active"}`} onClick={() => {
                        if (select == "posts") {
                            setSelect("stats")
                        }    
                    }}>Stats</li>
                </ul>
            </div>
            <input 
              type="file"
              id="file-input"
              className="profile-pic-input"
              name="file"
              onChange={async (event) => {
                await changeProfilePicture(event)
            }}/>
            {select == "posts" ? <PostGrid posts={posts}></PostGrid> : <Stats/>}
        </div>
    )
}

export function Stats() {
    return (
        <div>Stats</div>
    )
}