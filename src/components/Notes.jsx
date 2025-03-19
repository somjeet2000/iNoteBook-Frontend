import React, { useRef, useContext, useEffect, useState } from 'react';
import noteContext from '../context/notes/NoteContext';
import NoteItem from './NoteItem';
import EditNote from './EditNote';
import { useNavigate } from 'react-router-dom';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import AddNote2 from './AddNote2';

const Notes = ({ searchTag }) => {
  const context = useContext(noteContext);
  const { notes, getAllNotes, searchNote } = context;
  const [selectedNote, setSelectedNote] = useState(null);
  const navigate = useNavigate();
  const [addNote, setAddNote] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state
  const [isHovered, setIsHovered] = useState(false);

  let ref = useRef(null);
  let refClose = useRef(null);
  let addNoteRef = useRef(null);
  let addNoteRefClose = useRef(null);

  const updateNote = (currentNote) => {
    setSelectedNote(currentNote);
    // Adding a small timeout to ensure the state is updated
    setTimeout(() => {
      ref.current.click();
    }, 0);
  };

  // To display the notes for the user.
  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('token');
      const tokenSetTime = localStorage.getItem('tokenSetTime');
      if (token && tokenSetTime) {
        const currentTime = Date.now();
        const tokenAge = currentTime - parseInt(tokenSetTime, 10);
        if (tokenAge > 3600000) {
          // 1 hour = 3600000 ms
          localStorage.removeItem('token');
          localStorage.removeItem('tokenSetTime');
          navigate('/login');
        } else {
          setLoading(true);
          await getAllNotes();
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    };
    fetchNotes();
  }, []);

  // Reset token timestamp on user activity
  useEffect(() => {
    const resetTimer = () => {
      localStorage.setItem('tokenSetTime', Date.now().toString());
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, []);

  useEffect(() => {
    if (!searchTag) {
      getAllNotes(); // Fetch all notes when searchTag is empty
    } else {
      searchNote(searchTag); // Otherwise, search based on tag
    }
  }, [searchTag]);

  const handleClick = () => {
    setSelectedNote(null);
    setAddNote(true);
    setTimeout(() => {
      addNoteRef.current.click();
    }, 0);
  };

  // Show Bootstrap Spinner when loading
  if (loading) {
    return (
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='container my-3'>
      <div className='row'>
        <div className='d-flex justify-content-between align-items-center'>
          <h2 className='col-11'>Your Notes</h2>
          <div className='col-1 d-flex justify-content-center'>
            <button
              className='btn btn-outline-dark rounded-circle'
              onClick={handleClick}
              style={{
                backgroundColor: isHovered ? 'black' : 'white',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '40px',
                height: '40px',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={() => setIsHovered(true)} // Set hover state to true
              onMouseLeave={() => setIsHovered(false)} // Set hover state to false
            >
              <i
                className='fa-solid fa-plus'
                style={{
                  fontSize: '20px',
                  color: isHovered ? 'white' : 'black',
                }}
              ></i>
            </button>
          </div>
        </div>

        {notes.length === 0 ? (
          <p className='text-muted'>No Notes to display.</p>
        ) : (
          notes.map((note) => {
            return (
              <NoteItem key={note._id} notes={note} updateNote={updateNote} />
            );
          })
        )}
      </div>
      {/* You can't use ref={ref} here, you have to use reference or any other prop name. */}
      {selectedNote && (
        <EditNote
          reference={ref}
          referenceClose={refClose}
          selectedNote={selectedNote}
        />
      )}

      {addNote && (
        <AddNote2
          addNoteReference={addNoteRef}
          addNoteReferenceClose={addNoteRefClose}
        />
      )}
    </div>
  );
};

export default Notes;
