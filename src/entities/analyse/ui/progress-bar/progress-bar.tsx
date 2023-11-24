import { useEffect, useState } from 'react';
import { IonProgressBar } from '@ionic/react';



function ProgressBar() {
    const [buffer, setBuffer] = useState(0.01);
    const [progress, setProgress] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            setBuffer(prevBuffer => prevBuffer + 0.01);
            setProgress(prevProgress => prevProgress + 0.01);
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    if (progress >= 1) {
        setTimeout(() => {
            setBuffer(0.01);
            setProgress(0);
        }, 20000);
    }

    return <IonProgressBar buffer={buffer} value={progress}></IonProgressBar>;
}
export default ProgressBar;
