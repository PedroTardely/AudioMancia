import type { AudioAsset } from "../../shared/types/audio-asset";
import type { AudioFolder } from "../../shared/types/audio-folder";
import type { AudioLibraryData } from "../../shared/types/audio-library-data";
import type { AudioCategory } from "../../shared/types/audio-category";

export {};

declare global {
    interface Window {
        electronAPI: {
            ping: () => Promise<string>;

            importAudio: (
                categoryId: string,
                folderRelativePath?: string
            ) => Promise<AudioAsset | null>;

            getAudioLibrary: () => Promise<AudioLibraryData>;

            createAudioFolder: (name: string, categoryId: string, parentRelativePath?: string) => Promise<AudioFolder>; 

            createAudioCategory: (
                name: string
            ) => Promise<AudioCategory>;

            deleteAudioFolder: (
                relativePath: string
            ) => Promise<string>;

            deleteAudioAsset: (assetId: string) => Promise<string>;

            renameAudioFolder: (
                relativePath: string,
                newName: string
            ) => Promise<string>;

            renameAudioAsset: (
                assetId: string,
                newName: string
            ) => Promise<AudioAsset>;

            moveAudioAsset: (
                assetId: string,
                destinationCategoryId: string,
                destinationFolderRelativePath?: string
            ) => Promise<AudioAsset>;

            renameAudioCategory: (
                categoryId: string,
                newName: string
            ) => Promise<AudioCategory>;

            deleteAudioCategory: (
                categoryId: string
            ) => Promise<string>;

            moveAudioFolder: (
                folderRelativePath: string,
                destinationCategoryId: string,
                destinationFolderRelativePath?: string
            ) => Promise<AudioLibraryData>;
        };
    }
}