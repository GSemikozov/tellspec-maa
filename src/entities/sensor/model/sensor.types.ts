/**
 * this is the calibration type that is supported by the model.
 */
export enum CalibrationType {
    DISCONNECTED = 'disconnected',
    PAIRED = 'paired',
    LAST = 'last',
    FACTORY = 'factory',
}

/**
 * This is the parameter for running the trained model
 */
export interface SensorModelType {
    scans: string[]; // [uuids]
    average: boolean;
    'calib-to-use': CalibrationType; // paired|last|factory,
}

/**
 * this is the end point calibration data type
 */
export interface SensorCalibrationPostType {
    model: string; // NIR-S-G1
    serial_number: string; // ie. TS01692
    white_reference: {
        'scan-data': {
            'active-config-name': string; // ie. TSH20X9
        };
    };
}

/**
 * this is the sensor result type
 */
export interface SensorResultType {
    success: boolean;
    last_calibration: string;
    config: string;
}

/**
 * This is the scanner result data type.
 */
export interface SensorScannerResult {
    model: string; // ie. NIR-S-G1
    serial_number: string; // ie. TS01692
    try_configs: []; // ie. ["TSH20X9","TSH16X9","Tellspec"]
    white_reference: any;
    last_calibration: string; // ie. 2020-02-26 13:51:21
    notes: string; // ie. some notes
    created_at: string; // ie. 2019-07-23 19:34:19
    calibrations: [
        {
            config: string; // ie. TSH20X9
            last_modified_at: string; // ie 2020-02-26 13:51:21
            created_at: string; // ie, 2019-10-18 15:49:56
        },
    ];
}

/**
 * Defines the post scan result data.
 */
export interface SensorPostScanResult {
    success: boolean;
    'failed-scan': []; // [scan uuid]
}
