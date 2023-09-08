import React from 'react';

import { tellspecCheckBleState } from '@api/native';

import { SensorConnectionProcessToast } from '../sensor-connection-process-toast';

import { STATUS_TOAST_MESSAGE } from './const';

export type SensorConnectionProcessContextValue = {
    status: 'idle' | 'error' | 'checkingBle' | 'discovering';
    toastMessage: string;
    onStartDiscovery: () => Promise<void>;
};

export const SensorConnectionProcessContext =
    // @ts-ignore: we setup the initial value in provider below
    React.createContext<SensorConnectionProcessContextValue>();

export const SensorConnectionProcessProvider: React.FunctionComponent<React.PropsWithChildren> = ({
    children,
}) => {
    const [status, setStatus] =
        React.useState<SensorConnectionProcessContextValue['status']>('idle');

    const [toastMessage, setToastMessage] = React.useState('');

    const setCheckingBleState = React.useCallback(() => {
        setStatus('checkingBle');
        setToastMessage(STATUS_TOAST_MESSAGE.checkingBle);
    }, []);

    const setDiscoveringState = React.useCallback(() => {
        setStatus('discovering');
        setToastMessage(STATUS_TOAST_MESSAGE.discovering);
    }, []);

    const resetState = React.useCallback(() => {
        setStatus('idle');
        setToastMessage('');
    }, []);

    const clearToastMessage = React.useCallback(() => setToastMessage(''), []);

    const handleStartDiscovery = React.useCallback(async () => {
        setCheckingBleState();

        const tellspecBleState = await tellspecCheckBleState();

        if (tellspecBleState.status === 'error') {
            setToastMessage(tellspecBleState.message);
            setStatus('error');

            return;
        }

        setDiscoveringState();
    }, [setCheckingBleState, setDiscoveringState, resetState, clearToastMessage]);

    React.useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (status === 'discovering') {
            timeoutId = setTimeout(() => {
                resetState();
            }, 2_000);
        }

        return () => {
            clearTimeout(timeoutId);
        };

        // setListener(
        //     TellspecSensorSdk.addListener(TellspecSensorEvent.DEVICE_LIST, (data: any) => {
        //         const Temp: BleDeviceInfo[] = [];
        //         data.devices.map((item: BleDeviceInfo, index: number) => {
        //             if (item.name.includes('T11')) {
        //                 Temp.push(item);
        //             }
        //         });
        //         setdeviceList(Temp);
        //     }),
        // );
        // return () => {
        //     if (listener) {
        //         listener.remove();
        //     }
        // };
    }, [status]);

    const context = React.useMemo(
        () => ({
            status,
            toastMessage,
            onStartDiscovery: handleStartDiscovery,
        }),
        [status, toastMessage, handleStartDiscovery],
    );

    return (
        <SensorConnectionProcessContext.Provider value={context}>
            {children}

            <SensorConnectionProcessToast />
        </SensorConnectionProcessContext.Provider>
    );
};
