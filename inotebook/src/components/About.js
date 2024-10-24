import React ,{useContext, useEffect} from 'react';
import NoteContext from '../context/notes/NoteContext';

export const About = () => {
  const a = useContext(NoteContext);
  useEffect(()=>{
    // eslint-disable-next-line
  },[])
  return (
    <div>
      This is About page.
    </div>
  )
}


