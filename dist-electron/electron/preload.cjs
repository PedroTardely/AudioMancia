"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
    ping: () => ipcRenderer.invoke('ping'),
    importAudio: (categoryId, folderRelativePath) => ipcRenderer.invoke('audio:import', categoryId, folderRelativePath),
    getAudioLibrary: () => ipcRenderer.invoke('audio:list'),
    createAudioFolder: (name, categoryId, parentRelativePath) => ipcRenderer.invoke('audio:create-folder', name, categoryId, parentRelativePath),
    createAudioCategory: (name) => ipcRenderer.invoke('audio:create-category', name),
    deleteAudioFolder: (relativePath) => ipcRenderer.invoke('audio:delete-folder', relativePath),
    deleteAudioAsset: (assetId) => ipcRenderer.invoke('audio:delete-asset', assetId),
    renameAudioFolder: (relativePath, newName) => ipcRenderer.invoke('audio:rename-folder', relativePath, newName),
    renameAudioAsset: (assetId, newName) => ipcRenderer.invoke('audio:rename-asset', assetId, newName),
    renameAudioCategory: (categoryId, newName) => ipcRenderer.invoke('audio:rename-category', categoryId, newName),
    deleteAudioCategory: (categoryId) => ipcRenderer.invoke('audio:delete-category', categoryId),
    moveAudioFolder: (folderRelativePath, destinationCategoryId, destinationFolderRelativePath) => ipcRenderer.invoke('audio:move-folder', folderRelativePath, destinationCategoryId, destinationFolderRelativePath),
    moveAudioAsset: (assetId, destinationCategoryId, destinationFolderRelativePath) => ipcRenderer.invoke('audio:move-asset', assetId, destinationCategoryId, destinationFolderRelativePath),
});
