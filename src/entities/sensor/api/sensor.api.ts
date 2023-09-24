import { BaseEndpoint } from '@api/network';

import type { TellspecSensorScannedData } from '@api/native';
import type {
    RunModelRequest,
    RunModelResponse,
    SetCalibrationRequest,
    SetCalibrationResponse,
    GetCalibrationResponse,
    GetScanDataResponse,
    GetSensorScannerResponse,
    SaveScanResponse,
    GetScanDataRequest,
} from './types';

export class SensorApi extends BaseEndpoint {
    private runModelUrl = '/ml-models/trained-models-run/';

    // format: /sensors/calibration/{model}/{serial_number}/{config}/
    private getCalibrationUrl = '/sensors/calibration/';
    private setCalibrationUrl = '/sensors/calibrate/';

    // format: /sensors/scanner/{model}/{serial_number}/
    private getScannerUrl = '/sensors/scanner/';
    private getScanUrl = '/sensors/get-scans-data/';
    private saveScanUrl = '/sensors/set-scans-data/';

    runModel = async (request: RunModelRequest) => {
        const response = await this.http.post<RunModelResponse>(this.runModelUrl, request);

        if (response.data) {
            return response.data.results;
        }

        return null;
    };

    getCalibration = async (model: string, serial: string, config: string) => {
        const requestUrl = `${this.getCalibrationUrl}${model}/${serial}/${config}/`;
        const response = await this.http.get<GetCalibrationResponse>(requestUrl);

        return response.data;
    };

    setCalibration = async (request: SetCalibrationRequest) => {
        const response = await this.http.post<SetCalibrationResponse>(
            this.setCalibrationUrl,
            request,
        );

        return response.data;
    };

    getScanData = async (uuid?: string) => {
        const requestBody: GetScanDataRequest = {};

        if (uuid) {
            requestBody.scans = [uuid];
        }

        const response = await this.http.post<GetScanDataResponse>(this.getScanUrl, requestBody);

        return response;
    };

    getScanner = async (model: string, serial: string) => {
        const requestUrl = `${this.getScannerUrl}${model}/${serial}/`;

        const response = await this.http.get<GetSensorScannerResponse>(requestUrl);

        return response.data;
    };

    saveScan = async (singleScan: TellspecSensorScannedData) => {
        const response = await this.http.post<SaveScanResponse>(this.saveScanUrl, {
            scans: [singleScan],
        });

        return response;
    };
}
