import * as React from "react"
import "./FindHikes.css"
import SideBar from "./SideBar";
import GoogleMapReact from 'google-map-react';

export default function FindHikes({ transparent, setTransparent, currUser }) {
    const [selectedHike, setSelectedHike] = React.useState(null)
    const [center, setCenter] = React.useState({ lat: 37.4816056542292, lng: -122.17105672877193  })
    const [zoom, setZoom] = React.useState(11);
    const [searchInputResult, setSearchInputResult] = React.useState([])

    React.useEffect(() => {
      if (transparent) {
        setTransparent(false)
      }
    }, [])

    return (
      <nav className="find-hikes" >
        <SideBar searchInputResult={searchInputResult} setSearchInputResult={setSearchInputResult} setCenter={setCenter} selectedHike={selectedHike} setSelectedHike={setSelectedHike} />
        <div className="map-div">
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyDEc_o7C5X1ljM7fq27LLr5QdZPfrQlQZA" }}
            center={center}
            defaultZoom={zoom}
          >
            {searchInputResult.map((trail, index) => {
              return (
                <Marker
                  key={index}
                  lat={trail.latitude}
                  lng={trail.longitude}/>
              )
            })}
          </GoogleMapReact>
        </div>
      </nav>
    )
  }

export function Marker(props) {
  return (
    <div className="marker">
      <span className="material-icons md-48">add_location</span>
    </div>
  )
}
  