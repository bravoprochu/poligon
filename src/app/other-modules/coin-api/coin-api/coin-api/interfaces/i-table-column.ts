export interface ITableColumn {
    definition: string;
    caption: string;
    type: TableColumnFieldType
}

export enum TableColumnFieldType {
    string = "string",
    date = "Date",
    number = "number"
}