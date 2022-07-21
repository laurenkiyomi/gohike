/**
 * @fileoverview This file implements the Side Bar component inside the Find Hikes page so that users can look up hikes and see results from their searches.
 */
import * as React from "react"
import "./FindHikes.css"
import axios from 'axios';
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function SideBar({ searchInputResult, setSearchInputResult, setCenter, selectedHike, setSelectedHike, currUser }) {
    const [spinner, setSpinner] = React.useState(false)

    return (
        <>
            <div className="side-bar">
                <SearchBar searchInputResult={searchInputResult} setSearchInputResult={setSearchInputResult} setCenter={setCenter} setSelectedHike={setSelectedHike} currUser={currUser} setSpinner={setSpinner} />
                <div>{(!spinner) ? (searchInputResult.length == 0) ? <div className="nothing-message">Nothing to Display</div> : 
                    <SearchResults searchInputResult={searchInputResult} setSelectedHike={setSelectedHike} currUser={currUser} setCenter={setCenter} /> : 
                    <LoadingScreen/>
                }</div>
            </div>
            { selectedHike ? <HikePopout selectedHike={selectedHike} setSelectedHike={setSelectedHike} /> : ""}
        </>
    )
}

export function SearchResults({ searchInputResult, setSelectedHike, currUser, setCenter }) {
    return (
        <>
            {(searchInputResult.map((hikeObject, index) => {
                        return (
                            <HikeCard key={index} hikeObject={hikeObject} setSelectedHike={setSelectedHike} currUser={currUser} setCenter={setCenter}/>
                        )
                    }))}
        </>
    )
}

export function HikePopout({ selectedHike, setSelectedHike }) {
    const [images, setImages] = React.useState(null)

    React.useEffect(async () => {
        let data = await axios.get(`http://localhost:3001/trails/hike-pictures/${selectedHike.id}`)
        if (data.data.pictures == [] && selectedHike.img == "") {
            setImages([])
        } else if (selectedHike.img == "") {
            setImages(data.data.pictures)
        } else if (data.data.pictures == []) {
            setImages([selectedHike.img])
        } else {
            setImages([selectedHike.img, ...data.data.pictures])
        }
    }, [selectedHike])

    if (images == null) {
        return null
    }

    return (
        <div className="hike-popout">
                <button className="close" onClick={() => {setSelectedHike(null)}}>x</button>
                {(images.length == 0) ? "" : 
                    <div className="hike-popout-img">
                        <Carousel autoPlay useKeyboardArrows infiniteLoop className="carousel">
                            {images.map((img, index) => {
                                return (
                                    <div key={index}>
                                        <img className="carousel-img" src={img} />
                                    </div>
                                )
                            })}
                        </Carousel>
                    </div>
                }
                <span className="hike-type">{selectedHike?.trail_type}</span>
                <h1>{selectedHike?.name}</h1>
                <span className="hike-name">{selectedHike?.name}</span>
                <span className="hike-location">{selectedHike?.location}</span>
                <span className="hike-length-ascent">{`Length: ${selectedHike?.length} | Ascent: ${selectedHike?.ascent}`}</span>
                <span className="hike-high-low">{`High: ${selectedHike?.high} | Low: ${selectedHike?.low}`}</span>
                <span className="hike-condition">{`Trail Condition: ${selectedHike?.conditionStatus}`}</span>
                <p>{`"${selectedHike?.summary}"`}</p> 
        </div>
    )
}

