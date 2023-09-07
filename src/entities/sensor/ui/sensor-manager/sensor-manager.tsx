import React from 'react';

import { SensorManagerInstructions } from './sensor-manager-instructions';
import { SensorManagerInteractiveImage } from './sensor-manager-interactive-image';

import './sensor-manager.css';

export const SensorManager: React.FunctionComponent = () => {
    return (
        <div className='sensor-manager'>
            <SensorManagerInstructions title='Connect a sensor'>
                To turn on your Preemie Sensor, locate the power switch on the side of the device.
                Slide the switch to the ON position (to the right). You will notice the green power
                LED illuminated on the top of the sensor. All of the LEDs flash briefly to show that
                they are working.
            </SensorManagerInstructions>

            <SensorManagerInteractiveImage />
        </div>
    );
};
