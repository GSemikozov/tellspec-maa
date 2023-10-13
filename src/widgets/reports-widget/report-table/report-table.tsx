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
import type { SortingFn } from '@tanstack/react-table';

import './report-table.css';
import { MockData } from '@widgets/test-results/mock-data';

declare module '@tanstack/table-core' {
    interface SortingFns {
        customNameSorting: SortingFn<Report>;
        customDateSorting: SortingFn<Report>;
    }
}

const cn = classname('report-table');

const columnHelper = createColumnHelper<Report>();

const columns = [
    columnHelper.display({
        id: 'select',
        header: ({ table }) => {
            const rows = table.getRowModel().rows;

            return (
                <IonCheckbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        disabled: rows.length === 0,
                        onIonChange: e => {
                            const { checked, indeterminate } = e.target;
                            table.toggleAllRowsSelected(checked && indeterminate ? false : checked);
                        },
                    }}
                />
            );
        },
        cell: ({ row }) => {
            // const hasData = (row.getValue('dataAnalysed') as Report)?.data?.analyseData;

            return (
                <IonCheckbox
                    {...{
                        checked: row.getIsSelected(),
                        // disabled: !hasData,
                        onIonChange: row.getToggleSelectedHandler(),
                    }}
                />
            );
        },
    }),

    columnHelper.accessor('milk_id', {
        header: 'Milk ID',
        sortingFn: 'customNameSorting',
    }),

    columnHelper.accessor(row => row, {
        id: 'dataAnalysed',
        header: 'Date Analysed',
        sortingFn: 'customDateSorting',
        cell: info => {
            const data = info.getValue() as Report;
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
                const display = result?.value + ' ' + result?.units;
                if (result?.value) return display;
                else return '-';
            },
        },
    ),

    columnHelper.accessor(row => getParameterByName(ColumnNamesMapping.FAT, row.data.analyseData), {
        header: 'Fat',
        cell: info => {
            const result = info.getValue<ReportAnalyseDataResult>();
            const display = result?.value + ' ' + result?.units;
            if (result?.value) return display;
            else return '-';
        },
    }),

    // columnHelper.accessor(
    //     row => getParameterByName(ColumnNamesMapping.CARBS, row.data.analyseData),
    //     {
    //         header: 'Carbs.',
    //         cell: info => {
    //             const result = info.getValue<ReportAnalyseDataResult>();

    //             return result?.value || '-';
    //         },
    //     },
    // ),

    columnHelper.accessor(
        row => getParameterByName(ColumnNamesMapping.ENERGY, row.data.analyseData),
        {
            header: 'Energy',
            cell: info => {
                const result = info.getValue<ReportAnalyseDataResult>();
                const display = result?.value + ' ' + result?.units;
                if (result?.value) return display;
                else return '-';
            },
        },
    ),
];

type SelectedRows = Record<string, boolean>;

export type ReportTableProps = {
    reports: Report[];
    onRowSelectionChange: (ids: SelectedRows) => void;
    onRowClick: (id: string) => void;
};

export type ColumnSort = {
    id: string;
    desc: boolean;
};

export type SortingState = ColumnSort[];

export const ReportTable: React.FunctionComponent<ReportTableProps> = props => {
    const { reports, onRowSelectionChange, onRowClick } = props;
    const [rowSelection, setRowSelection] = React.useState<SelectedRows>({});
    const [globalFilter, setGlobalFilter] = React.useState<FilterValue>('analysed');
    const [sorting, setSorting] = React.useState<SortingState>([
        {
            id: 'milk_id',
            desc: true,
        },
    ]);

    const handleRowSelectionChange = updaterOrValue => {
        const ids =
            typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue;
        // const selectableKeys = Object.keys(ids).filter(id => {
        //     return reports.find(report => report.milk_id === id)?.data.analyseData;
        // });

        const selectableKeys = Object.keys(ids).filter(id => {
            return reports.find(report => report.milk_id === id);
        });

        const selectableIds = selectableKeys.reduce((previousValue, currentValue) => {
            return {
                ...previousValue,
                [currentValue]: true,
            };
        }, {});

        onRowSelectionChange(selectableIds);
        setRowSelection(selectableIds);
    };

    const handleRowClick = row => e => {
        if (e.target.tagName !== 'ION-CHECKBOX') {
            onRowClick(row.getValue('milk_id'));
        }
    };

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
        getRowId: row => row.milk_id,
        onSortingChange: setSorting,
        onRowSelectionChange: handleRowSelectionChange,
        enableSortingRemoval: false,
        sortingFns: {
            customNameSorting: (rowA, rowB) => {
                const rowADate = formatUTCDate(new Date(rowA.original.last_modified_at));
                const rowBDate = formatUTCDate(new Date(rowB.original.last_modified_at));

                if (rowADate === rowBDate) {
                    return (rowA.getValue('milk_id') as string) <
                        (rowB.getValue('milk_id') as string)
                        ? 1
                        : -1;
                }

                return 0;
            },
            customDateSorting: (rowA, rowB) => {
                const sortingOrderDesc = sorting[0].desc;

                const rowADate = new Date(rowA.original.last_modified_at);
                const rowBDate = new Date(rowB.original.last_modified_at);

                const rowADateString = formatUTCDate(rowADate);
                const rowBDateString = formatUTCDate(rowBDate);

                if (rowADateString === rowBDateString) {
                    return (
                        (rowA.getValue('milk_id') as string).localeCompare(
                            rowB.getValue('milk_id'),
                        ) * (sortingOrderDesc ? -1 : 1)
                    );
                }

                return rowADate.getTime() - rowBDate.getTime();
            },
        },
    });

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
                            {MockData.data.map(item => (
                                <th key={item.id}>{item.name}</th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <>
                            <tr key={row.original.uuid} onClick={handleRowClick(row)}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}

                                {MockData.data.map(item => (
                                    <td key={item.id}>{item.value}</td>
                                ))}
                            </tr>
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
