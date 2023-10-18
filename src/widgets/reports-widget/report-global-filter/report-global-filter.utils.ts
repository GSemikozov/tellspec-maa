export const updateURL = (data: object) => {
    const url = new URL(window.location.href);

    for (const [key, value] of Object.entries(data)) {
        url.searchParams.set(key, value);
    }

    window.history.pushState('', '', url);
};

export const parseURL = (requiredKeys: string[] | null = null) => {
    const url = new URL(window.location.href);
    const filterEntries = url.searchParams.entries();
    const data = {};

    for (const [key, value] of filterEntries) {
        if (!requiredKeys || requiredKeys.indexOf(key) !== -1) {
            data[key] = value;
        }
    }

    return data;
};
