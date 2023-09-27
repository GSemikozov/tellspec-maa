import { createAsyncThunk } from '@reduxjs/toolkit';
import { BarcodePrinter } from 'barcode-printer/src';
import { BarcodePrinterPlugin } from 'barcode-printer/src/definitions';

import { appActions } from '@app';

import type { PrintData } from '@features/label-printer';

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

            if (response.printers.length === 0) {
                dispatch(
                    appActions.showAlert({
                        alertHeader,
                        alertMessage: "Couldn't find printer",
                    }),
                );

                return;
            }

            await LabelPrinter.openPrinter({ printerName: response.printers });

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

export const printLabel = createAsyncThunk(
    'labelPrinter/print',
    async (arg: PrintData, { dispatch }): Promise<void> => {
        const { milkId, data, width, height, rotation = '0' } = arg;
        const printer = await LabelPrinter.isPrinterOpened({});

        if (!printer.open) {
            dispatch(
                appActions.showAlert({
                    alertHeader,
                    alertMessage: "Couldn't find printer",
                }),
            );
        }

        dispatch(appActions.showBackdrop({ backdropText: 'Printing label' }));

        await LabelPrinter.startJob({ width, height, rotation });
        await LabelPrinter.drawText({
            text: `ID: ${milkId}`,
            x: '1',
            y: '2',
            width: '23',
            height: '4',
            fontHeight: '4',
        });

        await LabelPrinter.drawText({
            text: `${new Date().toLocaleDateString()}`,
            x: '1',
            y: '6',
            width: '23',
            height: '4',
            fontHeight: '4',
        });

        for (const item of data) {
            const index = data.indexOf(item);
            await LabelPrinter.drawText({
                text: `${item.name}: ${item.value} ${item.units}`,
                x: '1',
                y: ((index + 1) * 2.5).toString(),
                width: '23',
                height: '2.5',
                fontHeight: '2.5',
            });
        }

        await LabelPrinter.commitJob({ status: true });

        setTimeout(() => {
            dispatch(appActions.hideBackdrop());
        }, 500);
    },
);
