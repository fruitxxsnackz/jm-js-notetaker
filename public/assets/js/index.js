document.addEventListener('DOMContentLoaded', function () {
  const noteheader = document.querySelector('.note-title');
  const maintext = document.querySelector('.note-textarea');
  const savingnotes = document.querySelector('.save-note');
  const makenewnote = document.querySelector('.new-note');
  const notescontainer = document.querySelector('.list-container .list-group');
  let activeNote = {};

  function showelementscont(element, display) {
      element.style.display = display; }

  function getnoteinform() {
      return {
        title: noteheader.value,
        text: maintext.value };
  }

  function clearnoteselem() {
      noteheader.value = '';
      maintext.value = ''; }

  async function fetchnotes() {
      try {
          const response = await fetch('/api/notes', {
              method: 'GET',
              headers: {'Content-Type': 'application/json'}
          });
          return await response.json();
      } catch (error) {
          console.error('Fetch notes failed:', error);  }
  }

  async function savenote(note) {
      try {
          const response = await fetch('/api/notes', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(note)
          });
          return await response.json();
      } catch (error) {
          console.error('Save note failed:', error);  }
  }

  async function deletenotes(id) {
      try {
          await fetch(`/api/notes/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
          });  } catch (error) {
          console.error('Delete note failed:', error);  }
  }

  function rendernoteinform(note) {
      if (note.id) {
        noteheader.value = note.title;
        maintext.value = note.text;
        showelementscont(savingnotes, 'none');
        showelementscont(makenewnote, 'inline');
        noteheader.setAttribute('readonly', true);
         maintext.setAttribute('readonly', true);
      } else {
         clearnoteselem();
         showelementscont(savingnotes, 'inline');
         showelementscont(makenewnote, 'none');
         noteheader.removeAttribute('readonly');
         maintext.removeAttribute('readonly');
      }
  }

  function makenotessection(note) {
      const noteItem = document.createElement('li');
      noteItem.classList.add('list-group-item');
      noteItem.innerHTML = `<span class='list-item-title'>${note.title}</span>
                              <i class='fas fa-trash-alt float-right text-danger delete-note'></i>`;
      noteItem.querySelector('.list-item-title').addEventListener('click', () => rendernoteinform(note));
      noteItem.querySelector('.delete-note').addEventListener('click', () => notedeletingfunc(note.id));
      return noteItem;
  }

  async function renderingnotes() {
      const notes = await fetchnotes();
      notescontainer.innerHTML = '';
      notes.forEach(note => {
       const noteElement = makenotessection(note);
       notescontainer.appendChild(noteElement);
      });
  }

  async function notesavingfunc() {
     const noteinfo = getnoteinform();
    await savenote(noteinfo);
    await renderingnotes();
    rendernoteinform({}); }

  async function notedeletingfunc(id) {
    await deletenotes(id);
    await renderingnotes();
     rendernoteinform({}); }

  function eventlistenersfunction() {
      savingnotes.addEventListener('click', notesavingfunc);
      makenewnote.addEventListener('click', () => rendernoteinform({}));
      [noteheader, maintext].forEach(input => {
         input.addEventListener('keyup', () => {
         const { title, text } = getnoteinform();
         const display = title.trim() && text.trim() ? 'inline' : 'none';
         showelementscont(savingnotes, display);
          });
      });
  }
  eventlistenersfunction();
  renderingnotes();
});