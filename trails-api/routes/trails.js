const express = require('express');
const router = express.Router();
const Trails = require('../models/trails');

router.get('/', async (req, res) => {
    try {
        const trailName = req.query.name
        const trail = await Trails.getTrailByName((trailName.replaceAll("+", " ")).toLowerCase())
        res.status(201).json({ trail })
    } catch {
        res.status(400).json({ msg: "Could not retrieve trail info." })
    }
})

router.get('/trail-list', async (req, res) => {
    try {
        const trails = await Trails.getTrailList()
        res.status(201).json({ trails })
    } catch {
        res.status(400).json({ msg: "Could not get trail list." })
    }
})

router.get('/all-trails', async (req, res) => {
    try {
        const trails = await Trails.getAllTrails()
        res.status(201).json({ trails })
    } catch {
        res.status(400).json({ msg: "Could not get trail list." })
    }
})



module.exports = router