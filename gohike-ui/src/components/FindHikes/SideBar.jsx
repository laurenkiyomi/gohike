/**
 * @fileoverview This file implements the Side Bar component inside the Find
 * Hikes page so that users can look up hikes and see results from their
 * searches.
 */
import * as React from "react";
import "./FindHikes.css";
import axios from "axios";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import io from "socket.io-client";

// Set up socket
let ENDPOINT = "https://gohike-api.herokuapp.com";
let socket = io(ENDPOINT);

/**
 * Renders search bar and results of search
 *
 * @param {Array<hike>} searchInputResult Hikes pertaining to search result
 * @param {function} setSearchInputResult
 * @param {function} setCenter Sets center of Google Map
 * @param {hike} selectedHike
 * @param {function} setSelectedHike
 * @param {{username: string, sessionToken: string, firstName: string,
 * lastName: string}} currUser Holds info on current user from local storage
 * @returns Side Bar component
 */
export default function SideBar({
  searchInputResult,
  setSearchInputResult,
  setCenter,
  selectedHike,
  setSelectedHike,
  currUser,
}) {
  /**
   * State var that sets whether or not to render loading state when
   * fetching data
   * @type {boolean}
   */
  const [spinner, setSpinner] = React.useState(false);

  // Return React component
  return (
    <>
      <div className="side-bar">
        <SearchBar
          searchInputResult={searchInputResult}
          setSearchInputResult={setSearchInputResult}
          setCenter={setCenter}
          setSelectedHike={setSelectedHike}
          currUser={currUser}
          setSpinner={setSpinner}
        />
        <div>
          {!spinner ? (
            searchInputResult.length == 0 ? (
              <div className="nothing-message">Nothing to Display</div>
            ) : (
              <SearchResults
                searchInputResult={searchInputResult}
                setSelectedHike={setSelectedHike}
                currUser={currUser}
                setCenter={setCenter}
              />
            )
          ) : (
            <LoadingScreen />
          )}
        </div>
      </div>
      {selectedHike ? (
        <HikePopout
          selectedHike={selectedHike}
          setSelectedHike={setSelectedHike}
          username={currUser.username}
        />
      ) : (
        ""
      )}
    </>
  );
}

/**
 * Renders Hike Card for each hike in searchInputResult
 *
 * @param {Array<hike>} searchInputResult Hikes pertaining to search result
 * @param {function} setSelectedHike
 * @param {{username: string, sessionToken: string, firstName: string,
 * lastName: string}} currUser Holds info on current user from local storage
 * @param {function} setCenter Sets center of Google Map
 * @returns Search Results component
 */
export function SearchResults({
  searchInputResult,
  setSelectedHike,
  currUser,
  setCenter,
}) {
  // Return React component
  return (
    <>
      {searchInputResult.map((hikeObject, index) => {
        return (
          <HikeCard
            key={index}
            hikeObject={hikeObject}
            setSelectedHike={setSelectedHike}
            currUser={currUser}
            setCenter={setCenter}
          />
        );
      })}
    </>
  );
}

/**
 * Rendered on the click of a hike to show more details
 *
 * @param {number} selectedHike Id of selected hike
 * @param {function} setSelectedHike
 * @param {string} username Of current user
 * @returns Hike Popout component
 */
