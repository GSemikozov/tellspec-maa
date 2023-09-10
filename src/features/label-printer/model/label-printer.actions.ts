import { createAsyncThunk } from '@reduxjs/toolkit';
import { BarcodePrinter } from 'barcode-printer/src';
import { BarcodePrinterPlugin } from 'barcode-printer/src/definitions';

import { appActions } from '@app';

// TODO: resolve import
// eslint-disable-next-line import/no-unresolved
// import { API } from "../../../api";

export const LabelPrinter = BarcodePrinter as BarcodePrinterPlugin;

// const api = new API();

const alertHeader = 'Printer';
const alertErrorMessage = "Couldn't connect the printer";

export const pairPrinter = createAsyncThunk(
    'labelPrinter/pair',
    async (_arg, { dispatch }): Promise<void> => {
        dispatch(appActions.showBackdrop({ backdropText: 'Pairing printer' }));
        await LabelPrinter.createInstance({});

        try {
            const response = await LabelPrinter.getAllPrinters({ printerName: '', printers: '' });
            const pairing = await LabelPrinter.openPrinter({ printerName: response.printers });
            console.log('pairing', pairing);

            setTimeout(async () => {
                const printer = await LabelPrinter.isPrinterOpened({});
                dispatch(appActions.hideBackdrop());

                if (printer.open) {
                    dispatch(
                        appActions.showAlert({
                            alertHeader,
                            alertMessage: 'Printer is successfully connected',
                        }),
                    );
                } else {
                    dispatch(
                        appActions.showAlert({
                            alertHeader,
                            alertMessage: alertErrorMessage,
                        }),
                    );
                }
            }, 1000);
        } catch (e) {
            dispatch(
                appActions.showAlert({
                    alertHeader,
                    alertMessage: alertErrorMessage,
                }),
            );
        }
    },
);
