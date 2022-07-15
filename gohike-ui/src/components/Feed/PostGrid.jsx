import * as React from "react"
import "./Feed.css"
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import Select from 'react-select';

export default function PostGrid({ posts, currUser }) {
    if (posts == null) {
        return null
    }

    return (
        <div className="post-grid">
            {posts.length == 0 ? "No posts to display" :
                posts.map((postId, index) => {
                    const LIKE_URL = "http://localhost:3001/posts/like"
                    const UNLIKE_URL = "http://localhost:3001/posts/unlike"
                    const [post, setPost] = React.useState(null)
                    const [likes, setLikes] = React.useState()
                    const [liked, setLiked] = React.useState()
                    const GET_POST_URL = `http://localhost:3001/posts/${postId}`

                    async function likePost() {
                        await axios.put(LIKE_URL, { username: currUser.username, postId })

                        let data = await axios.get(GET_POST_URL, { sessionToken: currUser.sessionToken })
                        setLikes(data.data.post.likes)
                        setLiked(true)
                    }

                    async function unlikePost() {
                        await axios.put(UNLIKE_URL, { username: currUser.username, postId })

                        let data = await axios.get(GET_POST_URL, { sessionToken: currUser.sessionToken })
                        setLikes(data.data.post.likes)
                        setLiked(false)
                    }

                    React.useEffect(async() => {
                        let data = await axios.get(GET_POST_URL, { sessionToken: currUser.sessionToken })
                        setPost(data.data.post)

                        setLiked(false)
                        for (let i = 0; i < data.data.post.likes.length; i++) {
                            if (data.data.post.likes[i] == currUser.username) {
                                setLiked(true) 
                                break
                            }
                        }
                    }, [])

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

export function PostCard({ post, likePost, unlikePost, likes, setLikes, liked }) {
    if (post == null) {
        return null
    }

    const months = [ "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December" ]
    const username = post.username
    const trailName = post.trailName
    const hikeId = post.hikeId
    const caption = post.caption
    const createdAt = post.createdAt
    const img = post.picture
    const history = useNavigate()

    React.useEffect(() => {
        setLikes(post.likes)
    }, [])

    return (
        <div className="post-card">
            <h1 className="post-trail" onClick={() => {
                    history(`/find-hikes/${hikeId}`)
                }}>
                {trailName}
            </h1>
            <h2 className="post-user">
                <span onClick={() => {
                    history(`/view-profile/${username}`)
                }}>{`${username}`}</span>
                <span>{` • ${months[parseInt(createdAt?.substring(5,7)) - 1]} ${createdAt?.substring(8,10)}, ${createdAt?.substring(0,4)}`}</span>
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