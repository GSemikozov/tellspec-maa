/**
 * this is the calibration type that is supported by the model.
 */
export enum CalibrationType {
    PAIRED = 'paired',
    LAST = 'last',
    FACTORY = 'factory',
}

/**
 * This is the parameter for running the trained model
 */
export type RunModelRequest = {
    scans: string[]; // [uuids]
    average: boolean;
    'calib-to-use': CalibrationType;
};

export type RunModelResponse = Record<string, any>;

/**
 * this is the end point calibration data type
 */
export type SetCalibrationRequest = {
    model: string; // ie. NIR-S-G1
    serial_number: string; // ie. TS01692
    white_reference: {
        'scan-data': {
            'active-config-name': string; // ie. TSH20X9
        };
    };
};

/**
 * this is the sensor result type
 */
export type SetCalibrationResponse = {
    success: boolean;
    config: string;
    last_calibration: string;
};

export type GetCalibrationResponse = {
    config: string;
    created_at: string;
    last_modified_at: string;
    scan: {
        'scan-data': {
            debug_trigger: string;
            'scan-id': string;
            'scan-source': string;
            'scanner-type-name': string;
            'active-config-name': string;
            'scan-performed-utc': string;
            'scanner-serial-number': string;
            'scanner-firmware-version': string;
            'scanner-hardware-version': string;
            'scanner-spectrum-version': string;
            counts: number[][];
            wavelengths: number[];
            white_ref: number[][];
            factory_white_ref: number[][];
            absorbance: number[][];
            factory_absorbance: number[][];
        };

        'scan-info': {
            user_email: string;
            dlp_header: {
                pga: number;
                humidity: number;
                temperature: number;
            };
            device_info: {
                os: string[];
                version: string;
            };
        };
    };
};

export type GetScanDataRequest = {
    scans?: string[];
};

export type GetScanDataItem = {
    uuid: string;
    created_at: string;
    json_data: {
        'scan-data': {
            debug_trigger: string;
            'scan-id': '19816d60-539d-420f-b660-0de7b5286610';
            'scan-source': string;
            'scanner-type-name': string;
            'active-config-name': string;
            'scan-performed-utc': string;
            'scanner-serial-number': string;
            'scanner-firmware-version': string;
            'scanner-hardware-version': string;
            'scanner-spectrum-version': string;
            counts: number[][];
            wavelengths: number[];
            white_ref: number[][];
            factory_white_ref: number[][];
            absorbance: number[][];
            factory_absorbance: number[][];
        };

        'scan-info': {
            user_email: string;
            dlp_header: {
                pga: number;
                humidity: number;
                white_pga: number;
                temperature: number;
                white_humidity: number;
                white_temperature: number;
            };
            device_info: {
                os: string;
                version: string;
            };
        };
    };
};

export type GetScanDataResponse = GetScanDataItem[];

/**
 * This is the scanner result data type.
 */
export type GetSensorScannerResponse = {
    model: string; // ie. NIR-S-G1
    serial_number: string; // ie. TS01692
    try_configs: string[]; // ie. ["TSH20X9","TSH16X9","Tellspec"]
    white_reference: unknown[];
    last_calibration: string; // ie. 2020-02-26 13:51:21
    notes: string; // ie. some notes
    created_at: string; // ie. 2019-07-23 19:34:19
    number_scans: number;
    calibrations: [
        {
            config: string; // ie. TSH20X9
            last_modified_at: string; // ie 2020-02-26 13:51:21
            created_at: string; // ie, 2019-10-18 15:49:56
        },
    ];
};

/**
 * Defines the post scan result data.
 */
export type SaveScanResponse = {
    success: boolean;
    'failed-scan': string[]; // [scan uuid]
    'scan-validation': 'ok' | 'not_ideal' | 'bad';
};
