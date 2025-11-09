const streamButtonIndexMap = {
    "stream-button-0": 0,
    "stream-button-1": 1,
    "stream-button-2": 2,
    "stream-button-3": 3,
    "stream-button-4": 4,
    "stream-button-5": 5,
    "stream-button-6": 6,
    "stream-button-7": 7,
    "stream-button-8": 8,
    "stream-button-9": 9,
};

export function getIndexFromUUID(actionUUID: string): number {
    const parts: string[] = actionUUID.split(".");
    const key: string = parts[parts.length - 1];

    const index: number | undefined =
        streamButtonIndexMap[key as keyof typeof streamButtonIndexMap];

    return index ?? -1;
}
