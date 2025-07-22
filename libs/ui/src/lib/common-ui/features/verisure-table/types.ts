export enum typeColumn {
  TEXT = 'text',
  DYNAMIC = 'dynamic',
  NUMBER = 'number',
  PERCENTAGE = 'percentage',
}
export interface OptionColumn {
  name: string;
  value: string;
  type: typeColumn;
  template?: any;
}
