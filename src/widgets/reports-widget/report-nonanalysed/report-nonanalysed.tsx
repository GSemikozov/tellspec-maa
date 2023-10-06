import { classname } from '@shared/utils';
import './report-nonanalysed.css';
import { IonButton, useIonAlert, useIonRouter } from '@ionic/react';
import { routesMapping } from '@app/routes';
import { usePreemieToast } from '@ui';

const cn = classname('non-analysed');

export const ReportNonAnalysed = ({ milkId }) => {
    const [presentAlert] = useIonAlert();
    const [presentToast] = usePreemieToast();
    const router = useIonRouter();

    
    const handleAnalyseReroute = async () => {
        try {
            await presentAlert({
                header: 'redirecting to analyse page',
                buttons: ['OK'],
                onDidDismiss: () => {
                    router.push(routesMapping.analyse + `?milkId=${milkId}`);
                },
            });
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
                <h1>This Milk has not be analysed yet. Please analyse it to see Test Results.</h1>
                <IonButton className={cn('analyse-button')} onClick={handleAnalyseReroute}>
                    Analyse this milk
                </IonButton>
            </div>
        </>
    );
};
