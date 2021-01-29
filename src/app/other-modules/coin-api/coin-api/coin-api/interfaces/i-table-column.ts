export interface ITableColumn {
  definition: string;
  caption: string;
  type: TableColumnFieldType;
}

export enum TableColumnFieldType {
  string = 'string',
  date = 'date',
  dateMedium = 'dateMedium',
  number = 'number',
}
