const express = require('express');
const router = express.Router();
const fetchUser  = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//Route1: Get All the Notes notes useing: GET "/api/fetchallnotes"
router.get('/fetchallnotes',fetchUser,async (req,res)=>{
    try{
        const notes = await Notes.find({user: req.user.id});
        res.json({notes});
    }
    catch(error)
    {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Route2: Add a new note POST "/api/notes/addnote"
router.post('/addnote', fetchUser, [
    body('title', 'Enter a valid title').notEmpty(),
    body('description', 'Description must be at least 5 characters long').isLength({ min: 5 })
], async (req, res) => {
    // Handle errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extract data from request body
    const { title, description, tag } = req.body;

    try {
        // Create a new note
        const note = new Notes({
            title,
            description,
            tag,
            user: req.user.id
        });

        // Save the note to the database
        const savedNote = await note.save();
        res.json(savedNote); // Send the saved note as response
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route3: Update a note: PUT "/api/updatenote/:id"
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const newNote = {};
        
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }
        if (tag) {
            newNote.tag = tag;
        }

        // Find the note to be updated
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Check if the note belongs to the logged-in user
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Update the note and get the updated note
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        
        // Respond with the updated note
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route4: delete a note: DELETE "/api/deletenote/:id"
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        // Find the note to be deleted
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Delete the note
        note = await Notes.findByIdAndDelete(req.params.id);
        
        // Respond with success message
        res.json({ success: "Note has been deleted" ,note:note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
