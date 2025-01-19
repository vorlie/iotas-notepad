let saveTimeout;

const version = "1.1.2";
const electronVersion = "33.2.1";

document.addEventListener("DOMContentLoaded", () => {
    loadNotes();
    displayReleases();
    loadSettings();
    applyThemeFlavor(); // Apply the saved theme flavor on startup

    document.getElementById('appVersion').textContent = `Version: ${version}`;
    document.getElementById('electronVersion').textContent = `Electron Version: ${electronVersion}`;

    document.addEventListener('click', (event) => {
        const contextMenu = document.getElementById('noteContextMenu');
        if (contextMenu.style.display === 'block' && !contextMenu.contains(event.target)) {
            contextMenu.style.display = 'none';
        }
    });
});

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

function openSettingsModal() {
    document.getElementById('settingsModal').style.display = 'block';
}

function closeSettingsModal() {
    document.getElementById('settingsModal').style.display = 'none';
}

function saveSettings() {
    const timeFormat = document.getElementById('timeFormat').value;
    const themeFlavor = document.getElementById('themeFlavor').value;
    localStorage.setItem('timeFormat', timeFormat);
    localStorage.setItem('themeFlavor', themeFlavor);
    closeSettingsModal();
    loadNotes(); // Reload notes to apply the new time format
    applyThemeFlavor(); // Apply the new theme flavor
}

function loadSettings() {
    const timeFormat = localStorage.getItem('timeFormat') || '12';
    const themeFlavor = localStorage.getItem('themeFlavor') || 'mocha';
    document.getElementById('timeFormat').value = timeFormat;
    document.getElementById('themeFlavor').value = themeFlavor;
}

function applyThemeFlavor() {
    const themeFlavor = localStorage.getItem('themeFlavor') || 'mocha';
    document.documentElement.setAttribute('data-theme', themeFlavor);
}

async function checkForUpdates() {
    const releases = await fetchReleases();
    const latestRelease = releases[0]; // Get the latest release

    if (latestRelease && isNewerVersion(version, latestRelease.tag_name)) {
        // Show notification for new version
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
    } else {
        // Show popup indicating the app is up-to-date
        alert('The app is up-to-date.');
    }
}

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

function deleteNoteById() {
    const noteId = document.getElementById('noteContextMenu').dataset.noteId;
    //const note = notes.find(note => note.id === noteId);
    let notes = getNotesFromLocalStorage();
    notes = notes.filter(note => note.id !== noteId);
    saveNotesToLocalStorage(notes);
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

function formatDate(dateString, isCreatedDate = false) {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeFormat = localStorage.getItem('timeFormat') || '12';
    const options = { hour: '2-digit', minute: '2-digit', hour12: timeFormat === '12' };

    if (isCreatedDate) {
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} at ${date.toLocaleTimeString([], options)}`;
    } else if (isToday) {
        return `today at ${date.toLocaleTimeString([], options)}`;
    } else if (isYesterday) {
        return `yesterday at ${date.toLocaleTimeString([], options)}`;
    } else {
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], options)}`;
    }
}

function createNoteElement(note, index, sortOption) {
    const li = document.createElement("li");
    li.className = "note-item";
    li.dataset.id = note.id;
    li.onclick = () => selectNoteById(note.id);
    li.oncontextmenu = (e) => openContextMenu(e, note.id);

    const title = document.createElement("span");
    title.className = "note-title";
    title.textContent = note.title;

    const date = document.createElement("span");
    date.className = "note-date";

    switch (sortOption) {
        case 'index':
            date.textContent = `ID: ${note.id} • Index ${index + 1}`;
            break;
        case 'dateCreated':
            date.textContent = `ID: ${note.id} • Created ${formatDate(note.dateCreated, true)}`;
            break;
        case 'dateModified':
            date.textContent = `ID: ${note.id} • Modified ${formatDate(note.dateModified)}`;
            break;
        case 'alphabetical':
            date.textContent = `ID: ${note.id} • Modified ${formatDate(note.dateModified)}`;
            break;
        default:
            date.textContent = `ID: ${note.id} • Created ${formatDate(note.dateCreated, true)}`;
            break;
    }

    li.appendChild(title);
    li.appendChild(date);

    return li;
}

function openContextMenu(event, noteId) {
    event.preventDefault();
    const contextMenu = document.getElementById('noteContextMenu');
    const { clientX: mouseX, clientY: mouseY } = event;
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    const { offsetWidth: menuWidth, offsetHeight: menuHeight } = contextMenu;

    let top = mouseY;
    let left = mouseX;

    if (mouseX + menuWidth > windowWidth) {
        left = windowWidth - menuWidth;
    }

    if (mouseY + menuHeight > windowHeight) {
        top = windowHeight - menuHeight;
    }

    // Set the note ID for context menu actions
    contextMenu.dataset.noteId = noteId;
    document.getElementById('contextMenuNoteId').innerText = `Note ID: ${noteId}`;

    // Show the context menu
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${left}px`;
    contextMenu.style.top = `${top}px`;
}

function editNoteTitle() {
    const noteId = document.getElementById('noteContextMenu').dataset.noteId;
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const noteList = document.querySelector(".note-list");
    const note = notes.find(note => note.id === noteId);
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