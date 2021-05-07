export interface HeadCell<DataType extends {}> {
  disablePadding: boolean;
  id: keyof DataType;
  label: string;
  numeric: boolean;
}
