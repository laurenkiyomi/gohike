require("dotenv").config();
var Parse = require('parse/node');
Parse.initialize(process.env.APP_ID, process.env.JS_KEY, process.env.MASTER_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/'

class Trails {
    constructor() {
        this.super();
    }

    static async getAllTrails() {
        // Get all trails in database
        let query = new Parse.Query("Trail")
        query.limit(2000)
        let trails = await query.find({useMasterKey:true})
        
        // Create array with trail names and values
        const res = []
        for (let i = 0; i < trails.length; i++) {
            let trail = { label: trails[i].get("name"), value: trails[i].get("hikeId") }
            res.push(trail)
        }

        return res
    }

    static async getTrailByName(trailName) {
        // Get all trails in database
        let query = new Parse.Query("Trail")
        query.limit(2000)
        let trails = await query.find({useMasterKey:true})

        let trail=[]
        let previous = ""
        
        for (let i = 0; i < trails.length; i++) {
            if ((trails[i].get("name").toLowerCase()).includes(trailName)) {
                let addTrail = trails[i]

                // Don't add two trails with the same name
                if (previous == addTrail.get("name")) {
                    continue;
                }

                // Get largest image available
                let img = ""
                if (addTrail.get("imgMedium") != "") {
                    img = addTrail.get("imgMedium")
                } else if (addTrail.get("imgSmallMed") != "") {
                    img = addTrail.get("imgSmallMed")
                } else if (addTrail.get("imgSmall") != "") {
                    img = addTrail.get("imgSmall")
                } else if (addTrail.get("imgSqSmall") != "") {
                    img = addTrail.get("imgSqSmall")
                }

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
                    img
                })

                previous = addTrail.get("name")
            }
        }
        
        return trail
    }

    static async getTrailById(trailId) {
        // Get all trails in database
        let query = new Parse.Query("Trail")
        query.equalTo("hikeId", parseInt(trailId))
        let trail = await query.first({useMasterKey:true})
        let res = []

        // Get largest image available
        let img = ""
        if (trail.get("imgMedium") != "") {
            img = trail.get("imgMedium")
        } else if (trail.get("imgSmallMed") != "") {
            img = trail.get("imgSmallMed")
        } else if (trail.get("imgSmall") != "") {
            img = trail.get("imgSmall")
        } else if (trail.get("imgSqSmall") != "") {
            img = trail.get("imgSqSmall")
        }

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
            img
        })
        
        return res
    }
}

module.exports = Trails