import * as React from "react"
import "./Feed.css"

export default function Feed({ transparent, setTransparent, currUser }) {
    React.useEffect(() => {
      if (transparent) {
        setTransparent(false)
      }
    }, [])

    return (
      <nav className="feed">
        <p>Feed</p>
      </nav>
    )
  }