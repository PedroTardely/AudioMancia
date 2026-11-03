import type { AudioAsset } from "./audio-asset.js";
import type { AudioFolder } from "./audio-folder.js";
import type { AudioCategory } from "./audio-category.js";

export interface AudioLibraryData {
    categories: AudioCategory[];
    assets: AudioAsset[];
    folders: AudioFolder[];
}