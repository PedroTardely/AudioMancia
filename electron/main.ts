import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAudioLibraryBasePath, initializeAudioLibrary, importAudioFile, readLibraryMetadata, createAudioFolder, deleteAudioFolder, deleteAudioAsset, renameAudioFolder, renameAudioAsset, moveAudioAsset, createAudioCategory, renameAudioCategory, deleteAudioCategory, moveAudioFolder } from './services/audio-library-service.js';

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
}

ipcMain.handle('ping', () => {
    return 'pong';
});

ipcMain.handle('audio:create-folder', (_, name, categoryId, parentRelativePath) => {
    const folder = createAudioFolder(
        name,
        categoryId,
        parentRelativePath
    );

    return folder;
});

ipcMain.handle('audio:import', async (_, categoryId, folderRelativePath) => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {
                name: 'Áudios',
                extensions: ['mp3', 'wav', 'ogg']
            }
        ]
    });

    if (result.canceled) {
        return null;
    }

    const filePath = result.filePaths[0];

    const asset = importAudioFile(
        filePath,
        categoryId,
        folderRelativePath
    );

    return asset
});

ipcMain.handle('audio:list', () => {
    return readLibraryMetadata();
});

ipcMain.handle('audio:delete-folder', (_, relativePath) => {
    return deleteAudioFolder(relativePath);
});

ipcMain.handle('audio:delete-asset', (_, assetId) => {
    return deleteAudioAsset(assetId);
});

ipcMain.handle(
    'audio:rename-folder',
    (_, relativePath, newName) => {
        return renameAudioFolder(
            relativePath,
            newName
        );
    }
);

ipcMain.handle(
    'audio:rename-asset',
    (_, assetId, newName) => {
        return renameAudioAsset(
            assetId,
            newName
        );
    }
);

ipcMain.handle(
    'audio:move-asset',
    (_, assetId, destinationCategoryId, destinationFolderRelativePath) => {
        return moveAudioAsset(
            assetId,
            destinationCategoryId,
            destinationFolderRelativePath
        );
    }
);

ipcMain.handle(
    'audio:create-category',
    (_, name) => {
        return createAudioCategory(name);
    }
);

ipcMain.handle(
    'audio:rename-category',
    (_, categoryId, newName) => {
        return renameAudioCategory(
            categoryId,
            newName
        );
    }
);

ipcMain.handle(
    'audio:delete-category',
    (_, categoryId) => {
        return deleteAudioCategory(
            categoryId
        );
    }
);

ipcMain.handle(
    'audio:move-folder',
    (
        _, 
        folderRelativePath, 
        destinationCategoryId, 
        destinationFolderRelativePath
    ) => {
        return moveAudioFolder(
            folderRelativePath,
            destinationCategoryId,
            destinationFolderRelativePath
        );
    }
);

app.whenReady().then(() => {

    initializeAudioLibrary();

    const libraryBasePath = getAudioLibraryBasePath();

    console.log('Library path', libraryBasePath);

    createWindow();

});