export function SearchBar({ searchInputResult, setSearchInputResult, setCenter, setSelectedHike, currUser, setSpinner }) {
    const [searchInput, setSearchInput] = React.useState('')
    const [select, setSelect] = React.useState("all")

    async function handleSearch(event) {
        event.preventDefault()
        setSpinner(true)
        await axios.get(`http://localhost:3001/trails/${searchInput.replaceAll(" ", "+")}`).then((data) => {
            setSearchInputResult(data.data.trail)
            setSelectedHike(null)
            setCenter({ lat: data?.data?.trail[0]?.latitude, lng: data?.data?.trail[0]?.longitude  })
            setSpinner(false)
        })
    }

    async function handleSaved() {
        setSelect("saved")
        setSpinner(true)
        await axios.get(`http://localhost:3001/user/saved/${currUser.username}`).then((data) => {
            setSearchInputResult(data.data.saved)
            setSelectedHike(null)
            setCenter({ lat: data?.data?.saved[0]?.latitude, lng: data?.data?.saved[0]?.longitude  })
            setSpinner(false)
        })
    }

    async function handleCompleted() {
        setSelect("completed")
        setSpinner(true)
        await axios.get(`http://localhost:3001/user/completed/${currUser.username}`).then((data) => {
            setSearchInputResult(data.data.completed)
            setSelectedHike(null)
            setCenter({ lat: data?.data?.completed[0]?.latitude, lng: data?.data?.completed[0]?.longitude  })
            setSpinner(false)
        }).catch((err) => {
            console.log(err)
        })
    }

    async function handleAll() {
        setSelect("all")
        setSearchInputResult([])
        setSelectedHike(null)
        setSearchInput("")
        setCenter({ lat: 37.4816056542292, lng: -122.17105672877193  })
    }

    return (
        <>
            <ul className="side-bar-nav">
                <li className={`side-bar-all-button ${select == "all" ? "active" : ""}`} onClick={handleAll}>All</li>
                <li className={`side-bar-saved-button ${select == "saved" ? "active" : ""}`} onClick={handleSaved}>Saved</li>
                <li className={`side-bar-completed-button ${select == "completed" ? "active" : ""}`} onClick={handleCompleted}>Completed</li>
            </ul>
            {select == "all" ? 
                <form onSubmit={handleSearch} className="hike-search-form">
                    <input 
                        className="hike-search-input" 
                        autoComplete="off"
                        type="text"
                        placeholder="Search for a hike"
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value)}>
                    </input>
                    <button className="hike-search-button material-icons md-48">search</button>
                </form> : 
                ""
            }
        </>
    )
}

export function HikeCard({ hikeObject, setSelectedHike, currUser, setCenter }) {
    const [saved, setSaved] = React.useState(null)
    const [completed, setCompleted] = React.useState(null)
    const COMPLETE_HIKE_URL = "http://localhost:3001/user/complete"
    const UNCOMPLETE_HIKE_URL = "http://localhost:3001/user/uncomplete"
    const SAVE_HIKE_URL = "http://localhost:3001/user/save"
    const UNSAVE_HIKE_URL = "http://localhost:3001/user/unsave"
    
    React.useEffect(async () => {
        const data = await axios.get(`http://localhost:3001/user/saved-completed/${currUser.username}`)

        setSaved(data.data.saved)
        setCompleted(data.data.completed)
    }, [])

    
    async function saveHike() {
        try {
            let data = await axios.put(SAVE_HIKE_URL, { hikeId: hikeObject.id, username: currUser.username })
            setSaved(data.data.saved)
        } catch {
            console.log("Failed to save hike")
        }
    }

    async function unsaveHike() {
        try {
            let data = await axios.put(UNSAVE_HIKE_URL, { hikeId: hikeObject.id, username: currUser.username })
            setSaved(data.data.saved)
        } catch {
            console.log("Failed to unsave hike")
        }
    }

    async function completeHike() {
        try {
            let data = await axios.put(COMPLETE_HIKE_URL, { hikeId: hikeObject.id, username: currUser.username })
            setCompleted(data.data.completed)
        } catch {
            console.log("Failed to complete hike")
        }
    }

    async function uncompleteHike() {
        try {
            let data = await axios.put(UNCOMPLETE_HIKE_URL, { hikeId: hikeObject.id, username: currUser.username })
            setCompleted(data.data.completed)
        } catch {
            console.log("Failed to complete hike")
        }
    }

    if (saved == null || completed == null) {
        return null
    }

    return (
        <div className="hike-card" >
            {(hikeObject.img == "") ? "" : 
                <div className="hike-card-img" >
                    <img src={hikeObject.img}/> 
                </div>
            }
            <span className="hike-type">{hikeObject.trail_type}</span>
            <span className="hike-title"> 
                <p className = "hike-name" onClick={() => {
                    setSelectedHike(hikeObject)
                    setCenter({ lng: hikeObject.longitude, lat: hikeObject.latitude })
                }}>{hikeObject.name}</p>
                {saved.includes(hikeObject.id) ? 
                <button onClick={unsaveHike} className="hike-saved material-icons md-48">bookmark</button> : 
                <button onClick={saveHike} className="hike-not-saved material-icons md-48">bookmark</button>
            }
            {completed.includes(hikeObject.id) ? 
                <button onClick={uncompleteHike} className="hike-completed material-icons md-48">done_outline</button> : 
                <button onClick={completeHike} className="hike-not-completed material-icons md-48">done_outline</button>
            }
            </span>
            <span className="hike-location">{hikeObject.location}</span>
            <span className="hike-length-ascent">{`Length: ${hikeObject.length} | Ascent: ${hikeObject.ascent}`}</span> 
        </div>
    )
}