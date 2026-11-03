import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAudioLibraryBasePath, initializeAudioLibrary, listAudioFiles } from './services/audio-library-service.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const createWindow = () => {
    const window = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs')
        }
    });
    window.loadURL('http://localhost:5173');
};
ipcMain.handle('ping', () => {
    return 'pong';
});
app.whenReady().then(() => {
    initializeAudioLibrary();
    console.log('Arquivos de ambientes:', listAudioFiles('ambientes'));
    const libraryBasePath = getAudioLibraryBasePath();
    console.log('Library path', libraryBasePath);
    createWindow();
});
