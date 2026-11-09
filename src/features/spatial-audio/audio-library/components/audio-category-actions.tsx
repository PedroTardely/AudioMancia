import { useState } from "react";

import type { AudioCategory } from "../../../../../shared/types/audio-category";

interface AudioCategoryActionsProps {
    category: AudioCategory;

    onRename: (
        categoryId: string,
        newName: string
    ) => Promise<void>;

    onDelete: (
        categoryId: string
    ) => Promise<void>;
}

