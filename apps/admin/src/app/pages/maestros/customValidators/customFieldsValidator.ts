import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function customPercentageValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const percentageValid = isNaN(parseFloat(control.value));
    return percentageValid
      ? {
          customError:
            'Porcentaje descuento debe ser solo númerico (con o sin decimal)',
        }
      : null;
  };
}

export function customMonthsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const percentageValid = isNaN(parseInt(control.value));
    return percentageValid
      ? {
          customError: 'Meses descuento debe ser solo númerico',
        }
      : null;
  };
}

export function customPrecioValidator(namePrecio: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const percentageValid = isNaN(parseInt(control.value));
    return percentageValid
      ? {
          customError: `Precio ${namePrecio} debe ser solo númerico`,
        }
      : null;
  };
}

export function customUniqueIdValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const uniqueIdValid = true;
    return uniqueIdValid
      ? {
          customError: `Motor de reglas ID debe ser único`,
        }
      : null;
  };
}

export function customUniqueIdFieldValidator(
  compareValue: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value || !compareValue) {
      return null;
    }

    const idsRepeated = value === compareValue;
    return idsRepeated
      ? {
          customError: `Este ID debe ser único en el formulario`,
        }
      : null;
  };
}
