import * as React from "react"
import "./MyProfile.css"
import axios from 'axios'
import { Link } from 'react-router-dom';
import logo from "../Images/Logo.png"
import PostGrid from "../Feed/PostGrid"

export default function MyProfile({ transparent, setTransparent, currUser, setCurrUser }) {
    const [profileData, setProfileData] = React.useState(null)
    const [posts, setPosts] = React.useState(null)
    const [select, setSelect] = React.useState("posts")

     React.useEffect(async () => {
        if (transparent) {
          setTransparent(false)
        }

        // let data = await axios.get(`http://localhost:3001/user/${currUser.sessionToken}`)
        // setProfileData(data.data.user)

        // let data2 = await axios.get(`http://localhost:3001/user/posts/${currUser.sessionToken}`)
        // setPosts(data2.data.posts)
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
            {select == "posts" ? <PostGrid posts={posts}></PostGrid> : <Stats/>}
        </div>
    )
}

export function Stats() {
    return (
        <div>Stats</div>
    )
}