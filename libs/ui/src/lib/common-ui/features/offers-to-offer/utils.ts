/* eslint-disable no-debugger */
import { asyncCallParamsT } from './utils.type';

export const asyncTimeOutFn = ($this: asyncCallParamsT) => {
  $this.service().then(async (value: string) => {
    console.log($this, value, 'utils.ts  linea 5 - async');
    if ($this.callBack(value)) {
      const currentTimeout = Math.min($this.timeout * 1.3, $this.maxTimeout);
      $this.timeout = currentTimeout;
      setTimeout(() => asyncTimeOutFn($this), currentTimeout);
    }
  });
};

export function capitalizeFullName(fullName: string): string {
  // Separa el nombre completo en palabras individuales
  const words = fullName.split(' ');
  // Capitaliza la primera letra de cada palabra
  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return firstLetter + restOfWord;
  });

  // Une las palabras capitalizadas en un solo string
  const capitalizedFullName = capitalizedWords.join(' ');

  return capitalizedFullName;
}
export function formatearRut(rut: string): string {
  // Primero, eliminamos cualquier carácter que no sea un número o la letra 'k'.
  rut = rut.replace(/[^\dkK]/g, '');

  // Luego, dividimos el RUT en dos partes: el número y el dígito verificador.
  let numero = rut.substring(0, rut.length - 1);
  const dv = rut.charAt(rut.length - 1).toUpperCase();

  // Ahora, formateamos el número agregando puntos cada tres dígitos.
  let formatoNumero = '';
  while (numero.length > 3) {
    formatoNumero = '.' + numero.substr(numero.length - 3) + formatoNumero;
    numero = numero.substring(0, numero.length - 3);
  }
  formatoNumero = numero + formatoNumero;

  // Finalmente, devolvemos el RUT formateado con el dígito verificador.
  return formatoNumero + '-' + dv;
}
