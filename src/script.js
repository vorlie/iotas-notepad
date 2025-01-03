let saveTimeout;

// Load notes from local storage on startup
document.addEventListener("DOMContentLoaded", () => {
    loadNotes();
});

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const noteList = document.querySelector(".note-list");
    noteList.innerHTML = ""; // Clear current list

    notes.forEach((note, index) => {
        const noteItem = createNoteElement(note, index);
        noteList.appendChild(noteItem);
    });

    // Automatically select the first note if it exists
    if (notes.length > 0) {
        const firstNoteElement = noteList.querySelector("li");
        selectNote(firstNoteElement, 0);
    } else {
        // Clear the editor if no notes exist
        const textarea = document.querySelector(".editor textarea");
        textarea.value = "";
        const status = document.querySelector(".editor .status");
        status.textContent = "No notes available";
    }
}

function addNote() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const newNote = `Note ${notes.length + 1}`; // Temporary note name
    notes.push({ title: newNote, content: "" });
    localStorage.setItem("notes", JSON.stringify(notes));

    const noteList = document.querySelector(".note-list");
    noteList.appendChild(createNoteElement({ title: newNote }, notes.length - 1));
}

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.splice(index, 1); // Remove the note
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes(); // Reload UI
}

function selectNote(element, index) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const textarea = document.querySelector(".editor textarea");
    const status = document.querySelector(".editor .status");

    // Highlight selected note
    document.querySelectorAll(".note-list li").forEach(note => note.classList.remove("selected"));
    element.classList.add("selected");

    // Load content into the editor
    textarea.value = notes[index].content || "";

    // Track content changes
    textarea.oninput = () => {
        notes[index].content = textarea.value;
        status.textContent = "Save status: Unsaved changes...";
        clearTimeout(saveTimeout);

        saveTimeout = setTimeout(() => {
            localStorage.setItem("notes", JSON.stringify(notes));
            status.textContent = "Save status: All changes saved";
        }, 10000); // Save after 10 second of inactivity
    };

    // Save content with Ctrl+S (or Cmd+S)
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault();
            localStorage.setItem("notes", JSON.stringify(notes));
            status.textContent = "Save status: All changes saved";
        }
    });
}

function saveNote() {
    const notes = getNotesFromLocalStorage();
    const selectedNoteElement = document.querySelector('.note-list li.selected');
    if (selectedNoteElement) {
        const index = Array.from(selectedNoteElement.parentNode.children).indexOf(selectedNoteElement);
        if (index !== -1) {
            notes[index].content = document.querySelector('.editor textarea').value;
            localStorage.setItem("notes", JSON.stringify(notes));
            document.querySelector('.status').textContent = "Save status: All changes saved";
        }
    }
}

function searchNotes(query) {
    const notes = document.querySelectorAll('.note-list li');
    notes.forEach(note => {
        if (note.textContent.toLowerCase().includes(query.toLowerCase())) {
            note.style.display = '';
        } else {
            note.style.display = 'none';
        }
    });
}

function openExportModal() {
    const modal = document.getElementById('exportModal');
    const exportNoteList = document.querySelector('.export-note-list');
    exportNoteList.innerHTML = ''; // Clear current list

    const notes = getNotesFromLocalStorage();
    notes.forEach((note, index) => {
        const noteItem = document.createElement('li');
        noteItem.className = 'export-note-item';
        noteItem.textContent = note.title;
        noteItem.onclick = () => exportSelectedNote(index);
        exportNoteList.appendChild(noteItem);
    });

    modal.style.display = 'block';
}

function closeExportModal() {
    const modal = document.getElementById('exportModal');
    modal.style.display = 'none';
}

function exportSelectedNote(index) {
    const notes = getNotesFromLocalStorage();
    const note = notes[index];
    const blob = new Blob([note.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    closeExportModal();
}

function importNotes(event) {
    const files = event.target.files;
    const notes = getNotesFromLocalStorage();

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const title = file.name.replace('.txt', '');
            notes.push({ title, content });
            saveNotesToLocalStorage(notes);
            loadNotes();
        };
        reader.readAsText(file);
    });
}

function getNotesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('notes')) || [];
}

function saveNotesToLocalStorage(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function createNoteElement(note, index) {
    const li = document.createElement("li");
    li.textContent = note.title;
    li.onclick = () => selectNote(li, index);

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const saveButton = document.createElement("button");
    saveButton.innerHTML = '<i class="bi bi-floppy-fill"></i>';
    saveButton.className = "note-button";
    saveButton.title = "Save note";
    saveButton.onclick = (e) => {
        e.stopPropagation();
        saveNote(index);
    };

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="bi bi-pencil-fill"></i>';
    editButton.className = "note-button";
    editButton.title = "Edit title";
    editButton.onclick = (e) => {
        e.stopPropagation();
        editNoteTitle(index);
    };

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="bi bi-trash-fill"></i>';
    deleteButton.className = "note-button";
    deleteButton.title = "Delete note";
    deleteButton.onclick = (e) => {
        e.stopPropagation();
        deleteNote(index);
    };

    actions.appendChild(saveButton);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    li.appendChild(actions);

    return li;
}

function editNoteTitle(index) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const noteList = document.querySelector(".note-list");
    const noteItem = noteList.children[index];

    // Replace the title with an input field for editing
    const input = document.createElement("input");
    input.type = "text";
    input.value = notes[index].title;
    input.className = "edit-title-input";

    // Save the edited title on blur or pressing Enter
    input.onblur = () => saveTitle();
    input.onkeydown = (e) => {
        if (e.key === "Enter") saveTitle();
    };

    noteItem.textContent = ""; // Clear existing content
    noteItem.appendChild(input);
    input.focus(); // Focus the input field

    function saveTitle() {
        const newTitle = input.value.trim();
        if (newTitle) {
            notes[index].title = newTitle;
            localStorage.setItem("notes", JSON.stringify(notes));
            loadNotes(); // Reload UI
        } else {
            alert("Title cannot be empty!");
        }
    }
}