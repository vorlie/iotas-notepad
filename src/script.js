let saveTimeout;

const version = window.API.versions.iotanotepad();
const electronVersion = window.API.versions.electron();
const nodeVersion = window.API.versions.node();
const chromeVersion = window.API.versions.chrome();


const defaultThemes = {
    mocha: {
        '--color-bg-dark': '#1e1e2e',
        '--color-bg-dark-alpha': '#1e1e2e',
        '--color-bg-darker': '#11111b',
        '--color-bg-darker-alpha': '#11111b',
        '--color-bg-medium': '#313244',
        '--color-bg-medium-alpha': '#313244',
        '--color-bg-light': '#45475a',
        '--color-bg-light-alpha': '#45475a',
        '--color-border': '#45475a',
        '--color-text': '#cdd6f4',
        '--color-placeholder': '#a6adc8',
        '--color-hover': '#313244',
        '--color-hover-light': '#45475a',
        '--color-close-hover': '#f38ba8',
        '--color-scrollbar-bg': '#2e3440',
        '--color-scrollbar-thumb': '#4c566a',
        '--color-scrollbar-thumb-hover': '#5e81ac',
        '--color-button-download': '#b4befe',
        '--color-button-download-hover': '#e3e7ff',
        '--color-button-download-text': '#11111b'
    },
    mochaMica: {
        '--color-bg-dark': '#1e1e2e',
        '--color-bg-dark-alpha': '#1e1e2e70',
        '--color-bg-darker': '#11111b',
        '--color-bg-darker-alpha': '#11111b70',
        '--color-bg-medium': '#313244',
        '--color-bg-medium-alpha': '#31324470',
        '--color-bg-light': '#45475a',
        '--color-bg-light-alpha': '#45475a70',
        '--color-border': '#45475a',
        '--color-text': '#cdd6f4',
        '--color-placeholder': '#a6adc8',
        '--color-hover': '#313244',
        '--color-hover-light': '#45475a',
        '--color-close-hover': '#f38ba8',
        '--color-scrollbar-bg': '#2e3440',
        '--color-scrollbar-thumb': '#4c566a',
        '--color-scrollbar-thumb-hover': '#5e81ac',
        '--color-button-download': '#b4befe',
        '--color-button-download-hover': '#e3e7ff',
        '--color-button-download-text': '#11111b'
    },
    macchiato: {
        '--color-bg-dark': '#24273a',
        '--color-bg-dark-alpha': '#24273a',
        '--color-bg-darker': '#181926',
        '--color-bg-darker-alpha': '#181926',
        '--color-bg-medium': '#1e2030',
        '--color-bg-medium-alpha': '#1e2030',
        '--color-bg-light': '#363a4f',
        '--color-bg-light-alpha': '#363a4f',
        '--color-border': '#494d64',
        '--color-text': '#cad3f5',
        '--color-placeholder': '#a5adcb',
        '--color-hover': '#363a4f',
        '--color-hover-light': '#494d64',
        '--color-close-hover': '#ed8796',
        '--color-scrollbar-bg': '#363a4f',
        '--color-scrollbar-thumb': '#494d64',
        '--color-scrollbar-thumb-hover': '#a5adcb',
        '--color-button-download': '#8aadf4',
        '--color-button-download-hover': '#b5bfe2',
        '--color-button-download-text': '#24273a'
    },
    macchiatoMica: {
        '--color-bg-dark': '#24273a',
        '--color-bg-dark-alpha': '#24273a70',
        '--color-bg-darker': '#181926',
        '--color-bg-darker-alpha': '#18192670',
        '--color-bg-medium': '#1e2030',
        '--color-bg-medium-alpha': '#1e203070',
        '--color-bg-light': '#363a4f',
        '--color-bg-light-alpha': '#363a4f70',
        '--color-border': '#494d64',
        '--color-text': '#cad3f5',
        '--color-placeholder': '#a5adcb',
        '--color-hover': '#363a4f',
        '--color-hover-light': '#494d64',
        '--color-close-hover': '#ed8796',
        '--color-scrollbar-bg': '#363a4f',
        '--color-scrollbar-thumb': '#494d64',
        '--color-scrollbar-thumb-hover': '#a5adcb',
        '--color-button-download': '#8aadf4',
        '--color-button-download-hover': '#b5bfe2',
        '--color-button-download-text': '#24273a'
    },
    frappe: {
        '--color-bg-dark': '#303446',
        '--color-bg-dark-alpha': '#303446',
        '--color-bg-darker': '#232634',
        '--color-bg-darker-alpha': '#232634',
        '--color-bg-medium': '#292c3c',
        '--color-bg-medium-alpha': '#292c3c',
        '--color-bg-light': '#414559',
        '--color-bg-light-alpha': '#414559',
        '--color-border': '#51576d',
        '--color-text': '#c6d0f5',
        '--color-placeholder': '#a5adcb',
        '--color-hover': '#414559',
        '--color-hover-light': '#51576d',
        '--color-close-hover': '#e78284',
        '--color-scrollbar-bg': '#414559',
        '--color-scrollbar-thumb': '#51576d',
        '--color-scrollbar-thumb-hover': '#a5adcb',
        '--color-button-download': '#8caaee',
        '--color-button-download-hover': '#b5bfe2',
        '--color-button-download-text': '#303446'
    },
    frappeMica: {
        '--color-bg-dark': '#303446',
        '--color-bg-dark-alpha': '#30344670',
        '--color-bg-darker': '#232634',
        '--color-bg-darker-alpha': '#23263470',
        '--color-bg-medium': '#292c3c',
        '--color-bg-medium-alpha': '#292c3c70',
        '--color-bg-light': '#414559',
        '--color-bg-light-alpha': '#41455970',
        '--color-border': '#51576d',
        '--color-text': '#c6d0f5',
        '--color-placeholder': '#a5adcb',
        '--color-hover': '#414559',
        '--color-hover-light': '#51576d',
        '--color-close-hover': '#e78284',
        '--color-scrollbar-bg': '#414559',
        '--color-scrollbar-thumb': '#51576d',
        '--color-scrollbar-thumb-hover': '#a5adcb',
        '--color-button-download': '#8caaee',
        '--color-button-download-hover': '#b5bfe2',
        '--color-button-download-text': '#303446'
    },
    clearDark:{
        '--color-bg-dark': '#000000',
        '--color-bg-dark-alpha': '#000000',
        '--color-bg-darker': '#0a0a0a',
        '--color-bg-darker-alpha': '#0a0a0a',
        '--color-bg-medium': '#1a1a1a',
        '--color-bg-medium-alpha': '#1a1a1a',
        '--color-bg-light': '#2a2a2a',
        '--color-bg-light-alpha': '#2a2a2a',
        '--color-border': '#3a3a3a',
        '--color-text': '#e0e0e0',
        '--color-placeholder': '#a0a0a0',
        '--color-hover': '#242424',
        '--color-hover-light': '#3a3a3a',
        '--color-close-hover': '#ff4a4a',
        '--color-scrollbar-bg': '#1a1a1a',
        '--color-scrollbar-thumb': '#3a3a3a',
        '--color-scrollbar-thumb-hover': '#5a5a5a',
        '--color-button-download': '#4a90e2',
        '--color-button-download-hover': '#357ab8',
        '--color-button-download-text': '#ffffff'
    },
    clearDarkMica: {
        '--color-bg-dark': '#000000',
        '--color-bg-dark-alpha': '#00000070',
        '--color-bg-darker': '#0a0a0a',
        '--color-bg-darker-alpha': '#0a0a0a70',
        '--color-bg-medium': '#1a1a1a',
        '--color-bg-medium-alpha': '#1a1a1a70',
        '--color-bg-light': '#2a2a2a',
        '--color-bg-light-alpha': '#2a2a2a70',
        '--color-border': '#3a3a3a',
        '--color-text': '#e0e0e0',
        '--color-placeholder': '#a0a0a0',
        '--color-hover': '#242424',
        '--color-hover-light': '#3a3a3a',
        '--color-close-hover': '#ff4a4a',
        '--color-scrollbar-bg': '#1a1a1a',
        '--color-scrollbar-thumb': '#3a3a3a',
        '--color-scrollbar-thumb-hover': '#5a5a5a',
        '--color-button-download': '#4a90e2',
        '--color-button-download-hover': '#357ab8',
        '--color-button-download-text': '#ffffff'
    }
};

