import React from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    getSortedRowModel,
} from '@tanstack/react-table';
import { IonCheckbox } from '@ionic/react';

import { classname } from '@shared/utils';
import { formatUTCDate } from '@ui/date-range/utils';
import { StatusFilter } from '@widgets/reports-widget/status-filter';

import { getParameterByName, ColumnNamesMapping, statusFilter } from './report-table.utils';

import type { Report, ReportAnalyseDataResult } from '@entities/reports';
import type { FilterValue } from '@widgets/reports-widget/status-filter';

import './report-table.css';

const cn = classname('report-table');

const columnHelper = createColumnHelper<Report>();

const columns = [
    columnHelper.display({
        id: 'select',
        header: info => (
            <IonCheckbox
                {...{
                    checked: info.table.getIsAllRowsSelected(),
                    disabled: info.table.getRowModel().rows.length === 0,
                    onIonChange: info.table.getToggleAllRowsSelectedHandler(),
                }}
            />
        ),
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

    // columnHelper.accessor(row => row.data.analyseData, {
    //     header: 'Analysed',
    //     cell: info => {
    //         if (!info.getValue()) {
    //             return 'false';
    //         }

    //         return 'true';
    //     },
    // }),

    columnHelper.accessor(row => row, {
        id: 'dataAnalysed',
        header: 'Date Analysed',
        cell: info => {
            const data = info.getValue();
            const date = data.last_modified_at;
            let value;
            const isDataExists = data?.data?.analyseData;
            if (isDataExists) {
                value = formatUTCDate(new Date(date));
            } else {
                value = '-';
            }

            return <div>{value}</div>;
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
    onRowClick: (id: string) => void;
};

export type ColumnSort = {
    id: string;
    desc: boolean;
};

export type SortingState = ColumnSort[];

export const ReportTable: React.FunctionComponent<ReportTableProps> = ({ reports, onRowClick }) => {
    const [rowSelection, setRowSelection] = React.useState({});
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState<FilterValue>('analysed');

    const table = useReactTable({
        enableRowSelection: true,
        data: reports,
        columns,
        state: { rowSelection, sorting, globalFilter },
        globalFilterFn: statusFilter,
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onRowSelectionChange: value => setRowSelection(value),
    });

    console.log('reports', reports);

    return (
        <div className={cn()}>
            <StatusFilter onChange={setGlobalFilter} value={globalFilter} />
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
                                        { asc: '▲', desc: '▼' }[
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
                        <tr key={row.id} onClick={() => onRowClick(row.getValue('milk_id'))}>
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
