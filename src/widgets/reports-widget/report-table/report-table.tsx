import React from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
} from '@tanstack/react-table';
import { IonCheckbox } from '@ionic/react';

import { classname } from '@shared/utils';

import { getParameterByName, ColumnNamesMapping } from './report-table.utils';

import type { Report, ReportAnalyseDataResult } from '@entities/reports';

import './report-table.css';

const cn = classname('report-table');

const columnHelper = createColumnHelper<Report>();

const columns = [
    columnHelper.display({
        id: 'select',
        cell: info => (
            <IonCheckbox
                {...{
                    checked: info.row.getIsSelected(),
                    disabled: !info.row.getCanSelect(),
                    onIonChange: info.row.getToggleSelectedHandler(),
                }}
            />
        ),
    }),

    columnHelper.accessor('milk_id', {
        header: 'Milk ID',
    }),

    columnHelper.accessor(row => row.data.analyseData, {
        header: 'Analysed',
        cell: info => {
            if (!info.getValue()) {
                return 'false';
            }

            return 'true';
        },
    }),

    columnHelper.accessor(
        row => getParameterByName(ColumnNamesMapping.PROTEIN, row.data.analyseData),
        {
            header: 'Protein',
            cell: info => {
                const result = info.getValue<ReportAnalyseDataResult>();

                return result?.value || '-';
            },
        },
    ),

    columnHelper.accessor(row => getParameterByName(ColumnNamesMapping.FAT, row.data.analyseData), {
        header: 'Fat',
        cell: info => {
            const result = info.getValue<ReportAnalyseDataResult>();

            return result?.value || '-';
        },
    }),

    columnHelper.accessor(
        row => getParameterByName(ColumnNamesMapping.CARBS, row.data.analyseData),
        {
            header: 'Carbs.',
            cell: info => {
                const result = info.getValue<ReportAnalyseDataResult>();

                return result?.value || '-';
            },
        },
    ),
    columnHelper.accessor(
        row => getParameterByName(ColumnNamesMapping.ENERGY, row.data.analyseData),
        {
            header: 'Energy',
            cell: info => {
                const result = info.getValue<ReportAnalyseDataResult>();

                return result?.value || '-';
            },
        },
    ),
];

export type ReportTableProps = {
    reports: Report[];
};

export type ColumnSort = {
    id: string;
    desc: boolean;
};

export type SortingState = ColumnSort[];

export const ReportTable: React.FunctionComponent<ReportTableProps> = ({ reports }) => {
    const [rowSelection, setRowSelection] = React.useState({});
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable({
        enableRowSelection: true,
        data: reports,
        columns,
        state: { rowSelection, sorting: sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),

        onRowSelectionChange: value => setRowSelection(value),
    });

    return (
        <div className={cn()}>
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                    {
                                        { asc: '⬆️', desc: '⬇️' }[
                                            (header.column.getIsSorted() as string) ?? null
                                        ]
                                    }
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
