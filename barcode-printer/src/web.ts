import { registerWebPlugin, WebPlugin } from '@capacitor/core';

import type { BarcodePrinterPlugin } from './definitions';

export class BarcodePrinterWeb extends WebPlugin implements BarcodePrinterPlugin {
  constructor() {
    super({
      name: 'BarcodePrinter',
      platforms: ['web'],
    });
  }

  async createInstance(options: NonNullable<unknown>): Promise<any>{
    return options
  }

  async openPrinter(options: { printerName: string }): Promise<{ printerName: string }> {
    return options;
  }

  async startJob(options: { width: string, height: string, rotation: string, status: boolean }): Promise<{ status: boolean; }> {
    return options;
  }

  async drawBarcode(options: { text: string, x: string, y: string, width: string, height: string, textHeight: string, status: boolean }): Promise<{ status: boolean; }> {
    return options;
  }

  async drawText(options: { text: string, x: string, y: string, width: string, height: string, fontHeight: string, status: boolean }): Promise<{ status: boolean; }> {
    return options;
  }

  async commitJob(options: { status: boolean }): Promise<{ status: boolean }> {
    return options;
  }

  async getAllPrinters(options: { printers: string }): Promise<{ printers: string }> {
    return options;
  }

  async printSivaramBarCode(options: { printerName: string, uniqueId: string, name: string, dateOfBirth: string, location: string, status: boolean }): Promise<{ status: boolean }> {
    return options;
  }

  async printText(options: { printerName: string, status: boolean }): Promise<{ status: boolean }> {
    return options;
  }

  async isPrinterOpened(options: { open: boolean }): Promise<{ open: boolean }> {
    return options;
  }
}

const BarcodePrinter = new BarcodePrinterWeb();

registerWebPlugin(BarcodePrinter);

export { BarcodePrinter };