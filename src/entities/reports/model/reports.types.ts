/**
 * This is the supported cateogries
 */
export enum ReportCategory {
    milk = 'milk',
}

/**
 * This is the supported cateogries
 */
export enum ReportTrackerNotificaiton {
    analyseReady, ///< This indicates that milk analyse is ready for the doctor to use
}

/**
 * This is the order but value
 */
export enum ReportOrderBy {
    desc = 'desc',
    asc = 'asc',
}

export interface IResult {
    name: string;
    units: string;
    value: number | string;
    sub_results?: IResult[];
}

export interface IAnalyseData {
    scanId: string;
    result: IResult[];
    scanDate: string;
    scanned_by: string;
    milk_status?: string;
}

export interface IReportData {
    TrackerNotification: ReportTrackerNotificaiton[];
    analyseData?: IAnalyseData[];
    donor_id?: string;
}

export interface IReportRequestParam {
    uuid?: string;
    milk_id?: string;
    infant_uuid?: string;
    category?: ReportCategory;
    last_modified_gte?: string;
    last_modified_lte?: string;
    order_by?: ReportOrderBy;
    show_archived?: boolean;
}

/**
 * This the report data Type
 */
export interface IReport {
    uuid: string;
    milk_id: string;
    category: ReportCategory;
    data: IReportData;
    archived: boolean;
    archived_at: string;
    last_modified_at: string;
    created_at: string;
    infant_uuid?: string;
}