document.getElementById('open-dev-tools').addEventListener('click', () => {
    window.API.openDevTools();
});

document.getElementById('open-theme-editor').addEventListener('click', () => {
    window.API.openThemeEditor();
});

document.addEventListener("DOMContentLoaded", () => {
    loadNotes();
    checkForUpdates();
    loadSettings();
    applyThemeFlavor(); // Apply the saved theme flavor on startup
    updateThemeDropdown();

    document.getElementById('appVersion').textContent = `Version: ${version}`;
    document.getElementById('electronVersion').textContent = `Electron Version: ${electronVersion}`;
    document.getElementById('nodeVersion').textContent = `Node.js Version: ${nodeVersion}`;
    document.getElementById('chromeVersion').textContent = `Chrome Version: ${chromeVersion}`;

    document.addEventListener('click', (event) => {
        const contextMenu = document.getElementById('noteContextMenu');
        if (contextMenu.style.display === 'block' && !contextMenu.contains(event.target)) {
            contextMenu.style.display = 'none';
        }
    });
});

async function fetchReleases() {
    const response = await fetch(
        "https://api.github.com/repos/vorlie/iotas-notepad/releases",
    );
    const releases = await response.json();
    return releases;
}

function isNewerVersion(currentVersion, latestVersion) {
    const current = currentVersion.split(".").map(Number);
    const latest = latestVersion.split(".").map(Number);

    for (let i = 0; i < latest.length; i++) {
        if (latest[i] > (current[i] || 0)) {
            return true;
        } else if (latest[i] < (current[i] || 0)) {
            return false;
        }
    }
    return false;
}

