import type { AudioAsset } from "../../../../../shared/types/audio-asset";
import type { AudioLibrarySelection } from "../types/audio-library-selection";



interface AudioAssetTreeNodeProps {
    asset: AudioAsset;
    onSelect: (selection: AudioLibrarySelection) => void;
}

export const AudioAssetTreeNode = ({
    asset,
    onSelect
}: AudioAssetTreeNodeProps) => {



    return (
        <li>
            <p>{asset.name}</p>

            <button
                type="button"
                onClick={() => {
                    onSelect({
                        type: 'asset',
                        id: asset.id
                    })
                }}
            >
                Selecionar áudio
            </button>
        </li>
    )
}