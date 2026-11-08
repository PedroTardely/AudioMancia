export type AudioLibrarySelection =
    | {
        type: 'category';
        id: string;
    }
    | {
        type: 'folder';
        relativePath: string;
    }
    | {
        type: 'asset';
        id: string;
    }