require("dotenv").config();
var Parse = require('parse/node');
Parse.initialize(process.env.APP_ID, process.env.JS_KEY, process.env.MASTER_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/'

class Posts {
    constructor() {
        this.super();
    }

    static async createPost(username, hikeId, caption ) {
        // Get User object from sesssion token
        let query = new Parse.Query("_User")
        query.equalTo("username", username)
        let user = await query.first({useMasterKey:true})

        let newPost = new Parse.Object("Post", { User: user, HikeId: hikeId, Caption: caption, Likes: []  })
        newPost.save()

        // let query2 = new Parse.Query("Post")
        
        // //query2.includeKey("createdAt")
        // let post = await query2.find();
        // console.log(post)
        // console.log(post.Likes)
        // console.log(post.createdAt)

        // return { msg: "Created new post" }
    }


}

module.exports = Posts