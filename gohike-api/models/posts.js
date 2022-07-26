/**
 * @fileoverview This file is the Posts model in the GoHike app API. It is used
 * to implement a Posts class and is called by the the Posts routing methods.
 */
require("dotenv").config();
var Parse = require("parse/node");
Parse.initialize(
  process.env.APP_ID,
  process.env.JS_KEY,
  process.env.MASTER_KEY
);
Parse.serverURL = "https://parseapi.back4app.com/";
const { parse } = require("path");
const { post } = require("../routes/authorization");

/**
 * This class handles creation of posts, getting posts, and interacting with
 * posts.
 */
class Posts {
  constructor() {
    this.super();
  }

  /**
   * Creates a new Post object and saves new post to Parse
   *
   * @param {String} sessionToken Corresponds to the session of the post
   * creator
   * @param {Number} hikeId Id of the Trail that the post is about
   * @param {String} caption Description of post created by the user
   * @param {*} picture Picture of the hike taken by the user
   * @returns {Object} Contains message indicating successful creation of
   * new post
   */
  static async createPost(sessionToken, hikeId, caption, picture) {
    // Get User object from sessionToken
    let query = new Parse.Query("_Session");
    query.equalTo("sessionToken", sessionToken);
    let session = await query.first({ useMasterKey: true });
    let user = session.get("user");

    // Get Trail object from trailId
    let query2 = new Parse.Query("Trail");
    query2.equalTo("hikeId", hikeId);
    let trail = await query2.first({ useMasterKey: true });

    // Get User object from username
    let query3 = new Parse.Query("_User");
    query3.equalTo("objectId", user.id);
    let userObject = await query3.first({ useMasterKey: true });

    // Create new Post object and set correct values
    // Save Post object to Parse
    let newPost = new Parse.Object("Post", {
      username: userObject.get("username"),
      user,
      hikeId,
      caption,
      trailName: trail.get("name"),
      trail,
      picture,
    });
    await newPost.save();

    return { msg: "Created new post" };
  }

  /**
   * Gets all posts made by the current user's friends
   *
   * @param {String} sessionToken Corresponds to session of the current user
   * @returns {Array<Number>} Contains the id's of all posts made by the
   * current user's friends
   */
  static async getFriendPosts(sessionToken) {
    // Get User pointer from sessionToken
    let query = new Parse.Query("_Session");
    query.equalTo("sessionToken", sessionToken);
    let session = await query.first({ useMasterKey: true });
    let userId = session.get("user").id;

    // Get User object's friends from user pointer
    let query4 = new Parse.Query("_User");
    query4.equalTo("objectId", userId);
    let user = await query4.first({ useMasterKey: true });
    let friends = user.get("friends");

    // Return empty array if user has no friends
    if (friends == undefined || friends.length == 0) {
      return [];
    }

    // Add post id to posts array if it is from the user's friend
    let posts = [];
    for (let i = 0; i < friends.length; i++) {
      let query3 = new Parse.Query("_User");
      query3.descending("createdAt");
      query3.equalTo("username", friends[i]);
      let friend = await query3.first({ useMasterKey: true });

      if (friend.get("posts") != null && friend.get("posts") != undefined) {
        posts = posts.concat(friend.get("posts"));
      }
    }

    return posts;
  }

  /**
   * Gets all posts in the Parse database
   *
   * @returns @returns {Array<Number>} Contains the id's of all posts in the
   * Parse database
   */
  static async getAllPosts() {
    // Get all Post objects
    let query = new Parse.Query("Post");
    query.descending("createdAt");
    let posts = await query.find({ useMasterKey: true });

    // Add all post id's to res array
    let res = [];
    for (let i = 0; i < posts.length; i++) {
      res.push(posts[i].id);
    }

    return res;
  }

  /**
   * Queries Parse for information on a specific post
   *
   * @param {Number} postId Corresponds to the post to return
   * @returns {Object} Contains the creator's username, the name of the trail,
   * the trail id, the caption, the created at time, picture, and likes array
   * of the post corresponding to the postId
   */
  static async getPost(postId) {
    // Get Post object from postId
    let query = new Parse.Query("Post");
    query.equalTo("objectId", postId);
    let post = await query.first({ useMasterKey: true });

    // Get likes array of post
    // Let likes array be empty if there are no likes
    let likes;
    if (post.get("likes") == undefined || post.get("likes") == null) {
      likes = [];
    } else {
      likes = post.get("likes");
    }

    return {
      username: post.get("username"),
      trailName: post.get("trailName"),
      hikeId: post.get("hikeId"),
      caption: post.get("caption"),
      createdAt: post.get("createdAt"),
      picture: post.get("picture"),
      likes,
    };
  }

  /**
   * Adds user to the corresponding post's likes array
   *
   * @param {String} username User who's liking the post
   * @param {Number} postId Id of post to like
   * @returns {Object} Contains message indicating succesful like of post
   */
  static async likePost(username, postId) {
    // Get Post object from postId
    let query = new Parse.Query("Post");
    query.equalTo("objectId", postId);
    let post = await query.first({ useMasterKey: true });
    let likes = post.get("likes");

    // Add user to likes array
    if (likes == undefined || likes == null) {
      post.set("likes", [username]);
      await post.save();
    } else {
      likes.push(username);
      post.set("likes", likes);
      await post.save();
    }

    return { msg: "Liked post" };
  }

  /**
   * Removes user from the corresponding post's likes array
   *
   * @param {String} username User who's unliking the post
   * @param {Number} postId Id of post to unlike
   * @returns {Object} Contains message indicating succesful unlike of post
   */
  static async unlikePost(username, postId) {
    // Get Post object from postId
    let query = new Parse.Query("Post");
    query.equalTo("objectId", postId);
    let post = await query.first({ useMasterKey: true });
    let likes = post.get("likes");

    // Remove user from likes array
    let res = [];
    for (let i = 0; i < likes.length; i++) {
      if (likes[i] != username) {
        res.push(likes[i]);
      }
    }

    // Set likes to res and save to Parse
    post.set("likes", res);
    await post.save();
    return { msg: "Unliked post" };
  }

  /**
   * Gets the likes array of the corresponding post
   *
   * @param {Number} postId Id of post to get likes array from
   * @returns {Array<String>} Contains usernames of users that liked the post
   */
  static async getLikes(postId) {
    // Get Post object from postId
    let query = new Parse.Query("Post");
    query.equalTo("objectId", postId);
    let post = await query.first({ useMasterKey: true });
    let likes = post.get("likes");

    // Return empty array if post has no likes
    // Otherwise return likes array
    if (likes == undefined || likes == null) {
      return [];
    } else {
      return likes;
    }
  }
}

module.exports = Posts;
