import { IonButton, useIonRouter } from '@ionic/react';

import { classname } from '@shared/utils';
import { routesMapping } from '@app/routes';
import { usePreemieToast } from '@ui';

import './report-nonanalysed.css';

const cn = classname('non-analysed');

export const ReportNonAnalysed = ({ milkId, onModalClose }: any) => {
    const [presentToast] = usePreemieToast();
    const router = useIonRouter();

    const handleAnalyseReroute = async () => {
        try {
            onModalClose(true);
            router.push(routesMapping.analyse + `?milkId=${milkId}`);
        } catch (error: any) {
            await presentToast({
                type: 'error',
                message: error?.message,
            });
        }
    };

    return (
        <>
            <div className={cn()}>
                <h1>This milk has not be analysed yet. Please analyse it to see test tesults.</h1>
                <IonButton className={cn('analyse-button')} onClick={handleAnalyseReroute}>
                    Analyse this milk
                </IonButton>
            </div>
        </>
    );
};
