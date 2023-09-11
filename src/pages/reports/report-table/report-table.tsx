import React from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

import type { IReport, IResult } from '@entities/reports/model/reports.types.ts';
import type { IAnalyseData } from '@entities/analyse/analyse.types.ts';

import './report-table.css';

const columnHelper = createColumnHelper<IReport>();

const getParameterByName = (name: string, analyseData?: IAnalyseData[]) => {
    if (!analyseData) {
        return null;
    }

    return analyseData[0]?.result.find(r => r.name === name);
};

enum ColumnNamesMapping {
    protein = 'Protein (True Protein)',
    fat = 'Fat',
    carbs = 'Total Carbs',
    energy = 'Energy',
    solids = 'Total solids',
}

const columns = [
    columnHelper.accessor('milk_id', {
        header: 'Milk ID',
    }),
    columnHelper.accessor('archived', {
        header: () => 'Analysed',
    }),
    columnHelper.accessor(
        row => getParameterByName(ColumnNamesMapping.protein, row.data.analyseData),
        {
            header: 'Protein',
            cell: info => {
                const result = info.getValue<IResult>();
                return result?.value || '-';
            },
        },
    ),
    columnHelper.accessor(row => getParameterByName(ColumnNamesMapping.fat, row.data.analyseData), {
        header: 'Fat',
        cell: info => {
            const result = info.getValue<IResult>();
            return result?.value || '-';
        },
    }),
    columnHelper.accessor(
        row => getParameterByName(ColumnNamesMapping.carbs, row.data.analyseData),
        {
            header: 'Carbs.',
            cell: info => {
                const result = info.getValue<IResult>();
                return result?.value || '-';
            },
        },
    ),
    columnHelper.accessor(
        row => getParameterByName(ColumnNamesMapping.energy, row.data.analyseData),
        {
            header: 'Energy',
            cell: info => {
                const result = info.getValue<IResult>();
                return result?.value || '-';
            },
        },
    ),
];

interface ReportTableProps {
    data: any[];
}

export const ReportTable: React.FC<ReportTableProps> = props => {
    const table = useReactTable({
        data: props.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className='reportTable'>
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};