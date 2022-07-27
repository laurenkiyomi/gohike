/**
 * @fileoverview This file is the Posts model in the GoHike app API. It is used
 * to implement a Posts class and is called by the the Posts routing methods.
 */
require("dotenv").config();
const pq = require("./pq");
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
   * @param {string} sessionToken Corresponds to the session of the post
   * creator
   * @param {number} hikeId Id of the Trail that the post is about
   * @param {string} caption Description of post created by the user
   * @param {string} picture Picture of the hike taken by the user
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
    let post = await newPost.save();

    // Add post to user's personal posts array
    let posts = [{ id: post.id, lat: trail.get("latitude"), 
    lng: trail.get('longitude')}]
    if (userObject.get("posts") != null && userObject.get("posts") != undefined) {
      console.log(userObject.get("posts"))
      posts = posts.concat(userObject.get("posts"))
    }

    // Set and save user's posts
    userObject.set("posts", posts)
    await userObject.save(null, { useMasterKey: true })

    // Get friends from user object
    let friends = userObject.get("friends")
    // Write the post id to all friends' posts array
    if (friends != undefined && friends.length != 0) {
      for (let i = 0; i < friends.length; i++) {
        // Get friend object
        let query4 = new Parse.Query("_User")
        query4.equalTo("username", friends[i])
        let friend = await query4.first({ useMasterKey: true });

        // Add post to friend's feed array
        let feed = [{ id: post.id, lat: trail.get("latitude"), 
        lng: trail.get('longitude')}]
        if (friend.get("feed") != null && friend.get("feed") != undefined) {
          feed = feed.concat(friend.get("feed"))
        }

        // Set and save friend's feed
        friend.set("feed", feed)
        await friend.save(null, { useMasterKey: true });
      }
    }

    return { msg: "Created new post" };
  }

  /**
   * Gets all posts made by the current user's friends
   *
   * @param {string} username Corresponds to username of the current user
   * @returns {Array<{ id: number, lat: number, lng: number }>} Contains the 
   * id and location of all posts made by the current user's friends
   */
  static async getFriendPosts(username) {
    // Get User from username
    let query = new Parse.Query("_User");
    query.equalTo("username", username);
    let user = await query.first({ useMasterKey: true });

    // Return user's feed array
    if (user.get("feed") == undefined || user.get("feed") == null) {
      return []
    } else {
      return user.get("feed")
    }
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
