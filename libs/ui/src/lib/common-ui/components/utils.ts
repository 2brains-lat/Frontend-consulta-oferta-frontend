export type VariantT =
  | 'primary'
  | 'accent'
  | 'ghost'
  | 'success'
  | 'error'
  | 'warn';
export type SizeT = 'small' | 'medium' | 'large';
type UnitT = '%' | 'px' | 'em' | 'vh' | 'vw' | 'rem' | 'ex' | 'vmax' | 'vmin';
export type SizeUnitT =
  | 'auto'
  | 'fit-content'
  | 'max-content'
  | 'min-content'
  | `${number}${UnitT}`;
export type inputTypeT =
  | 'text'
  | 'search'
  | 'search-select'
  | 'email'
  | 'date'
  | 'select'
  | 'multiselect';

export type NavLinksContent = {
  path: string;
  label: string;
  iconUrl?: string;
  activeIconUrl?: string;
  isActive?: string;
  subMenu?: NavLinksContent;
}[];
