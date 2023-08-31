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
