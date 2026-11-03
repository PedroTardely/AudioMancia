const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    ping: () => ipcRenderer.invoke('ping'),

    importAudio: (categoryId: string, folderRelativePath?: string) =>
        ipcRenderer.invoke('audio:import', categoryId, folderRelativePath),

    getAudioLibrary: () =>
        ipcRenderer.invoke('audio:list'),
    
    createAudioFolder: (name: string, categoryId: string, parentRelativePath?: string) =>
        ipcRenderer.invoke(
            'audio:create-folder',
            name,
            categoryId,
            parentRelativePath
        ),

    createAudioCategory:(name: string) =>
        ipcRenderer.invoke(
            'audio:create-category',
            name
        ),

    deleteAudioFolder: (relativePath: string) => 
        ipcRenderer.invoke(
            'audio:delete-folder',
            relativePath
        ),

    deleteAudioAsset: (assetId: string) =>
        ipcRenderer.invoke(
            'audio:delete-asset',
            assetId
        ),
    
    renameAudioFolder: (relativePath: string, newName: string) =>
        ipcRenderer.invoke(
            'audio:rename-folder',
            relativePath,
            newName
        ),

    renameAudioAsset: (assetId: string, newName: string) =>
        ipcRenderer.invoke(
            'audio:rename-asset',
            assetId,
            newName            
        ),

    renameAudioCategory: (
        categoryId: string,
        newName: string
    ) => 
        ipcRenderer.invoke(
            'audio:rename-category',
            categoryId,
            newName
        ),

    deleteAudioCategory: (
        categoryId: string
    ) =>
        ipcRenderer.invoke(
            'audio:delete-category',
            categoryId
        ),

    moveAudioFolder: (
        folderRelativePath: string,
        destinationCategoryId: string,
        destinationFolderRelativePath?: string
    ) =>
        ipcRenderer.invoke(
            'audio:move-folder',
            folderRelativePath,
            destinationCategoryId,
            destinationFolderRelativePath
        ),
    
    moveAudioAsset: (
        assetId: string,
        destinationCategoryId: string,
        destinationFolderRelativePath?: string
    ) =>
        ipcRenderer.invoke(
            'audio:move-asset',
            assetId,
            destinationCategoryId,
            destinationFolderRelativePath
        ),
})

