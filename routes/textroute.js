const express = require('express');
const path = require('path');
const router = express.Router();
const pathway = path.join(__dirname, '../public');

router.get('/notes', (req, res) => {
    res.sendFile(path.join(pathway, 'notes.html'), err => {
        if (err) {
            console.error('Error sending notes.html:', err);
            res.status(500).send("Unable to load the notes page."); }
    });
});
router.get('*', (req, res) => {
    res.sendFile(path.join(pathway, 'index.html'), err => {
        if (err) {
            console.error('Error sending index.html:', err);
            res.status(500).send("Unable to load the homepage."); }
    });
});
module.exports = router;