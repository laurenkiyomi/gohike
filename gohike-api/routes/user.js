/**
 * @fileoverview This file contains the User routing methods for the GoHike
 * app API. It handles getting information on users, user-to-user interaction,
 * and user-to-post interaction by calling on an instance of the User class in
 * the models directory.
 */
const express = require("express");
const router = express.Router();
const User = require("../models/user");

/**
 * Get request for getting the id's of hikes saved and completed by the
 * specified user
 */
router.get("/saved-completed/:username", async (req, res) => {
  try {
    var username = req.params.username;
    // Gets saved and completed hikes by calling User method
    let savedCompleted = await User.getSavedAndCompleted(username);
    res.status(201).json(savedCompleted);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Failed to get saved and completed hikes" });
  }
});

/**
 * Get request for getting the id's of hikes saved by the specified user
 */
router.get("/saved/:username", async (req, res) => {
  try {
    var username = req.params.username;
    // Gets saved hikes by calling User method
    let saved = await User.getSaved(username);
    res.status(201).json({ saved });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Failed to get saved hikes" });
  }
});

/**
 * Get request for getting the id's of hikes completed by the specified user
 */
router.get("/completed/:username", async (req, res) => {
  try {
    var username = req.params.username;
    // Gets completed hikes by calling User method
    let completed = await User.getCompleted(username);
    res.status(201).json({ completed });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Failed to get completed hikes" });
  }
});

/**
 * Get request for getting information on the current user based on their
 * session token stored in local storage
 */
router.get("/:sessionToken", async (req, res) => {
  try {
    const sessionToken = req.params.sessionToken;
    // Gets user data by calling User method
    let userData = await User.getUserInfo(sessionToken);
    res.status(201).json({ user: userData });
  } catch (err) {
    res.status(400).json({ msg: "Could not retrieve user info." });
  }
});

/**
 * Get request for getting the id's of posts made by the current user based on
 * their session token stored in local storage
 */
router.get("/posts/:sessionToken", async (req, res) => {
  try {
    const sessionToken = req.params.sessionToken;
    // Gets current user's posts by calling User method
    let posts = await User.getUserPosts(sessionToken);
    res.status(201).json({ posts });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Could not retrieve user posts." });
  }
});

/**
 * Put request for changing the profile picture of the current user based on
 * their session token stored in local storage
 */
router.put("/profilePhoto", async (req, res) => {
  try {
    // Gets session token and picture URI from req.body
    let sessionToken = req.body.sessionToken;
    let picture = req.body.picture;

    // Changes user data by calling User method
    await User.changeProfilePicture(sessionToken, picture);
    res.status(201).json({ msg: "Changed profile photo" });
  } catch {
    res.status(400).json({ msg: "Failed to change profile photo" });
  }
});

/**
 * Put request for changing the cover picture of the current user based on
 * their session token stored in local storage
 */
router.put("/coverPhoto", async (req, res) => {
  try {
    // Gets session token and picture URI from req.body
    let sessionToken = req.body.sessionToken;
    let picture = req.body.picture;

    // Changes user data by calling User method
    await User.changeCoverPicture(sessionToken, picture);
    res.status(201).json({ msg: "Changed cover photo" });
  } catch {
    res.status(400).json({ msg: "Failed to change cover photo" });
  }
});

/**
 * Get request for getting information on a user based on their username in
 * order for current user to view another user's profile
 */
router.get("/view/:username", async (req, res) => {
  try {
    const username = req.params.username;
    // Gets user data by calling User method
    let userData = await User.getViewUserInfo(username);
    res.status(201).json({ user: userData });
  } catch {
    res.status(400).json({ msg: "Could not retrieve user info." });
  }
});

/**
 * Get request for getting id's of posts made by another user based on username
 */
