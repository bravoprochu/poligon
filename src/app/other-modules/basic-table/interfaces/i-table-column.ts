import { TableColumnFieldType } from './table-column-field-type-enum';

export interface ITableColumn {
  propName: string;
  caption: string;
  type: TableColumnFieldType;
}
