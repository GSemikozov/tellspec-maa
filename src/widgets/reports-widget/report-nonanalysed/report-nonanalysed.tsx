import { classname } from "@shared/utils";
import './report-nonanalysed.css'
import { IonButton } from "@ionic/react";


const cn = classname('non-analysed')
export const ReportNonAnalysed = () => {
    return (
        <>
            <div className={cn()}>
                <h1>This Milk has not be analysed yet. Please analyse it to see Test Results.</h1>
            <IonButton className={cn('analyse-button')}>Analyse this milk</IonButton>
            </div>
        </>
    );
}