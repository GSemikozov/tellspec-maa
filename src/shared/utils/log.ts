export const log = (subject: string, payload: any) => {
    console.log(subject, payload, `[stringified payload]: ${JSON.stringify(payload)}`);
};
