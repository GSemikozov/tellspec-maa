/**
 * Checks if the given date is older than the threshold set in timeThresholdMs
 * @param dateToCheck string representation of the date
 * @param timeThresholdMs number of milisecods. @sa MaxTimeSinceLastCalibrationMs
 *
 * @return true if it is older than timeThresholdMs else false.
 */
export const isGivenDateOlderThan = (dateToCheck: string, timeThresholdMs: number): boolean => {
    if (dateToCheck) {
        const testTimeAsDate = new Date(dateToCheck).getTime();

        // Get the number of miliseconds lapse since now minus the threshold.
        const timeStampThresholdMs = new Date().getTime() - timeThresholdMs;

        if (timeStampThresholdMs < testTimeAsDate) {
            return false;
        }
    }

    return true;
};
