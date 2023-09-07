import React from 'react';
import { IonButton } from '@ionic/react';

import { classname } from '@shared/utils';
import { useSensorConnectionProcess } from '@widgets/sensor-connection-process';

import { SensorManagerInstructions } from './sensor-manager-instructions';
import { SensorManagerInteractiveImage } from './sensor-manager-interactive-image';

import './sensor-manager.css';

const cn = classname('sensor-manager');

export const SensorManager: React.FunctionComponent = () => {
    const { onStartDiscovery } = useSensorConnectionProcess();

    return (
        <div className={cn()}>
            <SensorManagerInstructions title='Connect a sensor' className={cn('instructions')}>
                <p>
                    To turn on your Preemie Sensor, locate the power switch on the side of the
                    device. Slide the switch to the ON position (to the right). You will notice the
                    green power LED illuminated on the top of the sensor. All of the LEDs flash
                    briefly to show that they are working.
                </p>

                <div className={cn('actions')}>
                    <IonButton onClick={onStartDiscovery}>Start Discovery Devices</IonButton>
                </div>
            </SensorManagerInstructions>

            <SensorManagerInteractiveImage />
        </div>
    );
};
