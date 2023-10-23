import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SensorEvent } from 'tellspec-sensor-sdk/src';

import { tellspecAddListener } from '@api/native';
import { userSelectors } from '@entities/user';
import {
    SensorDevice,
    getSensorCalibration,
    getSensorScanner,
    removeDevice,
    selectIsSensorScanning,
    selectIsWarmupSensorLoading,
    selectSensorCalibrationReady,
    selectSensorDevice,
} from '@entities/sensor/model';
import { AppDispatch } from '@app';
import { useSensorStatusPolling } from '@entities/sensor/hooks';

import type { PluginListenerHandle } from '@capacitor/core';

type SensorManagerProps = React.PropsWithChildren<unknown>;

export const SensorManager: React.FunctionComponent<SensorManagerProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();

    const isAuthenticated = useSelector(userSelectors.isUserAuthenticated);
    const currentDevice = useSelector(selectSensorDevice);
    const calibrationReady = useSelector(selectSensorCalibrationReady);
    const warmupLoading = useSelector(selectIsWarmupSensorLoading);
    const sensorScanning = useSelector(selectIsSensorScanning);

    const sensorStatusListenerRef = React.useRef<PluginListenerHandle | null>(null);
    const currentDeviceRef = React.useRef<SensorDevice | null>(null);

    const [startSensorStatusPolling, stopSensorStatusPolling, { isPolling }] =
        useSensorStatusPolling();

    {
        // for provide data to listener
        currentDeviceRef.current = currentDevice;
    }

    const reseSensorStatusListener = React.useCallback(() => {
        const sensorStatusListener = sensorStatusListenerRef.current;

        if (sensorStatusListener !== null) {
            sensorStatusListener.remove();
            sensorStatusListenerRef.current = null;
        }
    }, []);

    React.useEffect(() => {
        // effect for fetching data depends on current sensor
        if (!isAuthenticated || !currentDevice) {
            return;
        }

        dispatch(getSensorScanner());
        dispatch(getSensorCalibration());
    }, [isAuthenticated, currentDevice]);

    React.useEffect(() => {
        // effect for work with sensor status listener
        if (!isAuthenticated || !currentDevice) {
            reseSensorStatusListener();
            return;
        }

        const sensorStatusListener = sensorStatusListenerRef.current;

        if (sensorStatusListener === null) {
            sensorStatusListenerRef.current = tellspecAddListener(
                SensorEvent.SCANNER_STATUS,
                (data: any) => {
                    console.log('[scanner status listener]', JSON.stringify(data));

                    switch (data.state) {
                        case 'off': {
                            const currentDeviceFromRef = currentDeviceRef.current;

                            if (currentDeviceFromRef !== null) {
                                dispatch(removeDevice(currentDeviceFromRef.uuid));
                            }

                            break;
                        }
                    }
                },
            );
        }

        return () => {
            reseSensorStatusListener();
        };
    }, [isAuthenticated, reseSensorStatusListener]);

    React.useEffect(() => {
        // effect for manage receiving sensor sensor status
        if (
            !isAuthenticated ||
            !currentDevice ||
            !calibrationReady ||
            warmupLoading ||
            sensorScanning
        ) {
            stopSensorStatusPolling();
            return;
        }

        if (!isPolling) {
            startSensorStatusPolling();
        }
    }, [
        isAuthenticated,
        currentDevice,
        calibrationReady,
        warmupLoading,
        sensorScanning,
        isPolling,
    ]);

    return children;
};
