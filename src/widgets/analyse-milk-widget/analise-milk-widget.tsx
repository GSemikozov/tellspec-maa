import React, { useState } from "react";
import { BarcodeScanner } from "../../ui";
import {
    IonLabel,
    IonRow,
    IonSegment,
    IonSegmentButton,
} from "@ionic/react";

import { SpectrumAnalyse } from "../spectrum-analyse";
import { TestResults } from "../test-results";

enum Tabs {
    'spectrum',
    'results',
}

export const AnalyseMilkWidget: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tabs>(Tabs.spectrum)
    const [milkId, setMilkId] = useState<string>();

    return (
        <>
            <h2>analyse</h2>
            <BarcodeScanner
                title="Please select, scan or enter Milk ID"
                onChange={setMilkId}
                value={milkId}
            />

            <div>
                <IonRow>
                    <IonSegment
                        value={activeTab}
                        disabled={!milkId}
                        onIonChange={(e) => setActiveTab(e.target.value as Tabs)}
                    >
                        <IonSegmentButton value={Tabs.spectrum}>
                            <IonLabel>Spectrum</IonLabel>
                        </IonSegmentButton>

                        <IonSegmentButton value={Tabs.results}>
                            <IonLabel>Test Results</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>

                    { activeTab === Tabs.spectrum
                        ? <SpectrumAnalyse />
                        : <TestResults />
                    }

                    {
                        !milkId ? (
                            <div>Scan the milk barcode first</div>
                        ) : null
                    }
                </IonRow>
            </div>
        </>
    )
}