/**
 * @fileoverview This file is the Trails model in the GoHike app API. It is
 * used to implement an Trails class and is called by the the Trails routing
 * methods. Trails in the Parse database were retrieved from an open source
 * Github project and reformatted to be uploaded to Parse.
 */
require("dotenv").config();
var Parse = require("parse/node");
Parse.initialize(
  process.env.APP_ID,
  process.env.JS_KEY,
  process.env.MASTER_KEY
);
Parse.serverURL = "https://parseapi.back4app.com/";

/**
 * This class handles getting information about trails in the Parse database.
 */
class Trails {
  constructor() {
    this.super();
  }

  /**
   * Get all trails in the Parse database
   *
   * @returns {Array<{label: string, value: number}>} Contains all trails
   * in order to allow users to select a hike when creating a post from
   * the frontend
   */
  static async getAllTrails() {
    // Get all trails in database
    let query = new Parse.Query("Trail");
    query.limit(2000);
    let trails = await query.find({ useMasterKey: true });

    // Create array with trail names and values
    const res = [];
    for (let i = 0; i < trails.length; i++) {
      let trail = {
        label: trails[i].get("name"),
        value: trails[i].get("hikeId"),
      };
      res.push(trail);
    }

    return res;
  }

  /**
   * Gets information on all hikes whose name contains trailName
   *
   * @param {string} trailName Name to look for
   * @returns {Array<{id: number, name: string, trail_type: string,
   * summary: string, location: string, length: number, ascent: number,
   * descent: number, conditionStatus: string, high: number, low: number,
   * longitude: number, latitude: number, img: string}>} Array of hikes
   */
  static async getTrailByName(trailName) {
    // Get all trails in database
    let query = new Parse.Query("Trail");
    query.limit(2000);
    let trails = await query.find({ useMasterKey: true });

    let trail = [];
    let previous = "";

    for (let i = 0; i < trails.length; i++) {
      if (trails[i].get("name").toLowerCase().includes(trailName)) {
        let addTrail = trails[i];

        // Don't add two trails with the same name
        if (previous == addTrail.get("name")) {
          continue;
        }

        // Get largest image available
        let img = "";
        if (addTrail.get("imgMedium") != "") {
          img = addTrail.get("imgMedium");
        } else if (addTrail.get("imgSmallMed") != "") {
          img = addTrail.get("imgSmallMed");
        } else if (addTrail.get("imgSmall") != "") {
          img = addTrail.get("imgSmall");
        } else if (addTrail.get("imgSqSmall") != "") {
          img = addTrail.get("imgSqSmall");
        }

        // Get comments
        let comments = [];
        if (
          addTrail.get("comments") == undefined ||
          addTrail.get("comments") == null
        ) {
          comments = [];
        } else {
          comments = addTrail.get("comments");
        }

        //
        trail.push({
          id: addTrail.get("hikeId"),
          name: addTrail.get("name"),
          trail_type: addTrail.get("trail_type"),
          summary: addTrail.get("summary"),
          location: addTrail.get("location"),
          length: addTrail.get("distance"),
          ascent: addTrail.get("ascent"),
          descent: addTrail.get("descent"),
          conditionStatus: addTrail.get("conditionStatus"),
          high: addTrail.get("high"),
          low: addTrail.get("low"),
          longitude: addTrail.get("longitude"),
          latitude: addTrail.get("latitude"),
          img,
          comments,
        });

        previous = addTrail.get("name");
      }
    }

    return trail;
  }

  /**
   * Gets information on a specific hike based on its id
   *
   * @param {string} trailId Id of trail to get information on
   * @returns {Array<{id: number, name: string, trail_type: string,
   * summary: string, location: string, length: number, ascent: number,
   * descent: number, conditionStatus: string, high: number, low: number,
   * longitude: number, latitude: number, img: string}>} Array of hikes
   */
  static async getTrailById(trailId) {
    // Get trail with trailId in database
    let query = new Parse.Query("Trail");
    query.equalTo("hikeId", parseInt(trailId));
    let trail = await query.first({ useMasterKey: true });
    let res = [];

    // Get largest image available
    let img = "";
    if (trail.get("imgMedium") != "") {
      img = trail.get("imgMedium");
    } else if (trail.get("imgSmallMed") != "") {
      img = trail.get("imgSmallMed");
    } else if (trail.get("imgSmall") != "") {
      img = trail.get("imgSmall");
    } else if (trail.get("imgSqSmall") != "") {
      img = trail.get("imgSqSmall");
    }

    // Get comments
    let comments = [];
    if (trail.get("comments") == undefined || trail.get("comments") == null) {
      comments = [];
    } else {
      comments = trail.get("comments");
    }

    // Pushes corresponding hike to the res array
    res.push({
      id: trail.get("hikeId"),
      name: trail.get("name"),
      trail_type: trail.get("trail_type"),
      summary: trail.get("summary"),
      location: trail.get("location"),
      length: trail.get("distance"),
      ascent: trail.get("ascent"),
      descent: trail.get("descent"),
      conditionStatus: trail.get("conditionStatus"),
      high: trail.get("high"),
      low: trail.get("low"),
      longitude: trail.get("longitude"),
      latitude: trail.get("latitude"),
      img,
      comments,
    });

    return res;
  }

