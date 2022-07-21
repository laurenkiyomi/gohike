/**
 * @fileoverview This file implements the Post Grid component to show posts 
 * from other users. This component is rendered inside the Feed Page.
 */
import * as React from "react"
import "./Feed.css"
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Select from 'react-select';

/**
 * Holds all the rendered posts
 * 
 * @param {Array<number>} posts Id's of posts to render
 * @param {{username: string, sessionToken: string, firstName: string, 
 * lastName: string}} currUser Holds info on current user from local storage
 * @returns Post Grid component
 */
export default function PostGrid({ posts, currUser }) {
    // Don't return until posts are set
    if (posts == null) {
        return null
    }

    // Return React component
    return (
        <div className="post-grid">
            {posts.length == 0 ? 
                "No posts to display" :
                posts.map((postId, index) => {
                    /**
                     * URL for put request to like a post
                     * @type {string}
                     */
                    const LIKE_URL = "http://localhost:3001/posts/like"
                    /**
                     * URL for put request to unlike a post
                     * @type {string}
                     */
                    const UNLIKE_URL = "http://localhost:3001/posts/unlike"
                    /**
                     * URL for get request to get info on a post
                     * @type {string}
                     */
                    const GET_POST_URL = `http://localhost:3001/posts/${postId}`
                    /**
                     * Holds info on post corresponding to postId
                     * @type {{ username: string, trailName: string, hikeId: 
                     * number, caption: string, createdAt: string, picture: 
                     * string, likes: Array<string> }}
                     */
                    const [post, setPost] = React.useState(null)
                    /**
                     * Holds the likes of a post
                     * @type {Array<string>}
                     */
                    const [likes, setLikes] = React.useState()
                    /**
                     * Holds whether or not curr user liked corresponding post
                     * @type {boolean}
                     */
                    const [liked, setLiked] = React.useState()

                    /**
                     * Makes put request to like post
                     */
                    async function likePost() {
                        await axios.put(LIKE_URL, { username: currUser.username,
                            postId })

                        let data = await axios.get(GET_POST_URL, { 
                            sessionToken: currUser.sessionToken })
                        setLikes(data.data.post.likes)
                        setLiked(true)
                    }

                    /**
                     * Makes put request to unlike post
                     */
                    async function unlikePost() {
                        await axios.put(UNLIKE_URL, { 
                            username: currUser.username, postId })

                        let data = await axios.get(GET_POST_URL, { 
                            sessionToken: currUser.sessionToken })
                        setLikes(data.data.post.likes)
                        setLiked(false)
                    }


                    /**
                     * Fetches post data on every render
                     */
                    React.useEffect(async() => {
                        // Fetch post data
                        let data = await axios.get(GET_POST_URL, { 
                            sessionToken: currUser.sessionToken })
                        setPost(data.data.post)

                        // Set state of liked
                        setLiked(false)
                        for (let i = 0; i < data.data.post.likes.length; i++) {
                            if (data.data.post.likes[i] == currUser.username) {
                                setLiked(true) 
                                break
                            }
                        }
                    }, [])

                    // Return React component
                    return (
                        <PostCard
                            key={index}
                            post={post}
                            likePost={likePost}
                            unlikePost={unlikePost}
                            likes={likes}
                            setLikes={setLikes}
                            liked={liked}/>
                    )
                })
            }
        </div>
    )
}

/**
 * 
 * @param {Array<number>} posts
 * @param {function} likePost Onclick handler for like button
 * @param {function} unlikePost Onclick handler for unlike button
 * @param {Array<string>} likes
 * @param {function} setLikes
 * @param {boolean} liked
 * @returns 
 */
export function PostCard({post, likePost, unlikePost, likes, setLikes, liked}) {
    // Don't return until post data is set
    if (post == null) {
        return null
    }

    /**
     * Used when parsing createdAt string
     * @type {Array<string>}
     */
    const months = [ "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December" ]
    /**
     * @type {string}
     */
    const username = post.username
    /**
     * @type {string}
     */
    const trailName = post.trailName
    /**
     * @type {number}
     */
    const hikeId = post.hikeId
    /**
     * @type {string}
     */
    const caption = post.caption
    /**
     * @type {string}
     */
    const createdAt = post.createdAt
    /**
     * @type {string}
     */
    const img = post.picture
    /**
      * Navigation tool
      * @type {hook}
      */
    const history = useNavigate()

    /**
     * Sets post's likes on every render
     */
    React.useEffect(() => {
        setLikes(post.likes)
    }, [])

    // Return React component
    return (
        <div className="post-card">
            <h1 
                className="post-trail" 
                onClick={() => {
                    history(`/find-hikes/${hikeId}`)
                }}>
                {trailName}
            </h1>
            <h2 className="post-user">
                <span onClick={() => {
                    history(`/view-profile/${username}`)
                    }}>{`${username}`}
                </span>
                <span>{` • ${months[parseInt(createdAt?.substring(5,7)) - 1]} 
                    ${createdAt?.substring(8,10)}, ${createdAt?.substring(0,4)}`
                }</span>
            </h2>
            <div className="post-card-section"> 
                <div className="post-pic-container">
                    <img className="post-pic" src={img}/>
                </div>
                <div className="post-right-section">
                    <p className="post-caption">{caption}</p>
                    <div className="post-likes">
                        {liked ?  
                            <button onClick={unlikePost}>Unlike</button> : 
                            <button onClick={likePost}>Like</button>
                        }
                        {`${likes?.length}`}
                    </div>
                </div>
            </div>
        </div>
    )
}