export const normalizePath = (value: string): string => {
    return value
        .replace(/\\/g, '/')
        .replace(/\/+$/, '');
};

export const getParentPath = (relativePath : string): string => {
    const normalized = relativePath.replace(/\\/g, '/');
    const separatorIndex = normalized.lastIndexOf('/');

    return separatorIndex === -1
        ? ''
        : normalized.slice(0, separatorIndex);
};

export const isSameOrDescendant = (parent: string, candidate: string): boolean => {
  const normalizedParent = normalizePath(parent);
  const normalizedCandidate = normalizePath(candidate);

  return (
    normalizedCandidate === normalizedParent ||
    normalizedCandidate.startsWith(normalizedParent + "/")
  );
};