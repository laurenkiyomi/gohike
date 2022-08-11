/**
 * @fileoverview This file implements the Find Friends component so users can 
 * find other users to add as friends.
 */
import * as React from "react";
import "./FindFriends.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


/**
 * Renders Find Friends page
 *
 * @param {boolean} transparent State var holding state of Navbar background
 * @param {function} setTransparent Sets the boolean in transparent
 * @param {{username: string, sessionToken: string}} currUser Current user info
 * @returns Find Friends component
 */
export default function FindFriends({ transparent, setTransparent, currUser }) {
    React.useEffect(async () => {
        if (transparent) {
          setTransparent(false);
        }

        await axios.get(`https://gohike-api.herokuapp.com/user`).then((data) => {
            setUsers(data.data.users)
        })
    })

    /**
     * Holds usernames of all users in database
     * @type {Array<string>}
    */
    const [users, setUsers] = React.useState(null)

    // Do not return until users are set
    if (users == null) {
        return null
    }

    return (
        <div className="find-friends">
            <div className="users">
                {users.map((username) => {
                    return (
                        <User key={username} username={username}/>
                    )
                })}
            </div>
        </div>
    )
}

export function User({ username }) {
    /**
     * Navigation tool
     * @type {hook}
     */
    const history = useNavigate();

    /**
     * Navgiate to a user's profile to view
     */
    const clickUser = () => {
        history(`/view-profile/${username}`)
    }

    return (
        <div className="user" onClick={clickUser}>{username}</div>
    )
}