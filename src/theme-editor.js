const variableGroups = {
    "Backgrounds": [
        "--color-bg-dark",
        "--color-bg-dark-alpha",
        "--color-bg-darker",
        "--color-bg-darker-alpha",
        "--color-bg-medium",
        "--color-bg-medium-alpha",
        "--color-bg-light",
        "--color-bg-light-alpha"
    ],
    "Text & Feedback": [
        "--color-text",
        "--color-placeholder",
        "--color-close-hover",
        "--color-button-download-text"
    ],
    "Borders & UI": [
        "--color-border",
        "--color-hover",
        "--color-hover-light",
        "--color-button-download",
        "--color-button-download-hover"
    ],
    "Scrollbar": [
        "--color-scrollbar-bg",
        "--color-scrollbar-thumb",
        "--color-scrollbar-thumb-hover"
    ]
};

const main = document.getElementById('variable-groups');
const themeNameInput = document.getElementById('theme-name');

// Get all unique variables used in the groups
const allVars = Object.values(variableGroups).flat();

// Get current theme values from the main window's style (or default to mocha)
const currentTheme = {};

function init() {
    // Try to get current theme from localStorage
    const savedThemeFlavor = localStorage.getItem('themeFlavor') || 'mocha';
    const customThemes = JSON.parse(localStorage.getItem('customThemes')) || {};
    
    // Use the default mocha values if not found.
    const defaultMocha = {
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
    };

    const baseTheme = customThemes[savedThemeFlavor] || defaultMocha;

    Object.keys(variableGroups).forEach(groupName => {
        const groupEl = document.createElement('section');
        groupEl.className = 'group';
        groupEl.innerHTML = `<h2>${groupName}</h2>`;
        
        const grid = document.createElement('div');
        grid.className = 'variables-grid';
        
        variableGroups[groupName].forEach(varName => {
            const initialValue = baseTheme[varName] || '#ffffff';
            currentTheme[varName] = initialValue;
            
            const item = document.createElement('div');
            item.className = 'variable-item';
            
            const cleanName = varName.replace('--color-', '').replace(/-/g, ' ');
            
            item.innerHTML = `
                <label>${cleanName}</label>
                <div class="input-wrapper">
                    <input type="color" value="${convertToHex(initialValue)}" oninput="updateVar('${varName}', this.value, 'color')">
                    <input type="text" value="${initialValue}" class="color-text-input" oninput="updateVar('${varName}', this.value, 'text')">
                </div>
            `;
            grid.appendChild(item);
        });
        
        groupEl.appendChild(grid);
        main.appendChild(groupEl);
    });
}

function convertToHex(color) {
    if (color.startsWith('#')) return color.substring(0, 7);
    return '#000000'; // Default if not hex
}

function updateVar(varName, value, type) {
    currentTheme[varName] = value;
    
    // Sync the two inputs
    const item = Array.from(document.querySelectorAll('.variable-item')).find(el => el.querySelector('label').textContent === varName.replace('--color-', '').replace(/-/g, ' '));
    if (item) {
        if (type === 'color') {
            item.querySelector('.color-text-input').value = value;
        } else {
            const hex = convertToHex(value);
            item.querySelector('input[type="color"]').value = hex;
        }
    }
}

function previewTheme() {
    window.API.send('apply-theme-preview', currentTheme);
}

function saveTheme() {
    const name = themeNameInput.value.trim();
    if (!name) {
        alert('Please enter a theme name');
        return;
    }
    
    const customThemes = JSON.parse(localStorage.getItem('customThemes')) || {};
    customThemes[name] = currentTheme;
    localStorage.setItem('customThemes', JSON.stringify(customThemes));
    
    window.API.send('update-themes');
    alert(`Theme "${name}" saved! You can select it in Settings.`);
}

init();