  /**
   * Converts a number in degrees to radians
   *
   * @param {number} deg
   * @returns {number} Result in radians
   */
  static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  /**
   * Gets distance in kilometers between two points given by their lat and lng
   *
   * @param {number} lat1 Latitude of first point
   * @param {number} lon1 Longitude of first point
   * @param {number} lat2 Latitude of second point
   * @param {number} lon2 Longitude of second point
   * @returns {number} Distance in kilometers
   */
  static getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    // Radius of the earth in km
    var R = 6371;
    // deg2rad below
    var dLat = this.deg2rad(lat2 - lat1);
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // Distance in km
    var d = R * c;
    return d;
  }

  /**
   * Gets hikes located within 50 miles of the given location
   *
   * @param {number} lat Latitude of location to get hikes near
   * @param {number} lng Longitude of location to get hikes near
   * @returns {Array<{id: number, name: string, trail_type: string,
   * summary: string, location: string, length: number, ascent: number,
   * descent: number, conditionStatus: string, high: number, low: number,
   * longitude: number, latitude: number, img: string}>} Array of hikes
   */
  static async getNearMe(lat, lng) {
    // Get all trails in database
    let query = new Parse.Query("Trail");
    query.limit(2000);
    let trails = await query.find({ useMasterKey: true });

    let trail = [];
    let previous = "";

    // Find trails within 50 miles from given location
    for (let i = 0; i < trails.length; i++) {
      // Get distance between points in miles
      let distance =
        0.621371 *
        this.getDistanceFromLatLonInKm(
          lat,
          lng,
          trails[i].get("latitude"),
          trails[i].get("longitude")
        );
      if (distance <= 50) {
        let addTrail = trails[i];

        // Don't add two trails with the same name
        if (previous == addTrail.get("name")) {
          continue;
        }

        // Get largest image available
        let img = "";
        if (addTrail.get("imgMedium") != "") {
          img = addTrail.get("imgMedium");
        } else if (addTrail.get("imgSmallMed") != "") {
          img = addTrail.get("imgSmallMed");
        } else if (addTrail.get("imgSmall") != "") {
          img = addTrail.get("imgSmall");
        } else if (addTrail.get("imgSqSmall") != "") {
          img = addTrail.get("imgSqSmall");
        }

        // Get comments
        let comments = [];
        if (
          addTrail.get("comments") == undefined ||
          addTrail.get("comments") == null
        ) {
          comments = [];
        } else {
          comments = addTrail.get("comments");
        }

        // Add trail to resulting array
        trail.push({
          id: addTrail.get("hikeId"),
          name: addTrail.get("name"),
          trail_type: addTrail.get("trail_type"),
          summary: addTrail.get("summary"),
          location: addTrail.get("location"),
          length: addTrail.get("distance"),
          ascent: addTrail.get("ascent"),
          descent: addTrail.get("descent"),
          conditionStatus: addTrail.get("conditionStatus"),
          high: addTrail.get("high"),
          low: addTrail.get("low"),
          longitude: addTrail.get("longitude"),
          latitude: addTrail.get("latitude"),
          img,
          comments,
        });

        previous = addTrail.get("name");
      }
    }

    return trail;
  }

  /**
   * Gets all pictures in the Parse database posted of a trail in order of
   * most to least liked in order to create a carousel in the hike popouts
   * in the frontend
   *
   * @param {Number} trailId Id of trail to get pictures of
   * @returns {Array<string>} Contains URI's of pictures
   */
  static async getTrailPictures(trailId) {
    // Get all posts in database sorted by most liked
    let query = new Parse.Query("Post");
    query.descending("likes");
    let posts = await query.find({ useMasterKey: true });

    // Push post's image to res array if the post matches the trailId
    let res = [];
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].get("hikeId") == trailId) {
        res.push(posts[i].get("picture"));
      }
    }

    return res;
  }

  /**
   * Leave comments on a trail
   *
   * @param {number} trailId Id of trail to leave comment on
   * @param {string} comment
   * @param {string} username Of user leaving comment
   * @returns {string} Message indicating success
   */
  static async leaveComment(trailId, comment, username) {
    // Get trail with trailId in database
    let query = new Parse.Query("Trail");
    query.equalTo("hikeId", parseInt(trailId));
    let trail = await query.first({ useMasterKey: true });

    // Get comments array
    let comments = trail.get("comments");
    // Edit comments array
    if (comments == undefined || comments == null || comments.length == 0) {
      trail.set("comments", [{ username, comment }]);
      await trail.save(null, { useMasterKey: true });
    } else {
      let newComments = [{ username, comment }];
      trail.set("comments", newComments.concat(comments));
      await trail.save(null, { useMasterKey: true });
    }

    return "Left comment";
  }
}

module.exports = Trails;
