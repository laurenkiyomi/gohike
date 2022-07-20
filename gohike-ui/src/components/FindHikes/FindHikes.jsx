import * as React from "react"
import "./FindHikes.css"
import SideBar from "./SideBar";
import axios from 'axios';
import GoogleMapReact from 'google-map-react';
import { Routes, Route, Link, useParams } from 'react-router-dom'

export default function FindHikes({ transparent, setTransparent, currUser }) {
    const params = useParams()
    const id = params.id
    const [selectedHike, setSelectedHike] = React.useState(null)
    const [center, setCenter] = React.useState({ lat: 37.4816056542292, lng: -122.17105672877193  })
    const [zoom, setZoom] = React.useState(11);
    const [searchInputResult, setSearchInputResult] = React.useState([])

    React.useEffect(async () => {
      if (transparent) {
        setTransparent(false)
      }

      if (id != undefined) {
        let data = await axios.get(`http://localhost:3001/trails/id/${id}`)
        setSearchInputResult(Array.from(data.data.trail))
        setCenter({ lat: data.data.trail[0].latitude, lng: data.data.trail[0].longitude })
      }
    }, [])

    return (
      <nav className="find-hikes" >
        <SideBar searchInputResult={searchInputResult} setSearchInputResult={setSearchInputResult} setCenter={setCenter} selectedHike={selectedHike} setSelectedHike={setSelectedHike} currUser={currUser}/>
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
                  lng={trail.longitude}
                  setCenter={setCenter}
                  setSelectedHike={setSelectedHike}
                  selectedHike={selectedHike}
                  trail={trail}/>
              )
            })}
          </GoogleMapReact>
        </div>
      </nav>
    )
  }

export function Marker({ lat, lng, setCenter, setSelectedHike, selectedHike, trail }) {

  function handleClick() {
    setCenter({ lat, lng })

    if (selectedHike != trail) {
      setSelectedHike(trail)
    } else {
      setSelectedHike(null)
    }
    
  }

  return (
    <div className="marker">
      <span className="material-icons md-48 marker-icon" onClick={handleClick}>add_location</span>
    </div>
  )
}
  