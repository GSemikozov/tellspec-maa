import { IonText } from "@ionic/react"
import { classname } from '@shared/utils';


const cn = classname('report-info')

export const ReportInfo = () => {

    return (
        <div className={cn()}>
            <IonText>Name:</IonText>
        </div>
    );
}