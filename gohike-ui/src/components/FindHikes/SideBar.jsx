import * as React from "react"
import "./FindHikes.css"
import axios from 'axios';

export default function SideBar({ searchInputResult, setSearchInputResult, setCenter, selectedHike, setSelectedHike }) {
    return (
        <>
            <div className="side-bar">
                <SearchBar searchInputResult={searchInputResult} setSearchInputResult={setSearchInputResult} setCenter={setCenter} setSelectedHike={setSelectedHike} />
                <div>{(searchInputResult.length == 0) ? <div className="nothing-message">Nothing to Display</div> : 
                    (searchInputResult.map((hikeObject, index) => {
                        return (
                            <HikeCard key={index} hikeObject={hikeObject} setSelectedHike={setSelectedHike} />
                        )
                    }))
                }</div>
            </div>
            { selectedHike ? <HikePopout selectedHike={selectedHike} setSelectedHike={setSelectedHike} /> : ""}
        </>
    )
}

export function HikePopout({ selectedHike, setSelectedHike }) {
    return (
        <div className="hike-popout">
                <button className="close" onClick={() => {setSelectedHike(null)}}>x</button>
                {(selectedHike?.img == "") ? "" : 
                    <div className="hike-poput-img">
                        <img src={selectedHike?.img}/>
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

export function SearchBar({ searchInputResult, setSearchInputResult, setCenter, setSelectedHike}) {
    const [searchInput, setSearchInput] = React.useState('')
    const [spinner, setSpinner] = React.useState(false)

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

    return (
        <form onSubmit={handleSearch} className="hike-search-form">
            <input 
                className="hike-search-input" 
                autoComplete="off"
                type="text"
                placeholder="Search for a hike"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}>
            </input>
            {spinner ? <button className="hike-search-button">Loading</button> : <button className="hike-search-button material-icons md-48">search</button>}
        </form>
    )
}

export function HikeCard({ hikeObject, setSelectedHike }) {
    return (
        <div className="hike-card" >
            {(hikeObject.img == "") ? "" : 
                <div className="hike-card-img" >
                    <img src={hikeObject.img}/> 
                </div>
            }
            <span className="hike-type">{hikeObject.trail_type}</span>
            <span className="hike-name" 
                onClick={() => {setSelectedHike(hikeObject)}}>{hikeObject.name}
            </span>
            <span className="hike-location">{hikeObject.location}</span>
            <span className="hike-length-ascent">{`Length: ${hikeObject.length} | Ascent: ${hikeObject.ascent}`}</span> 
        </div>
    )
}