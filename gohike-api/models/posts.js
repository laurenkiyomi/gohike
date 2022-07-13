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
              
        // Create Parse file from picture
        const file = new Parse.File('picture', {base64: picture})
        await file.save()

        let newPost = new Parse.Object("Post", { user, hikeId, caption, trailName: trail.get("name"), trail, picture: file  })
        await newPost.save()

        return { msg: "Created new post" }
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

            // Get user info
            let query2 = new Parse.Query("_User")
            query2.equalTo("objectId", trailInfo.get("user").id)
            let user = await query2.first({useMasterKey:true})
          
            res.push({ firstName: user.get("firstName"), lastName: user.get("lastName"), trailName: trailInfo.get("trailName"), hikeId: trailInfo.get("hikeId"), caption: trailInfo.get("caption"), createdAt: trailInfo.get("createdAt"), picture: trailInfo.get("picture")._url })
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