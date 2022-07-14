require("dotenv").config();
var Parse = require('parse/node');
Parse.initialize(process.env.APP_ID, process.env.JS_KEY, process.env.MASTER_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/'

class User {
    constructor() {
        this.super();
    }

    static async getUserInfo(sessionToken) {
        // Get User pointer from sessionToken
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", sessionToken)
        let session = await query.first({useMasterKey:true})

        // Get User object from sessionToken
        let query2 = new Parse.Query("_User")
        query.equalTo("objectId", session.get("user").id)
        let user = await query2.first({useMasterKey:true})
        return user
    }

    static async getUserPosts(sessionToken) {
        // Get User id from sessionToken
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", sessionToken)
        let session = await query.first({useMasterKey:true})
        let userId = session.get("user").id

        // Get user info
        let query2 = new Parse.Query("_User")
        query2.equalTo("objectId", userId)
        let user = await query2.first({useMasterKey:true})

        // Get all Post objects
        let query3 = new Parse.Query("Post")
        let posts = await query3.find({useMasterKey:true})
    
        // Create array with necessary info for each post
        let res = []
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].get("user").id == userId) {
                let post = posts[i]

                // Get Post info
                let query4 = new Parse.Query("Post")
                query4.equalTo("objectId", post.id)
                let postInfo = await query4.first({useMasterKey:true})
                
                res.push({ firstName: user.get("firstName"), lastName: user.get("lastName"), trailName: postInfo.get("trailName"), hikeId: postInfo.get("hikeId"), caption: postInfo.get("caption"), createdAt: postInfo.get("createdAt"), picture: postInfo.get("picture")._url })
            }
        }

        return res
    }

    static async changeProfilePicture(sessionToken, picture) {
        // Create Parse file object from picture
        const file = new Parse.File('picture', {base64: picture})
        await file.save()

        console.log(file)
        // Get User id from sessionToken
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", sessionToken)
        let session = await query.first({useMasterKey:true})
        let userId = session.get("user").id

        // Get user info
        let query2 = new Parse.Query("_User")
        query2.equalTo("objectId", userId)
        let user = await query2.first({useMasterKey:true})

        // Set profile pic
        user.set("profilePic", file)
        user.save()
    }
}

module.exports = User