export function HikePopout({ selectedHike, setSelectedHike, username }) {
  /**
   * State var that holds all images posted about hike in order of most to
   * least liked
   * @type {Array<string>} Contains image url's
   */
  const [images, setImages] = React.useState(null);
  /**
   * State var that holds the comment on change of the input
   * @type {string}
   */
  const [comment, setComment] = React.useState("");
  /**
   * State var that holds the number of comments
   * @type {number}
   */
  const [numComments, setNum] = React.useState(selectedHike.comments.length);
  /**
   * State var that holds the comments
   * @type {Array<{username: string, comment: string}>}
   */
  const [comments, setComments] = React.useState(selectedHike.comments);

  /**
   * Handles submit of comment form
   */
  async function leaveComment() {
    // Return without doing anything if comment is empty
    if (comment == "") {
      return;
    }

    await axios
      .put(`https://gohike-api.herokuapp.com/trails/comment/${selectedHike.id}`, {
        username,
        comment,
      })
      .then((data) => {
        setComment("");
        setNum((old) => old + 1);
        socket.emit("newcomment");
      });
  }

  /**
   * Rerender comments every time a new one is added
   */
  React.useEffect(async () => {
    // Fetch data
    let data = await axios.get(
      `https://gohike-api.herokuapp.com/trails/id/${selectedHike?.id}`
    );
    setComments(data.data.trail[0].comments);
  }, [numComments]);

  /**
   * Sets images state variable on every render
   */
  React.useEffect(async () => {
    let data = await axios.get(
      `https://gohike-api.herokuapp.com/trails/hike-pictures/${selectedHike.id}`
    );
    if (data.data.pictures == [] && selectedHike.img == "") {
      setImages([]);
    } else if (selectedHike.img == "") {
      setImages(data.data.pictures);
    } else if (data.data.pictures == []) {
      setImages([selectedHike.img]);
    } else {
      setImages([selectedHike.img, ...data.data.pictures]);
    }
  }, [selectedHike]);

  // Don't return unless images have been set
  if (images == null) {
    return null;
  }

  // Listen for new comment created by another user
  socket.on("updatecomments", async () => {
    // Increment numComments
    // This triggers comments to be refetched and rerendered
    setNum((old) => old + 1)
  });

  // Return React component
  return (
    <div className="hike-popout">
      <button
        className="close"
        onClick={() => {
          setSelectedHike(null);
        }}
      >
        x
      </button>
      {images.length == 0 ? (
        ""
      ) : (
        <div className="hike-popout-img">
          <Carousel
            autoPlay
            useKeyboardArrows
            infiniteLoop
            className="carousel"
          >
            {images.map((img, index) => {
              return (
                <div key={index}>
                  <img className="carousel-img" src={img} />
                </div>
              );
            })}
          </Carousel>
        </div>
      )}
      <span className="hike-type">{selectedHike?.trail_type}</span>
      <h1>{selectedHike?.name}</h1>
      <span className="hike-name">{selectedHike?.name}</span>
      <span className="hike-location">{selectedHike?.location}</span>
      <span className="hike-length-ascent">
        {`Length: ${selectedHike?.length} | 
                    Ascent: ${selectedHike?.ascent}`}
      </span>
      <span className="hike-high-low">
        {`High: ${selectedHike?.high} | 
                    Low: ${selectedHike?.low}`}
      </span>
      <span className="hike-condition">
        {`Trail Condition: ${selectedHike?.conditionStatus}`}
      </span>
      <p>{`"${selectedHike?.summary}"`}</p>
      <div className="comment-section">
        <p>{`Comments • ${numComments}`}</p>
        <div className="comments">
          {comments.length == 0 ? (
            <span className="no-comments">No comments</span>
          ) : (
            comments.map((comment, index) => {
              return (
                <span key={index} className="comment">
                  <span className="name">{`${comment.username}:`}</span>
                  <span className="writing">{comment.comment}</span>
                </span>
              );
            })
          )}
        </div>
      </div>
      <div className="comment-form">
        <input
          className="comment-input"
          autoComplete="off"
          type="text"
          placeholder="Leave a comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        ></input>
        <button className="comment-button" onClick={leaveComment}>
          Submit
        </button>
      </div>
    </div>
  );
}

/**
 * Form for search bar
 *
 * @param {function} setSearchInputResult
 * @param {function} setCenter Sets center of Google Map
 * @param {function} setSelectedHike
 * @param {{username: string, sessionToken: string, firstName: string,
 * lastName: string}} currUser Holds info on current user from local storage
 * @param {function} setSpinner
 * @returns Search Bar component
 */
