const { storage } = require("../data/storage")

class Trails {
    constructor() {
        this.super();
    }

    static async getTrailByName(trailName) {
        const trails = storage.get("trails").value()
        let trail=[]
        let previous = ""
        
        for (let i = 0; i < trails.length; i++) {
            if ((trails[i].name.toLowerCase()).includes(trailName)) {
                let addTrail = trails[i]

                // Don't add two trails with the same name
                if (previous == addTrail.name) {
                    continue;
                }

                let img = ""
                if (addTrail.imgMedium != "") {
                    img = addTrail.imgMedium
                } else if (addTrail.imgSmallMed != "") {
                    img = addTrail.imgSmallMed
                } else if (addTrail.imgSmall != "") {
                    img = addTrail.imgSmall
                } else if (addTrail.imgSqSmall != "") {
                    img = addTrail.imgSqSmall
                }

                trail.push({ 
                    id: addTrail.id, 
                    name: addTrail.name, 
                    trail_type: addTrail.trail_type, 
                    summary: addTrail.summary, 
                    location: addTrail.location, 
                    length: addTrail.length, 
                    ascent: addTrail.ascent, 
                    descent: addTrail.descent, 
                    conditionStatus: addTrail.conditionStatus, 
                    high: addTrail.high, 
                    low: addTrail.low, 
                    longitude: addTrail.longitude, 
                    latitude: addTrail.latitude, 
                    img
                })

                previous = addTrail.name
            }
        }
        return trail
    }

    static async getTrailList() {
        const trails = storage.get("trails").value()
        const res = []
        for (let i = 0; i < trails.length; i++) {
            let trail = { label: trails[i].name, value: trails[i].id }
            res.push(trail)
        }

        return res
    }

    static async getAllTrails() {
        const trails = storage.get("trails").value()
        const res = []
        for (let i = 0; i < trails.length; i++) {
            let trail = trails[i]
            res.push(trail)
        }

        return res
    }
}

module.exports = Trails