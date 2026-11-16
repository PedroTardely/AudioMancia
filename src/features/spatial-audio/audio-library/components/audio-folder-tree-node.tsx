import type { AudioLibrarySelection } from "../types/audio-library-selection";

import { AudioAssetTreeNode } from "./audio-asset-tree-node";

import type { AudioFolderNode } from "../utils/build-audio-library-tree";

interface AudioFolderTreeNodeProps {
    node: AudioFolderNode;
    onSelect: (selection: AudioLibrarySelection) => void;
    
}

export const AudioFolderTreeNode = ({
    node,
    onSelect
}: AudioFolderTreeNodeProps) => {

    return (
        <li>
            <details>
                <summary>{node.folder.name}</summary>

                <button
                type="button"
                onClick={() => {
                    onSelect({
                        type: 'folder',
                        relativePath: node.folder.relativePath
                    });
                }}
            >
                Selecionar pasta
            </button>

                <ul>
                    {node.folders.map(child => (
                        <AudioFolderTreeNode 
                            key={child.folder.relativePath}
                            node={child}
                            onSelect={onSelect}
                        />
                    ))}

                    {node.assets.map(asset => (
                        <AudioAssetTreeNode 
                            key={asset.id}
                            asset={asset}
                            onSelect={onSelect}
                        />
                    ))}
                </ul>
            </details>
        </li>
    );
};
