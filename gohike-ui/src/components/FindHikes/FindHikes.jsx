import * as React from "react"
import "./FindHikes.css"
import SideBar from "./SideBar";
import GoogleMapReact from 'google-map-react';

export default function FindHikes({ transparent, setTransparent, currUser }) {
    const [center, setCenter] = React.useState({ lat: 11.0168, lng: 76.9558  })
    const [zoom, setZoom] = React.useState(11);
    const [searchInputResult, setSearchInputResult] = React.useState('')

    React.useEffect(() => {
      if (transparent) {
        setTransparent(false)
      }
    }, [])

    return (
      <nav className="find-hikes" >
        <SideBar searchInputResult={searchInputResult} setSearchInputResult={setSearchInputResult} />
        <div className="map-div">hi</div>
        {/* <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDEc_o7C5X1ljM7fq27LLr5QdZPfrQlQZA" }}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          <Marker 
            lat={11.0168}
            lng={76.9558}/>
        </GoogleMapReact> */}
      </nav>
    )
  }

export function Marker(props) {
  return (
    <div className="marker">
      <span className="material-icons md-48">push_pin</span>
    </div>
  )
}
  