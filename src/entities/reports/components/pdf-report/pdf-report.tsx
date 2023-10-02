import React from 'react';
import html2pdf from 'html2pdf.js';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { IonButton, IonIcon, IonRow, getPlatforms } from '@ionic/react';
import { hourglass } from 'ionicons/icons';

import { usePreemieToast } from '@ui';
import { retrieveFilesystemPermissions } from '@api/native';
import { PDFTemplate } from '@entities/reports/components/pdf-template';

import type { Report } from '@entities/reports';

import './pdf-report.css';

type PDFReportProps = {
    report: Report;
    onClose: () => void;
};

export const PDFReport: React.FC<PDFReportProps> = ({ report, onClose }) => {
    const [presentToast, dismissToast] = usePreemieToast();

    const [exporting, setExporting] = React.useState(false);

    const handleExport = async () => {
        setExporting(true);

        const html = document.getElementById(`pdf-container-milk`);
        const filename = `report_${report.milk_id}_${report.created_at.replace(/ |-|:/g, '_')}`;

        const options = {
            filename,
            margin: [0, 0, 0, 0],
            html2canvas: {
                dpi: 192,
                scale: 4,
                letterRendering: true,
                useCORS: true,
            },
        };

        const pdfSource = html2pdf().set(options).from(html);
        const platforms = getPlatforms();

        try {
            if (platforms.includes('android')) {
                await retrieveFilesystemPermissions();

                const data = await pdfSource.outputPdf().then(function (pdf: string) {
                    // to base64
                    return btoa(pdf);
                });

                await Filesystem.writeFile({
                    data,
                    path: filename + '.pdf',
                    directory: Directory.Documents,
                });
            } else if (platforms.includes('desktop')) {
                await pdfSource.save();
            }

            await presentToast({
                type: 'success',
                message: 'A PDF report succesfully saved',
            });
        } catch {
            await dismissToast();
            await presentToast({
                type: 'error',
                message: 'An error occuring while save the file',
            });
        } finally {
            setExporting(false);
        }
    };

    console.log('PDFReport report data', report);

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

            <div className='pdf-milk-previewPage'>
                <PDFTemplate report={report} />
            </div>
        </div>
    );
};
