/**
 * @fileoverview This file contains the Trails routing methods for the GoHike
 * app API. It handles getting information on trails by calling on an instance
 * of the Trails class in the models directory.
 */
const express = require("express");
const router = express.Router();
const Trails = require("../models/trails");

/**
 * Get request for getting all the trails in the Parse database
 */
router.get("/", async (req, res) => {
  try {
    // Gets all trails by calling Trails method
    const trails = await Trails.getAllTrails();
    res.status(201).json({ trails: trails });
  } catch {
    res.status(400).json({ msg: "Failed to get trails" });
  }
});

/**
 * Get request for getting all the pictures posted about a specified hike
 */
router.get("/hike-pictures/:trailId", async (req, res) => {
  try {
    const trailId = req.params.trailId;
    // Gets information on trail by calling Trails method
    const results = await Trails.getTrailPictures(trailId);
    res.status(201).json({ pictures: results });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Failed to get sorted pictures" });
  }
});

/**
 * Get request for getting all trails near the current user
 */
router.get("/near-me/lat/:latitude/lng/:longitude", async (req, res) => {
  try {
    const lat = req.params.latitude;
    const lng = req.params.longitude;
    // Gets trails near you by calling Trails method
    const trails = await Trails.getNearMe(lat, lng);
    res.status(201).json({ trails });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Failed to get hikes near you" });
  }
});

/**
 * Get request for getting information on a trail based on its name
 */
router.get("/:trailName", async (req, res) => {
  try {
    const trailName = req.params.trailName;
    // Gets information on trail by calling Trails method
    const trail = await Trails.getTrailByName(
      trailName.replaceAll("+", " ").toLowerCase()
    );
    res.status(201).json({ trail });
  } catch {
    res.status(400).json({ msg: "Could not retrieve trail info." });
  }
});

/**
 * Get request for getting information on a trail based on its id
 */
router.get("/id/:trailId", async (req, res) => {
  try {
    const trailId = req.params.trailId;
    // Gets information on a trail by calling Trails method
    const trail = await Trails.getTrailById(trailId);
    res.status(201).json({ trail });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Could not retrieve trail info." });
  }
});

/**
 * Put request for leaving a comment on a trail
 */
router.put("/comment/:trailId", async (req, res) => {
  try {
    const trailId = req.params.trailId;
    const comment = req.body.comment;
    const username = req.body.username;
    // Leaves comment by calling Trails method
    let msg = await Trails.leaveComment(trailId, comment, username);
    res.status(201).json({ msg });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Could not put comment" });
  }
});

module.exports = router;
