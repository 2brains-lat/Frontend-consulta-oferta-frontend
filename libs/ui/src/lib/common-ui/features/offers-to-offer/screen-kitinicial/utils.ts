import { ValidatorFn } from '@angular/forms';

export function priceRules(): ValidatorFn {
  return (form: any): { [key: string]: string } | null => {
    return null;
  };
}
