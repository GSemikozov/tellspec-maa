export class SensorDisconnectedError extends Error {
    static name: string = 'SensorDisconnectedError';

    constructor(message?: string) {
        super(message);

        this.name = SensorDisconnectedError.name;
        this.message = message ?? 'Sensor connection lost';
    }
}

export const isSensorDisconnectedError = (error: unknown): error is SensorDisconnectedError => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        error.name === SensorDisconnectedError.name
    );
};
