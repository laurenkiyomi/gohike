const express = require('express');
const router = express.Router();
const Trails = require('../models/trails');


router.get('/firstTrail', async (req, res) => {
    try {
        const firstTrail = await Trails.getFirstTrail()
        res.status(201).json({ firstTrail })
    } catch {
        res.status(400).json({ msg: "Could not retrieve trail info." })
    }
}) 

router.get('/', async (req, res) => {
    try {
        const trailName = req.query.name
        const trail = await Trails.getTrailByName((trailName.replaceAll("+", " ")).toLowerCase())
        res.status(201).json({ trail })
    } catch {
        res.status(400).json({ msg: "Could not retrieve trail info." })
    }
}) 

module.exports = router