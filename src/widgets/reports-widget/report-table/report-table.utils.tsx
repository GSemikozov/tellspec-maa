import type { Report, ReportAnalyseData } from '@entities/reports';
import type { FilterFn } from '@tanstack/react-table';

export enum ColumnNamesMapping {
    PROTEIN = 'Protein',
    FAT = 'Fat',
    ENERGY = 'Energy',
    LINOLEICACID = 'Linoleic Acid',
    ALPHALINOLENICACID = '⍺-Linolenic Acid',
    DHA = 'DHA',
    ARA = 'ARA',
    EPA = 'EPA',
}

export const getParameterByName = (name: ColumnNamesMapping, analyseData?: ReportAnalyseData) => {
    if (!analyseData || !analyseData.result) {
        return null;
    }

    return analyseData.result.find(parameter => parameter.name === name);
};

export const globalFilterFn: FilterFn<any> = (row, _, filters): boolean => {
    const { status, name } = filters;
    const milkID = row.getValue('milk_id') as string;
    const reportData: Report = row.getValue('dataAnalysed');

    if (name && milkID.indexOf(name) === -1) {
        return false;
    }

    switch (status) {
        case 'analysed':
            return !!reportData.data?.analyseData;
        case 'unanalysed':
            return !reportData.data?.analyseData;
        case 'all':
        default:
            return true;
    }
};
