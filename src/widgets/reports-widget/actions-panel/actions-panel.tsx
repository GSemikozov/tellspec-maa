import React from 'react';
import { IonButton, IonCol, IonRow } from '@ionic/react';

import { classname } from '@shared/utils';

import './actions-panel.css';

const cn = classname('actions-panel');

type ActionsPanelProps = {
    selectedIDS: string[];
};

export const ActionsPanel: React.FunctionComponent<ActionsPanelProps> = props => {
    const { selectedIDS } = props;
    const printURL = `/pdf/${encodeURIComponent(selectedIDS.join(','))}`;
    const isPrintButtonDisabled = selectedIDS.length === 0;

    return (
        <IonRow>
            <IonCol className={cn()}>
                <IonButton href={printURL} disabled={isPrintButtonDisabled}>
                    Print Milk Test Results
                </IonButton>
            </IonCol>
        </IonRow>
    );
};
