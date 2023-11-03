import React from 'react';
import { IonCol, IonRow } from '@ionic/react';

import { classname } from '@shared/utils';

import './actions-panel.css';
import { PreemieButton } from '@ui/button';

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
                <PreemieButton href={printURL} disabled={isPrintButtonDisabled}>
                    Print Milk Report(s)
                </PreemieButton>
            </IonCol>
        </IonRow>
    );
};