window.API.on('check-for-updates', () => {
    console.log("Received check-for-updates event");
    checkForUpdates();
});

async function checkForUpdates() {
    const releases = await fetchReleases();
    const latestRelease = releases[0]; // Get the latest release

    if (latestRelease && isNewerVersion(version, latestRelease.tag_name)) {
        // Show notification for new version
        const notification = document.getElementById("notification");
        const message = document.getElementById("message");
        const downloadLink = document.getElementById("download-link");
        const fileSelect = document.getElementById("file-select");

        message.innerText = `New version ${latestRelease.tag_name} is available!`;
        window.API.sendNotification('Update Available', 'A new version of the app is available.');

        // Populate the dropdown menu with available assets
        fileSelect.innerHTML = '';
        latestRelease.assets.forEach(asset => {
            const option = document.createElement('option');
            option.value = asset.browser_download_url;
            option.textContent = asset.name;
            fileSelect.appendChild(option);
        });

        downloadLink.onclick = (e) => {
            e.preventDefault();
            const downloadUrl = fileSelect.value;
            const fileName = fileSelect.options[fileSelect.selectedIndex].text;
            notification.classList.add("hidden");
            downloadFile(downloadUrl, fileName);
        };

        notification.classList.remove("hidden");
    } else {
        // Show popup indicating the app is up-to-date
        window.API.sendNotification("No Updates Available", "The app is up-to-date.");
    }
}


