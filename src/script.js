let saveTimeout;

const version = "1.0.9";

async function fetchReleases() {
    const response = await fetch('https://api.github.com/repos/vorlie/iotas-notepad/releases');
    const releases = await response.json();
    return releases;
}

function isNewerVersion(currentVersion, latestVersion) {
    const current = currentVersion.split('.').map(Number);
    const latest = latestVersion.split('.').map(Number);

    for (let i = 0; i < latest.length; i++) {
        if (latest[i] > (current[i] || 0)) {
            return true;
        } else if (latest[i] < (current[i] || 0)) {
            return false;
        }
    }
    return false;
}

async function displayReleases() {
    const releases = await fetchReleases();
    const latestRelease = releases[0]; // Get the latest release

    if (latestRelease && isNewerVersion(version, latestRelease.tag_name)) {
        // Show notification
        const notification = document.getElementById('notification');
        const message = document.getElementById('message');
        const downloadLink = document.getElementById('download-link');
        message.innerText = `New version ${latestRelease.tag_name} is available!`;
        downloadLink.href = latestRelease.assets[0].browser_download_url; // Assuming the first asset is the setup file
        downloadLink.innerText = 'Download';
        downloadLink.onclick = (e) => {
            e.preventDefault();
            const link = document.createElement('a');
            link.href = latestRelease.assets[0].browser_download_url;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        notification.classList.remove('hidden');
    }
}

document.getElementById('dismiss-button').addEventListener('click', () => {
    const notification = document.getElementById('notification');
    notification.classList.add('hidden');
});

// Load notes from local storage on startup
document.addEventListener("DOMContentLoaded", () => {
    loadNotes();
    displayReleases();
});

document.getElementById('sort-options').addEventListener('change', loadNotes);

function sortNotes(notes, option) {
    switch (option) {
        case 'index':
            break;
        case 'dateCreated':
            notes.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
            break;
        case 'dateModified':
            notes.sort((a, b) => new Date(b.dateModified) - new Date(a.dateModified));
            break;
        case 'alphabetical':
            notes.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
}

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const noteList = document.querySelector(".note-list");
    noteList.innerHTML = ""; // Clear current list

    // Update existing notes to include dateCreated, dateModified, and id if missing
    notes.forEach(note => {
        if (!note.dateCreated) note.dateCreated = new Date().toISOString();
        if (!note.dateModified) note.dateModified = new Date().toISOString();
        if (!note.id) note.id = generateUniqueId();
    });
    localStorage.setItem("notes", JSON.stringify(notes));

    const sortOption = document.getElementById('sort-options').value;
    sortNotes(notes, sortOption);

    notes.forEach((note, index) => {
        const noteItem = createNoteElement(note, index, sortOption);
        noteList.appendChild(noteItem);
    });

    // Automatically select the first note if it exists
    if (notes.length > 0) {
        const firstNoteElement = noteList.querySelector("li");
        selectNoteById(firstNoteElement.dataset.id);
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
    const newNote = {
        id: generateUniqueId(),
        title: `Note ${notes.length + 1}`, // Temporary note name
        content: "",
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString()
    };
    notes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(notes));

    const noteList = document.querySelector(".note-list");
    noteList.appendChild(createNoteElement(newNote, notes.length - 1));
}

function deleteNoteById(id) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes = notes.filter(note => note.id !== id);
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes(); // Reload UI
}

function selectNoteById(id) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const note = notes.find(note => note.id === id);
    const textarea = document.querySelector(".editor textarea");
    const status = document.querySelector(".editor .status");

    // Highlight selected note
    document.querySelectorAll(".note-list li").forEach(note => note.classList.remove("selected"));
    const selectedNoteElement = document.querySelector(`.note-list li[data-id="${id}"]`);
    if (selectedNoteElement) {
        selectedNoteElement.classList.add("selected");
    }

    // Load content into the editor
    textarea.value = note ? note.content : "";

    // Track content changes
    textarea.oninput = () => {
        note.content = textarea.value;
        note.dateModified = new Date().toISOString(); // Update modification date
        status.textContent = "Save status: Unsaved changes...";
        clearTimeout(saveTimeout);

        saveTimeout = setTimeout(() => {
            localStorage.setItem("notes", JSON.stringify(notes));
            status.textContent = "Save status: All changes saved";
        }, 10000); // Save after 10 seconds of inactivity
    };

    // Save content with Ctrl+S (or Cmd+S)
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault();
            note.dateModified = new Date().toISOString(); // Update modification date
            localStorage.setItem("notes", JSON.stringify(notes));
            status.textContent = "Save status: All changes saved";
        }
    });
}

