const express = require('express');
const router = express.Router();
const Trails = require('../models/trails');

router.get('/', async (req, res) => {
    try {
        const trails = await Trails.getAllTrails()
        res.status(201).json({ trails: trails })
    } catch {
        res.status(400).json( { msg: "Failed to get trails" } )
    }
})

router.get('/hike-pictures/:trailId', async (req, res) => {
    try {
        const trailId = req.params.trailId
        const results = await Trails.getTrailPictures(trailId)
        res.status(201).json({ pictures: results })
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to get sorted pictures" } )
    }
})

router.get('/:trailName', async (req, res) => {
    try {
        const trailName = req.params.trailName
        const trail = await Trails.getTrailByName((trailName.replaceAll("+", " ")).toLowerCase())
        res.status(201).json({ trail })
    } catch {
        res.status(400).json({ msg: "Could not retrieve trail info." })
    }
})

router.get('/id/:trailId', async (req, res) => {
    try {
        const trailId = req.params.trailId
        const trail = await Trails.getTrailById(trailId)
        res.status(201).json({ trail })
    } catch (err) {
        console.log(err)
        res.status(400).json({ msg: "Could not retrieve trail info." })
    }
})

module.exports = router;