function downloadFile(url, fileName) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";

    // Create progress bar elements
    const progressDiv = document.createElement("div");
    progressDiv.style.width = "100%";
    progressDiv.style.backgroundColor = "var(--color-bg-dark-alpha)";
    progressDiv.style.padding = "5px";
    progressDiv.style.borderTop = "1px solid var(--color-border)";

    const fileNameDisplay = document.createElement("div");
    fileNameDisplay.textContent = `Downloading: ${fileName}`;
    fileNameDisplay.style.color = "var(--color-text)";
    fileNameDisplay.style.marginBottom = "5px";

    const progressBar = document.createElement("div");
    progressBar.style.width = "0%";
    progressBar.style.height = "5px";
    progressBar.style.backgroundColor = "var(--color-button-download)";
    progressBar.style.borderRadius = "5px";
    progressBar.style.padding = "5px";

    progressDiv.appendChild(fileNameDisplay);
    progressDiv.appendChild(progressBar);
    document.body.appendChild(progressDiv);

    xhr.onprogress = (event) => {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            progressBar.style.width = percentComplete + "%";
        }
    };

    xhr.onload = () => {
        if (xhr.status === 200) {
            const blob = xhr.response;
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = fileName; // Use the provided filename
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
        }
        document.body.removeChild(progressDiv); // Remove progress bar after download
    };

    xhr.onerror = () => {
        console.error("Download failed");
        document.body.removeChild(progressDiv); // Remove progress bar on error
    };

    xhr.send();
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
    loadTheme(themeFlavor);
}

function importTheme(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const customThemes = JSON.parse(e.target.result);
                for (const [name, theme] of Object.entries(customThemes)) {
                    saveCustomTheme(name, theme);
                }
                updateThemeDropdown();
                window.API.sendNotification('Theme Imported', 'Custom theme imported successfully.');
            } catch (error) {
                console.error(error);
                window.API.sendNotification('Theme Import Failed', 'Invalid theme file.');
            }
        };
        reader.readAsText(file);
    }
}

function deleteSelectedTheme() {
    const themeDropdown = document.getElementById('themeFlavor');
    const selectedTheme = themeDropdown.value;
    const customThemes = getCustomThemes();
    if (customThemes[selectedTheme]) {
        delete customThemes[selectedTheme];
        localStorage.setItem('customThemes', JSON.stringify(customThemes));
        updateThemeDropdown();
        window.API.sendNotification('Theme Deleted', 'Custom theme deleted successfully.');
    } else {
        window.API.sendNotification('Theme Deletion Failed', 'Cannot delete default themes.');
    }
}

function updateThemeDropdown() {
    const themeDropdown = document.getElementById('themeFlavor');
    const customThemes = getCustomThemes();
    // Clear existing custom themes
    themeDropdown.querySelectorAll('.custom-theme').forEach(option => option.remove());
    // Append custom themes
    for (const name of Object.keys(customThemes)) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        option.classList.add('custom-theme');
        themeDropdown.appendChild(option);
    }
}

function saveCustomTheme(name, theme) {
    const customThemes = JSON.parse(localStorage.getItem('customThemes')) || {};
    customThemes[name] = theme;
    localStorage.setItem('customThemes', JSON.stringify(customThemes));
}

function getCustomThemes() {
    return JSON.parse(localStorage.getItem('customThemes')) || {};
}

function applyTheme(theme) {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme)) {
        root.style.setProperty(key, value);
    }
}

function loadTheme(themeName) {
    const customThemes = getCustomThemes();
    const theme = customThemes[themeName] || defaultThemes[themeName];
    if (theme) {
        applyTheme(theme);
    } else {
        document.documentElement.setAttribute('data-theme', themeName);
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
            reader.onload = function (e) {
                const content = e.target.result;
                const title = file.name.replace('.txt', '');
                notes.push({ id: generateUniqueId(), title, content });
                saveNotesToLocalStorage(notes);
                loadNotes();
            };
            reader.readAsText(file);
        } else {
            window.API.sendNotification('Import Failed', 'Invalid file format. Please import .txt files only.');
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
            window.API.sendNotification('Invalid Title', 'Title cannot be empty.');
        }
    }
}

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}