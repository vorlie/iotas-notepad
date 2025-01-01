# Iota's Notepad

Iota's Notepad is a simple note-taking application built with Electron. It allows you to create, edit, and delete notes with a user-friendly interface.

## Features

- Create new notes
- Edit existing notes
- Delete notes
- Save notes automatically to local storage
- Customizable UI with CSS variables

## Installation

1. Download the latest release from the [releases page](https://github.com/vorlie/iotas-notepad/releases).
2. Choose one of the following options:
    - For the portable version, download `iotas-notepad-<version>-win32-x64-Portable.zip`, extract the archive, and run the executable file.
    - For the setup version, download `iotas-notepad-<version>-win32-x64-Setup.exe` and run the setup file to install the application.
3. Follow the on-screen instructions to complete the installation.
4. If you used the setup version, the app will be installed under `C:\Users\USER\AppData\Local\iotas-notepad`.

## Usage

- Click the "New" button to create a new note.
- Click on a note in the sidebar to edit it.
- Use the buttons next to each note to edit the title or delete the note.
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
