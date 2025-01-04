# Iota's Notepad

Iota's Notepad is a simple note-taking application built with Electron. It allows you to create, edit, and delete notes with a user-friendly interface.

## Features

- Create new notes
- Edit existing notes
- Delete notes
- Save notes automatically to local storage
- Customizable UI with CSS variables

## Installation

1. Download the latest release from the [releases page](https://github.com/vorlie/iotas-notepad/releases/latest).
2. Run the setup file to install the application.
3. Follow the on-screen instructions to complete the installation.
4. The app will be installed under:
    - Windows: `C:\Users\USER\AppData\Local\iotas-notepad`

## Checking for Updates

Iota's Notepad automatically checks for updates when the application starts. If a new version is available, an in-app notification will inform you about the update, displaying the new version number and providing a download link for the setup file. You can dismiss the notification if you choose not to update immediately. You can also manually check for updates by restarting the application.

## Usage

- Click the "New" button to create a new note.
- Click on a note in the sidebar to edit it.
- Click the "Export" or "Import" to export/import notes.
    - "Export" button opens a modal and from there you can choose which note to export.
- Type in the search bar to search notes.
- Use the buttons next to each note to edit the title, delete the note or save the note.
- Notes are saved automatically after 10 seconds of inactivity or when you press `Ctrl+S` (or `Cmd+S` on macOS).

## Development

To set up the development environment:

1. Clone the repository:
    ```sh
    git clone https://github.com/vorlie/iotas-notepad.git
    ```
2. Navigate to the project directory:
    ```sh
    cd iotas-notepad
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
4. Run the app in development mode with live reloading:
    ```sh
    npm run electron
    ```

## Packaging

To package the app for distribution:
```sh
npm run package
```

## License

This project is licensed under the MIT [LICENSE](LICENSE).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Acknowledgements

- [Electron](https://www.electronjs.org/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
