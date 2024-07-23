import React, { useContext } from "react";
import "./NoteItem.css"; // Assuming you will add some CSS in a separate file
import noteContext from "../context/notes/noteContext";
const NoteItem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote } = props;

  return (
    <div className="col-md-3">
      <div className="card my-3 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text">{note.description}</p>
          <div className="card-buttons">
            <button className="btn btn-outline-danger mx-2">
              <i
                className="fa-solid fa-trash"
                onClick={() => {
                  deleteNote(note._id);
                  props.showAlert("Deleted successfully", "success");
                }}
              ></i>
            </button>
            <button
              className="btn btn-outline-primary mx-2"
              onClick={() => {
                updateNote(note);
              }}
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
