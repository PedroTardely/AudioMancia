import { useState, useEffect } from "react";
import type { AudioAsset } from "../../../../../shared/types/audio-asset";
import type { AudioFolder } from "../../../../../shared/types/audio-folder";
import type { AudioCategory } from "../../../../../shared/types/audio-category";

export const useAudioLibrary = () => {
    const [assets, setAssets] = useState<AudioAsset[]>([]);

    const [folders, setFolders] = useState<AudioFolder[]>([]);

    const [categories, setCategories] = useState<AudioCategory[]>([]);
 

    useEffect(() => {
            const loadLibrary = async () => {
                const library =
                    await window.electronAPI.getAudioLibrary();

                setCategories(library.categories);
                setAssets(library.assets);
                setFolders(library.folders);
            };

            loadLibrary();
        }, []);

    const importAudio = async (categoryId: string, folderRelativePath?: string) => {
        const asset = await window.electronAPI.importAudio(categoryId, folderRelativePath);

        if (!asset) {
            return;
        }

        setAssets((currentAssets) => [
            ...currentAssets,
            asset
        ]);
    };

    const createCategory = async (
        name:string
    ) => {
        const category =
            await window.electronAPI.createAudioCategory(
                name
            );

        setCategories((currentCategories) => [
            ...currentCategories,
            category
        ]);
    };

    const createFolder = async (
        name: string,
        categoryId: string,
        parentRelativePath?: string
    ) => {
        const folder =
            await window.electronAPI.createAudioFolder(
                name,
                categoryId,
                parentRelativePath
            );
        
        setFolders((currentFolders) => [
            ...currentFolders,
            folder
        ]);
    };

    const deleteFolder = async (
        relativePath: string
    ) => {
        const deletedPath = 
        await window.electronAPI.deleteAudioFolder(
            relativePath
        );

        setFolders((currentFolders) => 
        currentFolders.filter((folder) =>
            folder.relativePath !== deletedPath &&
            !folder.relativePath.startsWith(
                deletedPath + '\\'
            )
        )
    );

    setAssets((currentAssets) =>
        currentAssets.filter((asset)=>
        !asset.relativePath.startsWith(
            deletedPath + '\\'
        )
        )
    );
    };

    const deleteAsset = async(
        assetId: string
    ) => {
        const deletedAssetId = 
            await window.electronAPI.deleteAudioAsset(
                assetId
            );

            setAssets((currentAssets) =>
                currentAssets.filter(
                    (asset) => asset.id !== deletedAssetId
                )
            );
    };

    const renameFolder = async (
        relativePath: string,
        newName: string
    ) => {
        const newRelativePath = 
            await window.electronAPI.renameAudioFolder(
                relativePath,
                newName
            );

        setFolders((currentFolders) => 
        currentFolders.map((folder) => {
            if (
                folder.relativePath === relativePath ||
                folder.relativePath.startsWith(
                    relativePath + '\\'
                )
            ) {
                return {
                    ...folder,
                    name:
                        folder.relativePath ===relativePath
                            ? newName
                            : folder.name,
                    relativePath:
                        folder.relativePath.replace(
                            relativePath,
                            newRelativePath
                        )
                    };
                }

                return folder;
            })

        );

        setAssets((currentAssets) =>
            currentAssets.map((asset) => {
                if (
                    asset.relativePath.startsWith(
                        relativePath + '\\'
                    )
                ) {
                    return {
                        ...asset,
                        relativePath:
                            asset.relativePath.replace(
                                relativePath,
                                newRelativePath
                            )
                    };
                }

                return asset;
            })
        );
    };

    const renameAsset = async (
        assetId: string,
        newName: string
    ) => {
        const updatedAsset = 
            await window.electronAPI.renameAudioAsset(
                assetId,
                newName
            );

        setAssets((currentAssets) =>
            currentAssets.map((asset) => 
                asset.id === updatedAsset.id
                    ? updatedAsset
                    :asset
            )    
        );
    };

    const moveAsset = async (
        assetId: string,
        destinationCategoryId: string,
        destinationFolderRelativePath?: string
    ) => {
        const updatedAsset =
            await window.electronAPI.moveAudioAsset(
                assetId,
                destinationCategoryId,
                destinationFolderRelativePath
            );
        
        setAssets((currentAssets) =>
            currentAssets.map((asset) =>
                asset.id === updatedAsset.id
                    ? updatedAsset
                    : asset
            )
        );
    };

    const moveFolder = async (
        folderRelativePath: string,
        destinationCategoryId: string,
        destinationFolderRelativePath?: string
    ) => {
        const updatedLibrary =
            await window.electronAPI.moveAudioFolder(
                folderRelativePath,
                destinationCategoryId,
                destinationFolderRelativePath
            );

            setFolders(updatedLibrary.folders);
            setAssets(updatedLibrary.assets);
    };

    const renameCategory = async (
        categoryId: string,
        newName: string
    ) => {
        const oldCategory = categories.find(
            (category) => category.id === categoryId
        );

        if (!oldCategory) {
            return;
        }

        const updatedCategory = 
            await window.electronAPI.renameAudioCategory(
                categoryId,
                newName
            );

        setCategories((currentCategories) =>
            currentCategories.map((category) =>
                category.id === updatedCategory.id
                    ? updatedCategory
                    : category
            )
        );

        setFolders((currentFolders) =>
            currentFolders.map((folder) => {
                if (folder.categoryId !== categoryId) {
                    return folder;
                }

                return {
                    ...folder,
                    relativePath:
                        folder.relativePath.replace(
                            oldCategory.relativePath,
                            updatedCategory.relativePath
                        )
                };
            })
        );

        setAssets((currentAssets) =>
            currentAssets.map((asset) => {
                if (asset.categoryId !== categoryId) {
                    return asset;
                }

                return {
                    ...asset,
                    relativePath:
                        asset.relativePath.replace(
                            oldCategory.relativePath,
                            updatedCategory.relativePath
                        )
                };
            })
        );
    };

    const deleteCategory = async (
        categoryId: string
    ) => {
        await window.electronAPI.deleteAudioCategory(
            categoryId
        );

        setCategories((currentCategories) =>
            currentCategories.filter(
                (category) => category.id !== categoryId
            )
        );
    };

    return {
        categories,
        assets,
        folders,
        importAudio,
        createFolder,
        createCategory,
        renameCategory,
        deleteCategory,
        deleteFolder,
        deleteAsset,
        renameFolder,
        renameAsset,
        moveAsset,
        moveFolder
    };
};