import type { Report, ReportAnalyseData } from '@entities/reports';
import type { FilterFn } from '@tanstack/react-table';

export enum ColumnNamesMapping {
    PROTEIN = 'Protein (True Protein)',
    FAT = 'Fat',
    CARBS = 'Total Carbs',
    ENERGY = 'Energy',
    SOLIDS = 'Total solids',
}

export const getParameterByName = (name: ColumnNamesMapping, analyseData?: ReportAnalyseData) => {
    if (!analyseData || !analyseData.result) {
        return null;
    }

    return analyseData.result.find(parameter => parameter.name === name);
};

export const statusFilter: FilterFn<any> = (row, _, value): boolean => {
    const reportData: Report = row.getValue('dataAnalysed');

    switch (value) {
        case 'analysed':
            return !!reportData.data?.analyseData;
        case 'unanalysed':
            return !reportData.data?.analyseData;
        case 'all':
        default:
            return true;
    }
};