function saveNote() {
    const notes = getNotesFromLocalStorage();
    const selectedNoteElement = document.querySelector('.note-list li.selected');
    if (selectedNoteElement) {
        const id = selectedNoteElement.dataset.id;
        const note = notes.find(note => note.id === id);
        if (note) {
            note.content = document.querySelector('.editor textarea').value;
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
    notes.forEach((note) => {
        const noteItem = document.createElement('li');
        noteItem.className = 'export-note-item';
        noteItem.textContent = note.title;
        noteItem.onclick = () => exportSelectedNoteById(note.id);
        exportNoteList.appendChild(noteItem);
    });

    modal.style.display = 'block';
}

function closeExportModal() {
    const modal = document.getElementById('exportModal');
    modal.style.display = 'none';
}

function exportSelectedNoteById(id) {
    const notes = getNotesFromLocalStorage();
    const note = notes.find(note => note.id === id);
    const blob = new Blob([note.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    closeExportModal();
}

function exportAllNotesAsJson() {
    const notes = getNotesFromLocalStorage();
    const json = JSON.stringify(notes, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importNotes(event) {
    const files = event.target.files;
    const notes = getNotesFromLocalStorage();

    Array.from(files).forEach(file => {
        if (file.type === "text/plain") {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                const title = file.name.replace('.txt', '');
                notes.push({ id: generateUniqueId(), title, content });
                saveNotesToLocalStorage(notes);
                loadNotes();
            };
            reader.readAsText(file);
        } else {
            alert("Only .txt files are allowed.");
        }
    });
}

function getNotesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('notes')) || [];
}

function saveNotesToLocalStorage(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function createNoteElement(note, index, sortOption) {
    const li = document.createElement("li");
    li.className = "note-item";
    li.dataset.id = note.id;
    li.onclick = () => selectNoteById(note.id);

    const title = document.createElement("span");
    title.className = "note-title";
    title.textContent = note.title;

    const date = document.createElement("span");
    date.className = "note-date";

    switch (sortOption) {
        case 'index':
            date.textContent = `Index: ${index + 1}`;
            break;
        case 'dateCreated':
            date.textContent = `Created: ${new Date(note.dateCreated).toLocaleString()}`;
            break;
        case 'dateModified':
            date.textContent = `Modified: ${new Date(note.dateModified).toLocaleString()}`;
            break;
        case 'alphabetical':
            date.textContent = `Modified: ${new Date(note.dateModified).toLocaleString()}`;
            break;
        default:
            date.textContent = `Created: ${new Date(note.dateCreated).toLocaleString()}`;
            break;
    }

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const saveButton = document.createElement("button");
    saveButton.innerHTML = '<i class="bi bi-floppy-fill"></i>';
    saveButton.className = "note-button";
    saveButton.title = "Save note";
    saveButton.onclick = (e) => {
        e.stopPropagation();
        saveNote();
    };

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="bi bi-pencil-fill"></i>';
    editButton.className = "note-button";
    editButton.title = "Edit title";
    editButton.onclick = (e) => {
        e.stopPropagation();
        editNoteTitle(note);
    };

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="bi bi-trash-fill"></i>';
    deleteButton.className = "note-button";
    deleteButton.title = "Delete note";
    deleteButton.onclick = (e) => {
        e.stopPropagation();
        deleteNoteById(note.id);
    };

    actions.appendChild(saveButton);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    li.appendChild(title);
    li.appendChild(date);
    li.appendChild(actions);

    return li;
}

function editNoteTitle(note) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const noteList = document.querySelector(".note-list");
    const noteItem = Array.from(noteList.children).find(item => item.querySelector(".note-title").textContent === note.title);

    // Replace the title with an input field for editing
    const input = document.createElement("input");
    input.type = "text";
    input.value = note.title;
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
            const noteIndex = notes.findIndex(n => n.id === note.id);
            notes[noteIndex].title = newTitle;
            localStorage.setItem("notes", JSON.stringify(notes));
            loadNotes(); // Reload UI
        } else {
            alert("Title cannot be empty!");
        }
    }
}

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}