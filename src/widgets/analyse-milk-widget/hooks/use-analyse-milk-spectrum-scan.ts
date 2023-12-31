import React from 'react';

import { usePreemieToast } from '@ui';
import { apiInstance } from '@api/network';
import { prepareSpectrumScanData } from '@entities/sensor';

import type { SpectrumScanData } from '@entities/sensor';

export type RequiredSpectrumScanInterface = Pick<SpectrumScanData, 'uuid' | 'absorbance'>;

export type UseAnalyseMilkSpectrumScanResponse<T = RequiredSpectrumScanInterface> = [
    (scanId: string) => Promise<T | null>,
    (sensorScannedData: T | null) => void,
    { spectrumScan: T | null; loading: boolean },
];

export const useAnalyseMilkSpectrumScan = (): UseAnalyseMilkSpectrumScanResponse => {
    const [presentToast] = usePreemieToast();

    const [spectrumScan, setSpectrumScan] = React.useState<RequiredSpectrumScanInterface | null>(
        null,
    );

    const [loading, setLoading] = React.useState(false);

    const fetchSpectrumScan = React.useCallback(async (scanId: string) => {
        try {
            setLoading(true);

            const response = await apiInstance.sensor.getScanData(scanId);

            if (response.data === null || response.data.length === 0) {
                throw new Error('Unable to find spectrum scan information');
            }

            const [spectrumScanDataItem] = response.data;

            const spectrumScan = prepareSpectrumScanData(spectrumScanDataItem);

            setSpectrumScan(spectrumScan);

            return spectrumScan;
        } catch (error: any) {
            await presentToast({
                type: 'error',
                message: error.message,
            });
        } finally {
            setLoading(false);
        }

        return null;
    }, []);

    const handleSetSpectrumScan = React.useCallback(
        (spectrumScan: RequiredSpectrumScanInterface | null) => {
            setSpectrumScan(spectrumScan);
        },
        [],
    );

    return [fetchSpectrumScan, handleSetSpectrumScan, { spectrumScan, loading }];
};
