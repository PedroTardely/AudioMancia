import path from "node:path";

export const assertPathInside = (
    basePath: string,
    targetPath: string
): void => {
    const base = path.resolve(basePath);
    const target = path.resolve(targetPath);

    const relative = path.relative(base, target);

    if (
        !relative ||
        relative === '..' ||
        relative.startsWith('..' + path.sep) ||
        path.isAbsolute(relative)
    ) {
        throw new Error(
            'Caminho inválido ou fora da biblioteca.'
        );
    }
};

const hasControlCharacters = (value: string): boolean => {
        return [...value].some(
            char => char.charCodeAt(0) <= 31
        );
    };

export const validateEntryName = (
    name: string
): string => {
    const normalized = name.trim();

    if (
        !normalized ||
        normalized === '.' ||
        normalized === '..' ||
        /[<>:"/\\|?*]/.test(normalized) ||
        hasControlCharacters(normalized) ||
        /[. ]$/.test(normalized) ||
        /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(normalized)
    ) {
        throw new Error(
            'Nome de arquivo ou pasta inválido.'
        );
    }

    return normalized;
}