export function SearchBar({
  setSearchInputResult,
  setCenter,
  setSelectedHike,
  currUser,
  setSpinner,
}) {
  /**
   * State var that holds value of search
   * @type {string}
   */
  const [searchInput, setSearchInput] = React.useState("");
  /**
   * State var that is used in filtering side bar results
   * @type {string}
   */
  const [select, setSelect] = React.useState("all");

  /**
   * Fetches results on search submit
   * @param {event} event Form submit result
   */
  async function handleSearch(event) {
    event.preventDefault();
    setSpinner(true);
    await axios
      .get(`https://gohike-api.herokuapp.com/trails/${searchInput.replaceAll(" ", "+")}`)
      .then((data) => {
        setSearchInputResult(data.data.trail);
        setSelectedHike(null);
        if (data?.data?.trail[0] != undefined) {
          setCenter({
            lat: data?.data?.trail[0]?.latitude,
            lng: data?.data?.trail[0]?.longitude,
          });
        } else {
          setCenter({ lat: 37.4816056542292, lng: -122.17105672877193 });
        }
        setSpinner(false);
      });
  }

  /**
   * Filters search results for user's saved hikes
   */
  async function handleSaved() {
    setSelect("saved");
    setSpinner(true);
    // Fetches saved hikes
    await axios
      .get(`https://gohike-api.herokuapp.com/user/saved/${currUser.username}`)
      .then((data) => {
        setSearchInputResult(data.data.saved);
        setSelectedHike(null);
        if (data?.data?.saved[0] != undefined) {
          setCenter({
            lat: data?.data?.saved[0]?.latitude,
            lng: data?.data?.saved[0]?.longitude,
          });
        } else {
          setCenter({ lat: 37.4816056542292, lng: -122.17105672877193 });
        }
        setSpinner(false);
      });
  }

  /**
   * Filters search results for user's completed hikes
   */
  async function handleCompleted() {
    setSelect("completed");
    setSpinner(true);
    // Fetches completed hikes
    await axios
      .get(`https://gohike-api.herokuapp.com/user/completed/${currUser.username}`)
      .then((data) => {
        setSearchInputResult(data.data.completed);
        setSelectedHike(null);
        if (data?.data?.completed[0] != undefined) {
          setCenter({
            lat: data?.data?.completed[0]?.latitude,
            lng: data?.data?.completed[0]?.longitude,
          });
        } else {
          setCenter({ lat: 37.4816056542292, lng: -122.17105672877193 });
        }
        setSpinner(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * Filters search results for hikes near the user. Displays nothing if
   * user's location is not available
   */
  async function handleNearMe() {
    setSelect("near-me");
    // Only get hikes near user if location is available
    if (navigator.geolocation) {
      setSpinner(true);

      // Get user location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Fetches completed hikes
          await axios
            .get(
              `https://gohike-api.herokuapp.com/trails/near-me/lat/
                    ${position.coords.latitude}/lng/${position.coords.longitude}
                    `
            )
            .then((data) => {
              setSearchInputResult(data.data.trails);
              setSelectedHike(null);

              // Set center to current location if no hikes to display
              if (data?.data?.trails[0] != undefined) {
                setCenter({
                  lat: data?.data?.trails[0]?.latitude,
                  lng: data?.data?.trails[0]?.longitude,
                });
              } else {
                setCenter({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                });
              }

              setSpinner(false);
            })
            .catch((err) => {
              console.log(err);
            });
        },
        () => {
          // Getting location fails
          setSpinner(false);
          setSearchInputResult([]);
          setSelectedHike(null);
          setCenter({ lat: 37.4816056542292, lng: -122.17105672877193 });
          alert("Unable to retrieve your location");
        }
      );
    } else {
      // Browser does not support geolocation
      alert("Your browser does not support geolocation");
      setSearchInputResult([]);
      setSelectedHike(null);
      setCenter({ lat: 37.4816056542292, lng: -122.17105672877193 });
    }
  }

  /**
   * Filters search results for any hike containing search input
   */
  async function handleAll() {
    setSelect("all");
    setSearchInputResult([]);
    setSelectedHike(null);
    setSearchInput("");
    setCenter({ lat: 37.4816056542292, lng: -122.17105672877193 });
  }

  // Return React component
  return (
    <>
      <ul className="side-bar-nav">
        <li
          className={`side-bar-all-button 
                    ${select == "all" ? "active" : ""}`}
          onClick={handleAll}
        >
          All
        </li>
        <li
          className={`side-bar-saved-button 
                    ${select == "saved" ? "active" : ""}`}
          onClick={handleSaved}
        >
          Saved
        </li>
        <li
          className={`side-bar-completed-button 
                    ${select == "completed" ? "active" : ""}`}
          onClick={handleCompleted}
        >
          Completed
        </li>
        <li
          className={`side-bar-near-me-button 
                    ${select == "near-me" ? "active" : ""}`}
          onClick={handleNearMe}
        >
          Near Me
        </li>
      </ul>
      {select == "all" ? (
        <form onSubmit={handleSearch} className="hike-search-form">
          <input
            className="hike-search-input"
            autoComplete="off"
            type="text"
            placeholder="Search for a hike"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          ></input>
          <button className="hike-search-button material-icons md-48">
            search
          </button>
        </form>
      ) : (
        ""
      )}
    </>
  );
}

/**
 * Renders details on hikes in search results
 *
 * @param {hike} hikeObject Information on hike
 * @param {function} setSelectedHike
 * @param {{username: string, sessionToken: string, firstName: string,
 * lastName: string}} currUser Holds info on current user from local storage
 * @param {function} setCenter
 * @returns Hike Card component
 */
export function HikeCard({ hikeObject, setSelectedHike, currUser, setCenter }) {
  /**
   * State var that holds hikes saved by current user
   * @type {Array<number>} Contains hike id's
   */
  const [saved, setSaved] = React.useState(null);
  /**
   * State var that holds hikes completed by current user
   * @type {Array<number>} Contains hike id's
   */
  const [completed, setCompleted] = React.useState(null);
  /**
   * URL for put request to add a hike to user's completed hikes
   * @type {string}
   */
  const COMPLETE_HIKE_URL = "https://gohike-api.herokuapp.com/user/complete";
  /**
   * URL for put request to remove a hike to user's completed hikes
   * @type {string}
   */
  const UNCOMPLETE_HIKE_URL = "https://gohike-api.herokuapp.com/user/uncomplete";
  /**
   * URL for put request to add a hike to user's saved hikes
   * @type {string}
   */
  const SAVE_HIKE_URL = "https://gohike-api.herokuapp.com/user/save";
  /**
   * URL for put request to remove a hike to user's saved hikes
   * @type {string}
   */
  const UNSAVE_HIKE_URL = "https://gohike-api.herokuapp.com/user/unsave";

  /**
   * Sets saved and completed state variables on every render
   */
  React.useEffect(async () => {
    const data = await axios.get(
      `https://gohike-api.herokuapp.com/user/saved-completed/${currUser.username}`
    );

    setSaved(data.data.saved);
    setCompleted(data.data.completed);
  }, []);

  /**
   * OnClick handler for save hike button
   */
  async function saveHike() {
    try {
      let data = await axios.put(SAVE_HIKE_URL, {
        hikeId: hikeObject.id,
        username: currUser.username,
      });
      setSaved(data.data.saved);
    } catch {
      console.log("Failed to save hike");
    }
  }

  /**
   * OnClick handler for unsave hike button
   */
  async function unsaveHike() {
    try {
      let data = await axios.put(UNSAVE_HIKE_URL, {
        hikeId: hikeObject.id,
        username: currUser.username,
      });
      setSaved(data.data.saved);
    } catch {
      console.log("Failed to unsave hike");
    }
  }

  /**
   * OnClick handler for complete hike button
   */
  async function completeHike() {
    try {
      let data = await axios.put(COMPLETE_HIKE_URL, {
        hikeId: hikeObject.id,
        username: currUser.username,
      });
      setCompleted(data.data.completed);
    } catch {
      console.log("Failed to complete hike");
    }
  }

  /**
   * OnClick handler for uncomplete hike button
   */
  async function uncompleteHike() {
    try {
      let data = await axios.put(UNCOMPLETE_HIKE_URL, {
        hikeId: hikeObject.id,
        username: currUser.username,
      });
      setCompleted(data.data.completed);
    } catch {
      console.log("Failed to complete hike");
    }
  }

  // Don't return unless saved and completed have been set
  if (saved == null || completed == null) {
    return null;
  }

  // Return React component
  return (
    <div className="hike-card">
      {hikeObject.img == "" ? (
        ""
      ) : (
        <div className="hike-card-img">
          <img src={hikeObject.img} />
        </div>
      )}
      <span className="hike-type">{hikeObject.trail_type}</span>
      <span className="hike-title">
        <p
          className="hike-name"
          onClick={() => {
            setSelectedHike(hikeObject);
            setCenter({
              lng: hikeObject.longitude,
              lat: hikeObject.latitude,
            });
          }}
        >
          {hikeObject.name}
        </p>
        {saved.includes(hikeObject.id) ? (
          <button
            onClick={unsaveHike}
            className="hike-saved material-icons md-48"
          >
            bookmark
          </button>
        ) : (
          <button
            onClick={saveHike}
            className="hike-not-saved material-icons md-48"
          >
            bookmark
          </button>
        )}
        {completed.includes(hikeObject.id) ? (
          <button
            onClick={uncompleteHike}
            className="hike-completed material-icons md-48"
          >
            done_outline
          </button>
        ) : (
          <button
            onClick={completeHike}
            className="hike-not-completed material-icons md-48"
          >
            done_outline
          </button>
        )}
      </span>
      <span className="hike-location">{hikeObject.location}</span>
      <span className="hike-length-ascent">
        {`Length: ${hikeObject.length} | 
                Ascent: ${hikeObject.ascent}`}
      </span>
    </div>
  );
}
