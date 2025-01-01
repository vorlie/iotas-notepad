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
        status.textContent = "Unsaved changes...";
        clearTimeout(saveTimeout);

        saveTimeout = setTimeout(() => {
            localStorage.setItem("notes", JSON.stringify(notes));
            status.textContent = "All changes saved";
        }, 10000); // Save after 10 second of inactivity
    };

    // Save content with Ctrl+S (or Cmd+S)
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault();
            localStorage.setItem("notes", JSON.stringify(notes));
            status.textContent = "All changes saved";
        }
    });
}

function createNoteElement(note, index) {
    const li = document.createElement("li");
    li.textContent = note.title;
    li.onclick = () => selectNote(li, index);

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="bi bi-pencil-fill"></i>';
    editButton.className = "note-button";
    editButton.onclick = (e) => {
        e.stopPropagation();
        editNoteTitle(index);
    };

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="bi bi-trash-fill"></i>';
    deleteButton.className = "note-button";
    deleteButton.onclick = (e) => {
        e.stopPropagation();
        deleteNote(index);
    };

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