import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) => {
    const initialNotes = [
        {
            "_id": "66cd7e261e51e9556ce71c2b",
            "user": "66b470e4fb690663b9a79ee7",
            "title": "My New Note",
            "description": "Please access the playlist",
            "tag": "Personal",
            "date": "2024-08-27T07:20:06.276Z",
            "__v": 0
        }
    ];

    const [notes, setNotes] = useState(initialNotes);

    return (
        <NoteContext.Provider value={{ notes }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;