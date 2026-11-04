import { app } from 'electron';
import { lstatSync, realpathSync, rmdirSync, mkdirSync, readdirSync, existsSync, readFileSync, writeFileSync, copyFileSync, rmSync, renameSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { assertPathInside } from './audio-library-path.js';
const allowedExtensions = ['.mp3', '.wav', '.ogg'];
const isDescendantPath = (parentPath, candidatePath) => {
    const relative = path.relative(path.resolve(parentPath), path.resolve(candidatePath));
    return Boolean(relative) &&
        relative !== '..' &&
        !relative.startsWith('..' + path.sep) &&
        !path.isAbsolute(relative);
};
export const renameAudioCategory = (categoryId, newName) => {
    const libraryData = readLibraryMetadata();
    const category = libraryData.categories.find((category) => category.id === categoryId);
    if (!category) {
        throw new Error('Categoria não encontrada.');
    }
    const normalizedName = newName.trim();
    if (!normalizedName) {
        throw new Error('Nome da categoria é obrigatório.');
    }
    const newRelativePath = normalizedName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');
    const oldRelativePath = category.relativePath;
    const libraryPath = getAudioLibraryBasePath();
    const currentCategoryPath = path.join(libraryPath, oldRelativePath);
    const newCategoryPath = path.join(libraryPath, newRelativePath);
    if (newCategoryPath !== currentCategoryPath &&
        existsSync(newCategoryPath)) {
        throw new Error('Já existe uma categoria com esse nome.');
    }
    if (newCategoryPath !== currentCategoryPath) {
        renameSync(currentCategoryPath, newCategoryPath);
    }
    const updatedCategory = {
        ...category,
        name: normalizedName,
        relativePath: newRelativePath
    };
    libraryData.categories =
        libraryData.categories.map((currentCategory) => currentCategory.id === categoryId
            ? updatedCategory
            : currentCategory);
    libraryData.folders =
        libraryData.folders.map((folder) => {
            if (folder.categoryId !== categoryId) {
                return folder;
            }
            return {
                ...folder,
                relativePath: folder.relativePath.replace(oldRelativePath, newRelativePath)
            };
        });
    libraryData.assets =
        libraryData.assets.map((asset) => {
            if (asset.categoryId !== categoryId) {
                return asset;
            }
            return {
                ...asset,
                relativePath: asset.relativePath.replace(oldRelativePath, newRelativePath)
            };
        });
    writeLibraryMetadata(libraryData);
    return updatedCategory;
};
export const deleteAudioCategory = (categoryId) => {
    const libraryData = readLibraryMetadata();
    const category = libraryData.categories.find((category) => category.id === categoryId);
    if (!category) {
        throw new Error('Categoria não encontrada.');
    }
    const hasFolders = libraryData.folders.some((folder) => folder.categoryId === categoryId);
    const hasAssets = libraryData.assets.some((asset) => asset.categoryId === categoryId);
    if (hasFolders || hasAssets) {
        throw new Error('A categoria precisa estar vazia de excluída.');
    }
    const libraryPath = getAudioLibraryBasePath();
    const categoryPath = path.join(libraryPath, category.relativePath);
    if (existsSync(categoryPath)) {
        rmSync(categoryPath, {
            recursive: true,
            force: true
        });
    }
    libraryData.categories =
        libraryData.categories.filter((currentCategory) => currentCategory.id !== categoryId);
    writeLibraryMetadata(libraryData);
    return categoryId;
};
export const createAudioFolder = (name, categoryId, parentRelativePath) => {
    const libraryPath = getAudioLibraryBasePath();
    const libraryData = readLibraryMetadata();
    const category = libraryData.categories.find((category) => category.id === categoryId);
    if (!category) {
        throw new Error('Categoria não encontrada.');
    }
    const relativePath = parentRelativePath
        ? path.join(parentRelativePath, name)
        : path.join(category.relativePath, name);
    const folderPath = path.join(libraryPath, relativePath);
    if (existsSync(folderPath)) {
        throw new Error('Já existe uma pasta com esse nome nesta categoria.');
    }
    mkdirSync(folderPath, {
        recursive: true
    });
    const folder = {
        name,
        categoryId,
        relativePath
    };
    libraryData.folders.push(folder);
    writeLibraryMetadata(libraryData);
    return folder;
};
export const createAudioCategory = (name) => {
    const libraryData = readLibraryMetadata();
    const normalizedName = name.trim();
    if (!normalizedName) {
        throw new Error('Nome da categoria é obrigatório.');
    }
    const relativePath = normalizedName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
    const libraryPath = getAudioLibraryBasePath();
    const categoryPath = path.join(libraryPath, relativePath);
    if (existsSync(categoryPath)) {
        throw new Error('Já existe uma categoria com esse nome.');
    }
    const category = {
        id: randomUUID(),
        name: normalizedName,
        relativePath
    };
    mkdirSync(categoryPath, {
        recursive: true
    });
    libraryData.categories.push(category);
    writeLibraryMetadata(libraryData);
    return category;
};
export const importAudioFile = (sourcePath, categoryId, folderRelativePath) => {
    if (!existsSync(sourcePath)) {
        throw new Error('Arquivo de origem não encontrado.');
    }
    const libraryData = readLibraryMetadata();
    const category = libraryData.categories.find((category) => category.id === categoryId);
    if (!category) {
        throw new Error('Categoria não encontrada.');
    }
    const fileName = path.basename(sourcePath);
    const extension = path.extname(fileName).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
        throw new Error('Formato de áudio não suportado.');
    }
    const libraryPath = getAudioLibraryBasePath();
    const destinationFolderPath = folderRelativePath
        ? path.join(libraryPath, folderRelativePath)
        : path.join(libraryPath, category.relativePath);
    const destinationPath = path.join(destinationFolderPath, fileName);
    if (existsSync(destinationPath)) {
        throw new Error('Já existe um arquivo com esse nome nesta categoria.');
    }
    copyFileSync(sourcePath, destinationPath);
    const relativePath = folderRelativePath
        ? path.join(folderRelativePath, fileName)
        : path.join(category.relativePath, fileName);
    const asset = {
        id: randomUUID(),
        name: fileName,
        categoryId,
        relativePath
    };
    libraryData.assets.push(asset);
    writeLibraryMetadata(libraryData);
    return asset;
};
export const getAudioLibraryBasePath = () => {
    const userDataPath = app.getPath('userData');
    const libraryPath = path.join(userDataPath, 'library');
    return libraryPath;
};
export const getLibraryMetadataPath = () => {
    const libraryPath = getAudioLibraryBasePath();
    return path.join(libraryPath, 'library.json');
};
export const readLibraryMetadata = () => {
    const metadataPath = getLibraryMetadataPath();
    if (!existsSync(metadataPath)) {
        return {
            categories: [],
            assets: [],
            folders: []
        };
    }
    const fileContent = readFileSync(metadataPath, 'utf-8');
    const data = JSON.parse(fileContent);
    if (!data.categories) {
        const categories = [
            {
                id: randomUUID(),
                name: 'Ambientes',
                relativePath: 'ambientes'
            },
            {
                id: randomUUID(),
                name: 'Efeitos',
                relativePath: 'efeitos'
            },
            {
                id: randomUUID(),
                name: 'Músicas',
                relativePath: 'musicas'
            }
        ];
        const getCategoryId = (relativePath) => {
            const category = categories.find((category) => relativePath === category.relativePath ||
                relativePath.startsWith(category.relativePath + path.sep));
            if (!category) {
                throw new Error(`Categoria não encontrada para o caminho: ${relativePath}`);
            }
            return category.id;
        };
        const legacyFolders = (data.folders ?? []);
        const legacyAssets = (data.assets ?? []);
        const migratedData = {
            categories,
            folders: legacyFolders.map((folder) => ({
                name: folder.name,
                categoryId: getCategoryId(folder.relativePath),
                relativePath: folder.relativePath
            })),
            assets: legacyAssets.map((asset) => ({
                id: asset.id,
                name: asset.name,
                categoryId: getCategoryId(asset.relativePath),
                relativePath: asset.relativePath
            }))
        };
        writeLibraryMetadata(migratedData);
        return migratedData;
    }
    return {
        categories: data.categories,
        assets: (data.assets ?? []),
        folders: (data.folders ?? [])
    };
};
export const writeLibraryMetadata = (data) => {
    const metadataPath = getLibraryMetadataPath();
    const json = JSON.stringify(data, null, 2);
    writeFileSync(metadataPath, json, 'utf-8');
};
export const initializeAudioLibrary = () => {
    const libraryPath = getAudioLibraryBasePath();
    mkdirSync(libraryPath, {
        recursive: true
    });
    const metadataPath = getLibraryMetadataPath();
    if (!existsSync(metadataPath)) {
        const categories = [
            {
                id: randomUUID(),
                name: 'Ambientes',
                relativePath: 'ambientes'
            },
            {
                id: randomUUID(),
                name: 'Efeitos',
                relativePath: 'efeitos'
            },
            {
                id: randomUUID(),
                name: 'Músicas',
                relativePath: 'musicas'
            }
        ];
        for (const category of categories) {
            const categoryPath = path.join(libraryPath, category.relativePath);
            mkdirSync(categoryPath, {
                recursive: true
            });
        }
        writeLibraryMetadata({
            categories,
            assets: [],
            folders: []
        });
    }
};
export const listAudioFiles = (categoryId) => {
    const libraryData = readLibraryMetadata();
    const category = libraryData.categories.find((category) => category.id === categoryId);
    if (!category) {
        throw new Error('Categoria não encontrada.');
    }
    const libraryPath = getAudioLibraryBasePath();
    const categoryPath = path.join(libraryPath, category.relativePath);
    const files = readdirSync(categoryPath);
    const audioFiles = files.filter((file) => {
        const extension = path.extname(file).toLowerCase();
        return allowedExtensions.includes(extension);
    });
    const assets = audioFiles.map((file) => {
        return {
            name: file,
            path: path.join(categoryPath, file)
        };
    });
    return assets;
};
export const deleteAudioFolder = (relativePath) => {
    const libraryData = readLibraryMetadata();
    const folder = libraryData.folders.find((folder) => folder.relativePath === relativePath);
    if (!folder) {
        throw new Error('Pasta não cadastrada na biblioteca.');
    }
    const category = libraryData.categories.find(category => category.id === folder.categoryId);
    if (!category) {
        throw new Error('Categoria da pasta não encontrada.');
    }
    const libraryPath = getAudioLibraryBasePath();
    const categoryPath = path.resolve(getAudioLibraryBasePath(), category.relativePath);
    const folderPath = path.resolve(getAudioLibraryBasePath(), folder.relativePath);
    assertPathInside(libraryPath, categoryPath);
    assertPathInside(categoryPath, folderPath);
    if (!existsSync(folderPath)) {
        throw new Error('Pasta não encontrada.');
    }
    const hasRegisteredContents = libraryData.folders.some(currentFolder => currentFolder.relativePath !== folder.relativePath &&
        isDescendantPath(folderPath, path.resolve(libraryPath, currentFolder.relativePath))) ||
        libraryData.assets.some(asset => isDescendantPath(folderPath, path.resolve(libraryPath, asset.relativePath)));
    if (hasRegisteredContents) {
        throw new Error('A pasta possui arquivos ou subpastas cadastrados.');
    }
    const folderStats = lstatSync(folderPath);
    if (folderStats.isSymbolicLink() ||
        !folderStats.isDirectory()) {
        throw new Error('O destino não é uma pasta válida.');
    }
    const realLibraryPath = realpathSync(libraryPath);
    const realFolderPath = realpathSync(folderPath);
    assertPathInside(realLibraryPath, realFolderPath);
    const realCategoryPath = realpathSync(categoryPath);
    assertPathInside(realLibraryPath, realCategoryPath);
    assertPathInside(realCategoryPath, realFolderPath);
    const entries = readdirSync(folderPath);
    if (entries.length > 0) {
        throw new Error('A pasta precisa estar vazia para ser excluída.');
    }
    rmdirSync(folderPath);
    libraryData.folders = libraryData.folders.filter((currentFolder) => currentFolder.relativePath !== folder.relativePath);
    writeLibraryMetadata(libraryData);
    return relativePath;
};
export const deleteAudioAsset = (assetId) => {
    const libraryData = readLibraryMetadata();
    const asset = libraryData.assets.find((asset) => asset.id === assetId);
    if (!asset) {
        throw new Error('Áudio não encontrado.');
    }
    const libraryPath = getAudioLibraryBasePath();
    const audioPath = path.join(libraryPath, asset.relativePath);
    if (existsSync(audioPath)) {
        rmSync(audioPath, {
            force: true
        });
    }
    libraryData.assets = libraryData.assets.filter((asset) => asset.id !== assetId);
    writeLibraryMetadata(libraryData);
    return assetId;
};
export const renameAudioFolder = (relativePath, newName) => {
    const libraryPath = getAudioLibraryBasePath();
    const currentFolderPath = path.join(libraryPath, relativePath);
    if (!existsSync(currentFolderPath)) {
        throw new Error('Pasta não encontrada.');
    }
    const parentRelativePath = path.dirname(relativePath);
    const newRelativePath = path.join(parentRelativePath, newName);
    const newFolderPath = path.join(libraryPath, newRelativePath);
    if (existsSync(newFolderPath)) {
        throw new Error('Já existe uma pasta com esse nome neste local.');
    }
    renameSync(currentFolderPath, newFolderPath);
    const libraryData = readLibraryMetadata();
    libraryData.folders = libraryData.folders.map((folder) => {
        if (folder.relativePath === relativePath ||
            folder.relativePath.startsWith(relativePath + path.sep)) {
            return {
                ...folder,
                name: folder.relativePath === relativePath
                    ? newName
                    : folder.name,
                relativePath: folder.relativePath.replace(relativePath, newRelativePath)
            };
        }
        return folder;
    });
    libraryData.assets = libraryData.assets.map((asset) => {
        if (asset.relativePath.startsWith(relativePath + path.sep)) {
            return {
                ...asset,
                relativePath: asset.relativePath.replace(relativePath, newRelativePath)
            };
        }
        return asset;
    });
    writeLibraryMetadata(libraryData);
    return newRelativePath;
};
export const renameAudioAsset = (assetId, newName) => {
    const libraryData = readLibraryMetadata();
    const asset = libraryData.assets.find((asset) => asset.id === assetId);
    if (!asset) {
        throw new Error('Áudio não encontrado.');
    }
    const libraryPath = getAudioLibraryBasePath();
    const currentPath = path.join(libraryPath, asset.relativePath);
    if (!existsSync(currentPath)) {
        throw new Error('Arquivo de áudio não encontrado.');
    }
    const parentRelativePath = path.dirname(asset.relativePath);
    const extension = path.extname(asset.name);
    const fileNameWithoutExtension = path.basename(newName, path.extname(newName));
    const finalName = fileNameWithoutExtension + extension;
    const newRelativePath = path.join(parentRelativePath, finalName);
    const newPath = path.join(libraryPath, newRelativePath);
    if (newPath !== currentPath &&
        existsSync(newPath)) {
        throw new Error('Já existe um áudio com esse nome neste local.');
    }
    if (newPath !== currentPath) {
        renameSync(currentPath, newPath);
    }
    const updatedAsset = {
        ...asset,
        name: finalName,
        relativePath: newRelativePath
    };
    libraryData.assets =
        libraryData.assets.map((currentAsset) => currentAsset.id === assetId
            ? updatedAsset
            : currentAsset);
    writeLibraryMetadata(libraryData);
    return updatedAsset;
};
export const moveAudioAsset = (assetId, destinationCategoryId, destinationFolderRelativePath) => {
    const libraryData = readLibraryMetadata();
    const asset = libraryData.assets.find((asset) => asset.id === assetId);
    if (!asset) {
        throw new Error('Áudio não encontra');
    }
    const destinationCategory = libraryData.categories.find((category) => category.id === destinationCategoryId);
    if (!destinationCategory) {
        throw new Error('Categoria de destino não encontrada.');
    }
    const libraryPath = getAudioLibraryBasePath();
    const currentAssetPath = path.join(libraryPath, asset.relativePath);
    const destinationFolderPath = destinationFolderRelativePath
        ? path.join(libraryPath, destinationFolderRelativePath)
        : path.join(libraryPath, destinationCategory.relativePath);
    const destinationAssetPath = path.join(destinationFolderPath, asset.name);
    const currentDirectory = path.dirname(currentAssetPath);
    const relativeDestination = path.relative(libraryPath, destinationFolderPath);
    if (relativeDestination === '..' ||
        relativeDestination.startsWith('..' + path.sep) ||
        path.isAbsolute(relativeDestination)) {
        throw new Error('O destino está fora da biblioteca de áudio.');
    }
    const isSameDirectory = path.normalize(currentDirectory) ===
        path.normalize(destinationFolderPath);
    if (isSameDirectory) {
        return asset;
    }
    if (existsSync(destinationAssetPath)) {
        throw new Error('Já existe um áudio com esse nome no destino.');
    }
    renameSync(currentAssetPath, destinationAssetPath);
    const newRelativePath = destinationFolderRelativePath
        ? path.join(destinationFolderRelativePath, asset.name)
        : path.join(destinationCategory.relativePath, asset.name);
    const updatedAsset = {
        ...asset,
        categoryId: destinationCategoryId,
        relativePath: newRelativePath
    };
    libraryData.assets =
        libraryData.assets.map((currentAsset) => currentAsset.id === assetId
            ? updatedAsset
            : currentAsset);
    writeLibraryMetadata(libraryData);
    return updatedAsset;
};
export const moveAudioFolder = (folderRelativePath, destinationCategoryId, destinationFolderRelativePath) => {
    const libraryData = readLibraryMetadata();
    const folder = libraryData.folders.find((folder) => folder.relativePath === folderRelativePath);
    if (!folder) {
        throw new Error('Pasta não encontrada.');
    }
    const destinationCategory = libraryData.categories.find((category) => category.id === destinationCategoryId);
    if (!destinationCategory) {
        throw new Error('Categoria de destino não encontrada.');
    }
    if (destinationFolderRelativePath) {
        const destinationFolder = libraryData.folders.find((folder) => folder.relativePath ===
            destinationFolderRelativePath);
        if (!destinationFolder) {
            throw new Error('Pasta de destino não encontrada.');
        }
        if (destinationFolder.categoryId !==
            destinationCategoryId) {
            throw new Error('A pasta de destino não pertence à categoria selecionada.');
        }
    }
    const libraryPath = getAudioLibraryBasePath();
    const currentFolderPath = path.join(libraryPath, folder.relativePath);
    if (!existsSync(currentFolderPath)) {
        throw new Error('Pasta física não encontrada.');
    }
    const destinationParentRelativePath = destinationFolderRelativePath
        ? destinationFolderRelativePath
        : destinationCategory.relativePath;
    const newFolderRelativePath = path.join(destinationParentRelativePath, folder.name);
    const newFolderPath = path.join(libraryPath, newFolderRelativePath);
    if (destinationParentRelativePath === folder.relativePath ||
        destinationParentRelativePath.startsWith(folder.relativePath + path.sep)) {
        throw new Error('Uma pasta não pode ser movida para dentro dela mesma.');
    }
    if (existsSync(newFolderPath)) {
        throw new Error('Já existe uma pasta com esse nome no destino.');
    }
    renameSync(currentFolderPath, newFolderPath);
    const oldPrefix = folder.relativePath;
    const newPrefix = newFolderRelativePath;
    libraryData.folders =
        libraryData.folders.map((currentFolder) => {
            const isMovedFolder = currentFolder.relativePath === oldPrefix;
            const isChildFolder = currentFolder.relativePath.startsWith(oldPrefix + path.sep);
            if (!isMovedFolder &&
                !isChildFolder) {
                return currentFolder;
            }
            const relativeSuffix = currentFolder.relativePath.slice(oldPrefix.length);
            return {
                ...currentFolder,
                categoryId: destinationCategoryId,
                relativePath: newPrefix + relativeSuffix
            };
        });
    libraryData.assets =
        libraryData.assets.map((asset) => {
            const isInsideFolder = asset.relativePath.startsWith(oldPrefix + path.sep);
            if (!isInsideFolder) {
                return asset;
            }
            const relativeSuffix = asset.relativePath.slice(oldPrefix.length);
            return {
                ...asset,
                categoryId: destinationCategoryId,
                relativePath: newPrefix + relativeSuffix
            };
        });
    writeLibraryMetadata(libraryData);
    return libraryData;
};
