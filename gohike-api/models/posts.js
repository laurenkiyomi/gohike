require("dotenv").config();
var Parse = require('parse/node');
Parse.initialize(process.env.APP_ID, process.env.JS_KEY, process.env.MASTER_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/'
const { parse } = require("path");

class Posts {
    constructor() {
        this.super();
    }

    static async createPost(sessionToken, hikeId, caption ) {
        // Get User object from username
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", sessionToken)
        let session = await query.first({useMasterKey:true})
        let user = session.get("user")

        let newPost = new Parse.Object("Post", { User: user, HikeId: hikeId, Caption: caption, Likes: []  })
        newPost.save()

        return { msg: "Created new post" }
    }

    static async getPost(postId) {
        let query = new Parse.Query("Post")
        query.equalTo("objectId", postId)
        let post = await query.first({useMasterKey:true})
        let pic = post.get("Picture")
        return pic
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