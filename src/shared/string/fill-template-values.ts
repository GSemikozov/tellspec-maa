export const fillTemplateValues = (template: string, payload: Record<string, any>) => {
    const payloadEntries = Object.entries(payload);

    let result = template;

    payloadEntries.forEach(([key, value]) => {
        const templateKey = new RegExp(`\\\${${key}}`);

        if (result.search(templateKey) > -1) {
            result = result.replace(templateKey, value);
        }
    });

    return result;
};
