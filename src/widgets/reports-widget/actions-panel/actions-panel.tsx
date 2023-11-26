import React from 'react';
import { IonCol, IonRow, useIonRouter } from '@ionic/react';

import { classname } from '@shared/utils';
import { PreemieButton } from '@ui/button';

import './actions-panel.css';

const cn = classname('actions-panel');

type ActionsPanelProps = {
    selectedIDS: string[];
};

export const ActionsPanel: React.FunctionComponent<ActionsPanelProps> = props => {
    const { selectedIDS } = props;

    const router = useIonRouter();

    const isPrintButtonDisabled = selectedIDS.length === 0;

    const handleClickButton = () =>
        router.push(`/pdf/${encodeURIComponent(selectedIDS.join(','))}`);

    return (
        <IonRow>
            <IonCol className={cn()}>
                <PreemieButton disabled={isPrintButtonDisabled} onClick={handleClickButton}>
                    Print Milk Report(s)
                </PreemieButton>
            </IonCol>
        </IonRow>
    );
};
