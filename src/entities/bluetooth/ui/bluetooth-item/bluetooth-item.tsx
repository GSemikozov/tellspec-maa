import { BluetoohIcon } from '@ui/icons';
import { classname } from '@shared/utils';

import './bluetooth-item.css';

import type { TellspecSensorDevice } from '@api/native';

const cn = classname('bluetooth-item');

type BluetoothItemProps = {
    device: TellspecSensorDevice;
    onClick: (device: TellspecSensorDevice) => void;
};

export const BluetoothItem: React.FunctionComponent<BluetoothItemProps> = ({ device, onClick }) => {
    const handleClick = () => {
        onClick(device);
    };

    return (
        <div className={cn()} onClick={handleClick}>
            <div className={cn('icon-container')}>
                <div className={cn('icon')}>
                    <BluetoohIcon color='currentColor' />
                </div>
            </div>

            <div className={cn('content')}>
                <h4 style={{ whiteSpace: 'nowrap' }}>
                    {device.serial}
                </h4>
            </div>
        </div>
    );
};
