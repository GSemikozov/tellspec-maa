import React from 'react';
import html2pdf from 'html2pdf.js';
import { IonButton, IonIcon, IonRow } from '@ionic/react';
import { hourglass } from 'ionicons/icons';

import { PDFTemplate } from '@entities/reports/components/pdf-template';

import type { Report } from '@entities/reports';

import './pdf-report.css';

type PDFReportProps = {
    report: Report;
    onClose: () => void;
};

export const PDFReport: React.FC<PDFReportProps> = ({ report, onClose }) => {
    const [exporting, setExporting] = React.useState(false);

    const handleExport = async () => {
        setExporting(true);

        const html = document.getElementById(`pdf-container-milk`);
        await html2pdf(html, {
            filename: `report_${report.milk_id}_${report.created_at}}`,
            margin: [0, 0, 0, 0],
            html2canvas: {
                dpi: 192,
                scale: 4,
                letterRendering: true,
                useCORS: true,
            },
        });
        setExporting(false);
    };

    return (
        <div className={'pdf-milk-root'}>
            <IonRow className='ion-justify-content-end'>
                <IonButton disabled={exporting} onClick={handleExport}>
                    {exporting ? <IonIcon slot='start' icon={hourglass}></IonIcon> : null}
                    {exporting ? 'Saving' : 'Save PDF'}
                </IonButton>
                <IonButton fill='outline' onClick={onClose}>
                    Cancel
                </IonButton>
            </IonRow>
            <div className={'pdf-milk-previewPage'}>
                <PDFTemplate report={report} />
            </div>
        </div>
    );
};
