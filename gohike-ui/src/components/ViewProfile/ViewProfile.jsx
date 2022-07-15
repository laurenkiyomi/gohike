import * as React from "react"
import "./ViewProfile.css"
import axios from 'axios'
import { Link, useParams } from 'react-router-dom';
import logo from "../Images/Logo.png"
import PostGrid from "../Feed/PostGrid"

export default function ViewProfile({ transparent, setTransparent, currUser, setCurrUser }) {
    const ADD_FRIEND_URL = "http://localhost:3001/user/addFriend"
    const DECLINE_FRIEND_URL = "http://localhost:3001/user/declineFriend"
    const ACCEPT_FRIEND_URL = "http://localhost:3001/user/acceptFriend"
    const [profileData, setProfileData] = React.useState(null)
    const [posts, setPosts] = React.useState(null)
    const [select, setSelect] = React.useState("posts")
    const [friendStatus, setFriendStatus] = React.useState()
    const params = useParams()
    const username = params.username

    const addFriend = async() => {
        try {
            await axios.put(ADD_FRIEND_URL, { sessionToken: currUser.sessionToken, username: profileData.username })
            setFriendStatus("sent")
        } catch {
            console.log("Failed to add friend")
        }
    }

    const declineFriend = async() => {
        try {
            await axios.put(DECLINE_FRIEND_URL, { sessionToken: currUser.sessionToken, username: profileData.username })
            setFriendStatus("no")
        } catch {
            console.log("Failed to decline friend")
        }
    }

    const acceptFriend = async() => {
        try {
            await axios.put(ACCEPT_FRIEND_URL, { sessionToken: currUser.sessionToken, username: profileData.username })
            setFriendStatus("yes")
        } catch {
            console.log("Failed to accept friend")
        }
    }



    React.useEffect(async () => {
        if (transparent) {
          setTransparent(false)
        }

        // Get profile data
        let data = await axios.get(`http://localhost:3001/user/view/${username}`)
        setProfileData(data.data.user)

        // Get user's posts
        let data2 = await axios.get(`http://localhost:3001/user/view/posts/${username}`)
        setPosts(data2.data.posts)
        console.log(data2.data.posts)
        
        // Set friend status
        if (data.data.user.sentFriendRequests != null && data.data.user.sentFriendRequests != undefined) {
            for (let i = 0; i < data.data.user.sentFriendRequests.length; i++) {
                if (data.data.user.sentFriendRequests[i] == currUser.username) {
                    setFriendStatus("incoming")
                    return
                }
            }
        } 
        
        if (data.data.user.incomingFriendRequests != null && data.data.user.incomingFriendRequests != undefined) {
            for (let i = 0; i < data.data.user.incomingFriendRequests.length; i++) {    
                if (data.data.user.incomingFriendRequests[i] == currUser.username) {
                    setFriendStatus("sent")
                    return
                }
            }
        } 
        
        setFriendStatus("no")
        if (data.data.user.friends != undefined && data.data.user.friends != null) {
            for (let i = 0; i < data.data.user.friends.length; i++) {
                if (data.data.user.friends[i] == currUser.username) {
                    setFriendStatus("yes");
                    return;
                } 
            }
        }
    }, [])

    if (profileData == null || posts == null) {
        return null
    }

    return (
        <div className="view-profile">
            <div className="view-profile-header">
                <h1>GOHIKE</h1>
                <img className="logo-img" src={logo}/>
            </div>
            <div className="view-profile-banner">
                <div className="view-cover-pic-container">
                    <img className="view-cover-pic" src={profileData.coverPic}/>
                </div>
                <div className="view-profile-pic-container">
                    <img className="view-profile-pic" src={profileData.profilePic}/>
                </div>
                {friendStatus == "no" ? 
                    <button className="friend-button" onClick={addFriend}>Add Friend +</button> : 
                    friendStatus == "yes" ? 
                    <button className="friend-button">Your Friend</button> : 
                    friendStatus == "incoming" ? <button className="friend-button" onClick={acceptFriend}>Accept Friend Request</button> : 
                    <button className="friend-button">Pending</button>}
                <h2 className="view-profile-name">{`${profileData.firstName} ${profileData.lastName}`}</h2>
                <p className="view-profile-friends">{`${profileData.friends == undefined ? "0" : profileData.friends.length} Friends`}</p>
                <div className="line"></div>
                <ul className="view-profile-nav">
                    <li className={`view-profile-posts-button ${select != "posts" ? "" : "active"}`} onClick={() => {
                        if (select != "posts") {
                            setSelect("posts")
                        }    
                    }}>Posts</li>
                    <li className={`view-profile-about-button ${select == "posts" ? "" : "active"}`} onClick={() => {
                        if (select == "posts") {
                            setSelect("about")
                        }    
                    }}>About</li>
                </ul>
            </div>
            {select == "posts" ? <PostGrid posts={posts} currUser={currUser}></PostGrid> : <About/>}
        </div>
    )
}

export function About() {
    return (
        <div>About</div>
    )
}