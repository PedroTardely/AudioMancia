import type { AudioCategoryNode } from "../utils/build-audio-library-tree";

import type { AudioLibrarySelection } from "../types/audio-library-selection";

import { AudioFolderTreeNode } from "./audio-folder-tree-node";
import { AudioAssetTreeNode } from "./audio-asset-tree-node";

interface AudioCategoryTreeNodeProps {
    node: AudioCategoryNode;
    onSelect: (selection: AudioLibrarySelection) => void;
}
    
export const  AudioCategoryTreeNode = ({
    node,
    onSelect
}: AudioCategoryTreeNodeProps ) => {



    return (
        <li>
            <details>
                <summary>{node.category.name}</summary>

                <button
                type="button"
                onClick={() => {
                    onSelect({
                        type: 'category',
                        id: node.category.id
                    });
                }}
            >
                Selecionar categoria
            </button>

                <ul>
                    {node.folders.map(folderNode => (
                        <AudioFolderTreeNode 
                            key={folderNode.folder.relativePath}
                            node={folderNode}
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
}
