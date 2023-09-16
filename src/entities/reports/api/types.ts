export enum ReportCategory {
    milk = 'milk',
}

export enum ReportOrderBy {
    desc = 'desc',
    asc = 'asc',
}

export enum ReportTrackerNotificaiton {
    analyseReady, // This indicates that milk analyse is ready for the doctor to use
}

export type FetchReportRequest = {
    uuid?: string;
    milk_id?: string;
    infant_uuid?: string;
    category?: ReportCategory;
    last_modified_gte?: string;
    last_modified_lte?: string;
    order_by?: ReportOrderBy;
    show_archived?: boolean;
};

export type ReportAnalyseDataResult = {
    name: string;
    units: string;
    value: number | string;
    sub_results?: ReportAnalyseDataResult[];
};

export type ReportAnalyseData = {
    scanId: string;
    result: ReportAnalyseDataResult[];
    scanDate: string;
    scanned_by: string;
    milk_status?: string;
};

export type ReportData = {
    TrackerNotification: ReportTrackerNotificaiton[];
    analyseData?: ReportAnalyseData;
    donor_id?: string;
};

/**
 * This the report data Type
 */
export type Report = {
    uuid: string;
    milk_id: string;
    category: ReportCategory;
    data: ReportData;
    archived: boolean;
    archived_at: string;
    last_modified_at: string;
    created_at: string;

    infant_uuid?: string;
};
