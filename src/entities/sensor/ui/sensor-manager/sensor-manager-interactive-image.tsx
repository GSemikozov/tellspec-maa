import { classname } from '@shared/utils';

import './sensor-manager-interactive-image.css';

const cn = classname('sensor-manager-interactive-image');

type SensorManagerInteractiveImageProps = {
    status?: any;
};

export const SensorManagerInteractiveImage: React.FunctionComponent<
    SensorManagerInteractiveImageProps
> = () => {
    return (
        <div className={cn()}>
            <img src='./img/sensor.png' alt='sensor-manager-interactive-image' />

            <div className={cn('status-bar')}>
                <div className={cn('status-bar-item', { power: false })} />
                <div className={cn('status-bar-item', { bluetooth: false })} />
                <div className={cn('status-bar-item', { scan: false })} />
                <div className={cn('status-bar-item', { battery: false })} />
            </div>
        </div>
    );
};
