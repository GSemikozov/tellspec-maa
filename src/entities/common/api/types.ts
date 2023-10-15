export type AddLogRequest = {
    app: string;
    version_store: string;
    date: number;
    message: string;

    // base64
    image?: string;
    state?: string;
    email?: string;
};

export type AddLogResponse = {
    success: true;
};
