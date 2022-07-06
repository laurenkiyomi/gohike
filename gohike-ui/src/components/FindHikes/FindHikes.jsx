import * as React from "react"
import "./FindHikes.css"

export default function FindHikes({ transparent, setTransparent, currUser }) {
    React.useEffect(() => {
      if (transparent) {
        setTransparent(false)
      }
    }, [])

    return (
      <nav className="find-hikes">
        <p>FindHikes</p>
      </nav>
    )
  }