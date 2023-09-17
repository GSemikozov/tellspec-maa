import type { ReportAnalyseData } from '@entities/reports';

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
