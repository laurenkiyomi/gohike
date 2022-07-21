/**
 * @fileoverview This file implements the My Profile Page so that logged in users can view and edit their own profile.
 */
import * as React from "react"
import "./MyProfile.css"
import axios from 'axios'
import { Link } from 'react-router-dom';
import logo from "../Images/Logo.png"
import PostGrid from "../Feed/PostGrid"
import LoadingScreen from "../LoadingScreen/LoadingScreen";

export default function MyProfile({ transparent, setTransparent, currUser, setCurrUser }) {
    const EDIT_PROFILE_PIC_URL = "http://localhost:3001/user/profilePhoto"
    const EDIT_COVER_PIC_URL = "http://localhost:3001/user/coverPhoto"
    const [profileData, setProfileData] = React.useState(null)
    const [posts, setPosts] = React.useState(null)
    const [select, setSelect] = React.useState("posts")
    const [spinner, setSpinner] = React.useState(false)

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
          let base64String = _arrayBufferToBase64(arrayBuffer)
          base64String = "data:image/jpeg;base64," + base64String

          await axios.put(EDIT_PROFILE_PIC_URL, { sessionToken: currUser.sessionToken, picture: base64String })
        
          event.target.value = ""

          let data = await axios.get(`http://localhost:3001/user/${currUser.sessionToken}`)
          setProfileData(data.data.user)
          return
        } catch (err){  
            console.log(err)
            console.log("Failed to change profile picture.")
        }
      }

      const changeCoverPicture = async (event) => {  
        try {
          // Get array buffer from file
          const arrayBuffer = await event.target.files[0].arrayBuffer()
          // Convert the array to a base64 string
          let base64String = _arrayBufferToBase64(arrayBuffer)
          base64String = "data:image/jpeg;base64," + base64String

          await axios.put(EDIT_COVER_PIC_URL, { sessionToken: currUser.sessionToken, picture: base64String })
          event.target.value = ""

          let data = await axios.get(`http://localhost:3001/user/${currUser.sessionToken}`)
          setProfileData(data.data.user)
          return
        } catch (err){  
            console.log(err)
            console.log("Failed to change profile picture.")
        }
      }

      const fetchData = async () => {
        let data = await axios.get(`http://localhost:3001/user/${currUser.sessionToken}`)
        setProfileData(data.data.user)

        let data2 = await axios.get(`http://localhost:3001/user/posts/${currUser.sessionToken}`)
        setPosts(data2.data.posts)
      }

     React.useEffect(async () => {
        if (transparent) {
          setTransparent(false)
        }

        await fetchData()
        setSpinner(true)
    }, [])

    return (
        <div className="my-profile">
            <div className="my-profile-header">
                <h1>GOHIKE</h1>
                <img className="logo-img" src={logo}/>
            </div>
            {spinner ? 
                <ProfileBanner currUser={currUser} posts={posts} profileData={profileData} changeCoverPicture={changeCoverPicture} changeProfilePicture={changeProfilePicture} select={select} setSelect={setSelect}/> :
                <LoadingScreen />
            }
        </div>
    )
}

export function ProfileBanner({ currUser, posts, profileData, changeCoverPicture, changeProfilePicture, select, setSelect }) {
    if (profileData == null || posts == null) {
        return null
    }
    
    return (
        <>
            <div className="profile-banner">
                <div className="cover-pic-container">
                    <img className="cover-pic" src={profileData.coverPic}/>
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
                        await changeCoverPicture(event)
                }}/>
                <div className="profile-pic-container">
                    <img className="profile-pic" src={profileData.profilePic}/>
                </div>
                <h2 className="profile-name">{`${profileData.firstName} ${profileData.lastName}`}</h2>
                <p className="profile-friends">{`${profileData.friends == undefined ? "0" : profileData.friends.length} Friends`}</p>
                <label className="profile-pic-label" htmlFor="file-input1">
                    <img className="profile-pic-icon" src="https://i.pinimg.com/originals/e2/bc/2b/e2bc2b005d593253f62a4727d3da5d4f.png"/>
                </label>
                <input 
                    type="file"
                    id="file-input1"
                    className="profile-pic-input"
                    name="file"
                    onChange={async (event) => {
                        await changeProfilePicture(event)
                }}/>
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
            {select == "stats" ? <Stats/> : <PostGrid posts={posts} currUser={currUser}></PostGrid>}
        </>
    )
}

export function Stats() {
    return (
        <div>Stats</div>
    )
}