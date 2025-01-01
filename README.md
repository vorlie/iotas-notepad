# Iota's Notepad

Iota's Notepad is a simple note-taking application built with Electron. It allows you to create, edit, and delete notes with a user-friendly interface.

## Features

- Create new notes
- Edit existing notes
- Delete notes
- Save notes automatically to local storage
- Customizable UI with CSS variables

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/iotas-notepad.git
    cd iotas-notepad
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Start the application:
    ```sh
    npm start
    ```

## Usage

- Click the "New" button to create a new note.
- Click on a note in the sidebar to edit it.
- Use the buttons next to each note to edit the title or delete the note.
- Notes are saved automatically after 10 seconds of inactivity or when you press `Ctrl+S` (or `Cmd+S` on macOS).

## Development

To run the app in development mode with live reloading:
```sh
npm run electron
```

## Packaging

To package the app for distribution:
```sh
npm run package
```

## License

This project is licensed under the ISC License.

## Author

- vorlie

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Acknowledgements

- [Electron](https://www.electronjs.org/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
