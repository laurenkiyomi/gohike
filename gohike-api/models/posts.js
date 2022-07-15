require("dotenv").config();
var Parse = require('parse/node');
Parse.initialize(process.env.APP_ID, process.env.JS_KEY, process.env.MASTER_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/'
const { parse } = require("path");

class Posts {
    constructor() {
        this.super();
    }

    static async createPost(sessionToken, hikeId, caption, picture) {
        // Get User object from sessionToken
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", sessionToken)
        let session = await query.first({useMasterKey:true})
        let user = session.get("user")

        // Get Trail object from trailId
        let query2 = new Parse.Query("Trail")
        query2.equalTo("hikeId", hikeId)
        let trail = await query2.first({useMasterKey:true})

        // Get User object from username
        let query3 = new Parse.Query("_User")
        query3.equalTo("objectId", user.id)
        let userObject = await query3.first({useMasterKey:true})
              
        // Create Parse file from picture
        // const file = new Parse.File('image.jpeg', {base64: picture})
        // await file.save()

        let newPost = new Parse.Object("Post", { username: userObject.get("username"), user, hikeId, caption, trailName: trail.get("name"), trail, picture  })
        await newPost.save()

        return { msg: "Created new post" }
    }

    static async getFriendPosts(sessionToken) {
        // Get User pointer from sessionToken
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", sessionToken)
        let session = await query.first({useMasterKey:true})
        let userId = session.get("user").id

        // Get User object from user pointer
        let query4 = new Parse.Query("_User")
        query4.equalTo("objectId", userId)
        let user = await query4.first({useMasterKey:true})
        let friends = user.get("friends")

        // Return empty array if user has no friends
        if (friends == undefined || friends.length == 0) {
            return []
        }

        // Get all Post Objects
        let query2 = new Parse.Query("Post")
        let allPosts = await query2.find({useMasterKey:true})

        // Get posts only from friends
        let posts = []
        for (let i = 0; i < allPosts.length; i++) {
            let postPointer = allPosts[i]
            let query3 = new Parse.Query("Post")
            query3.equalTo("objectId", postPointer.id)
            let post = await query3.first({useMasterKey:true})
            let postUser = post.get("username")

            for (let j = 0; j < friends.length; j++) {
                if (postUser == friends[j]) {
                    posts.push({ username: postUser, trailName: post.get("trailName"), hikeId: post.get("hikeId"), caption: post.get("caption"), createdAt:post.get("createdAt"), picture: post.get("picture") })
                    break;
                }
            }
        }

        return posts;
    }
 
    static async getAllPosts() {
        // Get all Post objects
        let query = new Parse.Query("Post")
        let posts = await query.find({useMasterKey:true})
    
        // Create array with necessary info for each post
        let res = []
        for (let i = 0; i < posts.length; i++) {
            let post = posts[i]
            let query = new Parse.Query("Post")
            query.equalTo("objectId", post.id)
            let trailInfo = await query.first({useMasterKey:true})
          
            res.push({ username: trailInfo.get("username"), trailName: trailInfo.get("trailName"), hikeId: trailInfo.get("hikeId"), caption: trailInfo.get("caption"), createdAt: trailInfo.get("createdAt"), picture: trailInfo.get("picture") })
        }

        return res
    }

    static async likePost(sessionToken, postId) {
        // Get Post object from postId
        let query = new Parse.Query("Post")
        query.equalTo("objectId", postId)
        let post = await query.first({useMasterKey:true})
        let likes = post.get("Likes")

        // Get User object from sessionToken
        let query2 = new Parse.Query("_Session")
        query2.equalTo("sessionToken", sessionToken)
        let session = await query2.first({useMasterKey:true})
        let user = session.get("user")
        
        // Add user to likes array
        likes.push(user)
        post.set("Likes", likes)
        post.save();

        return { msg: "Liked post" }
    }


}

module.exports = Posts