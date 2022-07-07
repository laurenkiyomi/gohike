import * as React from "react"
import "./FindHikes.css"

export default function SideBar({ searchInputResult, setSearchInputResult }) {
    return (
        <div className="side-bar">
            SIDEBAR
            <SearchBar searchInputResult={searchInputResult} setSearchInputResult={setSearchInputResult}/>
        </div>
    )
}

export function SearchBar({ searchInputResult, setSearchInputResult}) {
    const [searchInput, setSearchInput] = React.useState('')

    const handleSearch = (event) => {
        event.preventDefault()
        setSearchInputResult(searchInput)
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
            <button className="hike-search-button">Search</button>
        </form>
    )
}