router.get("/view/posts/:username", async (req, res) => {
  try {
    const username = req.params.username;
    // Gets post id's by calling User method
    let posts = await User.getUserPosts(username);
    res.status(201).json({ posts });
  } catch (err) {
    res.status(400).json({ msg: "Could not retrieve user posts." });
  }
});

/**
 * Put request for sending a friend request from current user to another user
 */
router.put("/addFriend", async (req, res) => {
  try {
    // Gets session token of current user
    const sessionToken = req.body.sessionToken;
    // Gets username of user to add as friend
    const username = req.body.username;
    // Adds friend by calling User method
    await User.sendFriendRequest(sessionToken, username);
    res.status(201).json({ msg: "Sent friend request" });
  } catch {
    res.status(400).json({ msg: "Could not send friend request." });
  }
});

/**
 * Put request for current user to accept a friend request from another user
 */
router.put("/acceptFriend", async (req, res) => {
  try {
    // Gets session token of current user
    const sessionToken = req.body.sessionToken;
    // Gets username of user to accept friend request from
    const username = req.body.username;
    // Accepts friend request by calling User method
    await User.acceptFriendRequest(sessionToken, username);
    res.status(201).json({ msg: "Accepted friend request" });
  } catch {
    res.status(400).json({ msg: "Could not accept friend request." });
  }
});

/**
 * Put request for current user to decline a friend request from another user
 */
router.put("/declineFriend", async (req, res) => {
  try {
    // Gets session token of current user
    const sessionToken = req.body.sessionToken;
    // Gets username of user to decline friend request from
    const username = req.body.username;
    // Declines friend request by calling User method
    await User.declineFriendRequest(sessionToken, username);
    res.status(201).json({ msg: "Declined friend request" });
  } catch {
    res.status(400).json({ msg: "Could not decline friend request." });
  }
});

/**
 * Put request for saving a hike's id to the current user's saved hikes array
 */
router.put("/save", async (req, res) => {
  try {
    // Gets username of current user
    let username = req.body.username;
    // Gets hike id of hike to save
    let hikeId = req.body.hikeId;

    // Marks hike as saved by calling User method
    let saved = await User.savePost(username, hikeId);
    res.status(201).json({ saved });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Failed to save hike" });
  }
});

/**
 * Put request for removing a hike's id from current user's saved hikes array
 */
router.put("/unsave", async (req, res) => {
  try {
    // Gets username of current user
    let username = req.body.username;
    // Gets hike id of hike to unsave
    let hikeId = req.body.hikeId;

    // Unsaves hike by calling User method
    let saved = await User.unsavePost(username, hikeId);
    res.status(201).json({ saved });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Failed to unsave hike" });
  }
});

/**
 * Put request for adding a hike's id to current user's completed hikes array
 */
router.put("/complete", async (req, res) => {
  try {
    // Gets username of current user
    let username = req.body.username;
    // Gets hike id of the hike to complete
    let hikeId = req.body.hikeId;

    // Marks hike as completed by calling User method
    let completed = await User.completePost(username, hikeId);
    res.status(201).json({ completed });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Failed to complete hike" });
  }
});

/**
 * Put request for removing a hike's id from current user's completed hikes
 */
router.put("/uncomplete", async (req, res) => {
  try {
    // Gets username of current user
    let username = req.body.username;
    // Gets hike id of the hike to uncomplete
    let hikeId = req.body.hikeId;

    // Uncompletes hike by calling User method
    let completed = await User.uncompletePost(username, hikeId);
    res.status(201).json({ completed });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Failed to uncomplete hike" });
  }
});

/**
 * Put request to update a user's last location
 */
router.put("/update-location", async (req, res) => {
  try {
    // Gets location of current user
    let lat = req.body.lat
    let lng = req.body.lng
    let username = req.body.username
    
    // Update location by calling User method
    let updated = await User.updateLocation(lat, lng, username)
    res.status(201).json({ msg: updated });
  } catch (err) {
    res.status(400).json({ msg: "Failed to update location" });
  }
})

module.exports = router;