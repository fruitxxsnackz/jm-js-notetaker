const express = require('express');
const router = express.Router();
const notefunctions = require('../db/func');

router.get('/notes', async (req, res) => {
    try {
        const notes = await notefunctions.getnotes();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve notes', details: error }); }
});
router.post('/notes', async (req, res) => {
    try {
        console.log('Creating note:', req.body);
        const makenotes = await notefunctions.addnotes(req.body);
        res.json(makenotes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create note', details: error }); }
});
router.delete('/notes/:id', async (req, res) => {
    try {
     await notefunctions.removenotes(req.params.id);
     res.json({ message: 'Note deleted' });
    } catch (error) {
     res.status(500).json({ error: 'Cannot delete note', details: error }); }
});
module.exports = router;