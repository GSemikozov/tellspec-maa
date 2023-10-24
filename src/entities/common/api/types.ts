export type AddLogRequest = {
    app: string;
    version_store: string;
    message: string;

    // base64
    image?: string;
    state?: string;
    email?: string;
    date?: number;
};

export type AddLogResponse = {
    success: true;
};
