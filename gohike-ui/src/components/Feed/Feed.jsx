import * as React from "react"
import "./Feed.css"
import { Link, useNavigate } from 'react-router-dom';

export default function Feed({ transparent, setTransparent, currUser }) {
    React.useEffect(() => {
      if (transparent) {
        setTransparent(false)
      }
    }, [])

    return (
      <nav className="feed">
        <a href="https://goo.gl/maps/gHGcWQDBqzR2">Link</a>
      </nav>
    )
  }