import { BaseEndpoint } from '@api/network';

import type {
    SensorCalibrationPostType,
    SensorModelType,
    SensorPostScanResult,
    SensorResultType,
    SensorScannerResult,
} from './model/sensor.types';

export class SensorApi extends BaseEndpoint {
    private postCalibrationUrl = '/sensors/calibrate/';

    // format: /sensors/calibration/{model}/{serial_number}/{config}/
    private getCalibrationUrl = '/sensors/calibration/';

    private getScanUrl = '/sensors/get-scans-data/';

    private postScan = '/sensors/set-scans-data/';

    // format: /sensors/scanner/{model}/{serial_number}/
    private getScannerUrl = '/sensors/scanner/';

    private runModelUrl = '/ml-models/trained-models-run/';

    runModel = async (value: SensorModelType): Promise<any> => {
        const response = await this.http.post(this.runModelUrl, value, {}, {});

        return response.data.results;
    };

    setCalibration = async (value: SensorCalibrationPostType): Promise<SensorResultType> => {
        const response = await this.http.post(this.postCalibrationUrl, value, {}, {});

        return response.data;
    };

    getCalibration = async (model: string, serial: string, config: string): Promise<any> => {
        const requestUrl = `${this.getCalibrationUrl}${model}/${serial}/${config}/`;

        const response = await this.http.get(requestUrl);

        return response.data;
    };

    getScanData = async (uuid: string): Promise<any> => {
        const response = await this.http.post(this.getScanUrl, { scans: [uuid] }, {}, {});

        return response.data;
    };

    getScanner = async (model: string, serial: string): Promise<SensorScannerResult> => {
        const requestUrl = `${this.getScannerUrl}${model}/${serial}/`;

        const response = await this.http.get(requestUrl, {}, {});

        return response.data;
    };

    saveScan = async (singleScan: any): Promise<SensorPostScanResult> => {
        const response = await this.http.post(this.postScan, { scans: [singleScan] }, {}, {});

        return response.data;
    };
}
