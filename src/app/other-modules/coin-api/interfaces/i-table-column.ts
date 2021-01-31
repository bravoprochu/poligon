export interface ITableColumn {
  propName: string;
  caption: string;
  type: TableColumnFieldType;
}

export enum TableColumnFieldType {
  date = 'date',
  email = 'email',
  dateMedium = 'dateMedium',
  number = 'number',
  string = 'string',
  www = 'www',
}
