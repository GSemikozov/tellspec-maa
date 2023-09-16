import type { GetScanDataItem } from '../api';

export type AdaptedScanData = Omit<GetScanDataItem['json_data']['scan-data'], 'absorbance'> & {
    uuid: string;
    absorbance: number[];
};

export const adaptScanData = (scanData: GetScanDataItem): AdaptedScanData => {
    if (!scanData.json_data) {
        throw new Error('Scan data is not available');
    }

    const scanDataDetails = scanData.json_data['scan-data'];

    const result = {
        ...scanDataDetails,
        uuid: scanData.uuid,
        absorbance: scanDataDetails.absorbance[0],
    };

    return result;
};
