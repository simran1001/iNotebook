const express = require('express');
const router = express.Router();
const Notes = require('./Notes');
const fetchuser = require('./fetchuser');
const { body, validationResult } = require('express-validator');
const { Await } = require('react-router-dom');


// Route 1 :Get all notes using GET : /api/note/getuser -> login required

router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error.")
    }
})


// Route 2 :Add a new note using POST : /api/note/addnote -> login required

router.post('/addnotes', fetchuser, [
    body('title', 'Enter a valid title.').isLength({ min: 3 }),
    body('description', 'description must be atleast five characters.').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //if there are error then return a bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })

        const savedNotes = await note.save();
        res.json(savedNotes)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error.")
    }
})

// Route 3 :Update a new note using Put : /api/note/updatenote -> login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    //create a newNote object
    try {
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.send(401).send("Not Allowed")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error.")

    }
})






// Route 4 :delete an existing note using delete : /api/note/deletenote -> login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    //find the note to be deleted and delete it
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // allow te user if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.send(401).send("Not Allowed")
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error.")

    }
})

module.exports = router;