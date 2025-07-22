import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ConsultaOfertaT } from '@verisure/services';

export function rutValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: string } | null => {
    if (control.value) {
      const rut = control.value.replace(/\./g, '').trim();
      if (!/^[0-9]+-[0-9kK]{1}$/.test(rut)) {
        return { customError: 'Ingrese un rut' };
      }
      const tmp = rut.split('-');
      let digv = tmp[1];
      const numerosRut = tmp[0];
      if (digv == 'K') digv = digv?.toLowerCase();
      if (numerosRut.toString()[0] != '0'  && verifyDVonRut({ rut: numerosRut }) == digv) {
        return null;
      } else {
        return { customError: 'Ingrese un rut valido!' };
      }
    }
    return { customError: '' };
  };
}
const verifyDVonRut = ({ rut }: { rut: number }) => {
  let M = 0,
    S = 1;
  for (; rut; rut = Math.floor(rut / 10))
    S = (S + (rut % 10) * (9 - (M++ % 6))) % 11;
  return S ? S - 1 : 'k';
};

export const formatFormReqItem = ({
  form,
  inmuebles,
  recursos,
  segmentos,
}: {
  form: {
    rut: string;
    segmento: string;
    recurso: string;
    inmueble: number;
    prospecto: string;
  };
  inmuebles: any;
  recursos: any;
  segmentos: any;
}): ConsultaOfertaT => {
  const { rut, segmento, recurso, inmueble, prospecto } = form;

  return {
    tipoCliente: Number(
      segmentos.find((e: { verisureId: string }) => e.verisureId == segmento)
        .tipoClienteId
    ),
    tipoRecurso: Number(
      recursos.find((e: { verisureId: string }) => e.verisureId == recurso)
        .tipoRecursoId
    ),
    tipoInmueble: Number(
      inmuebles.find(
        (e: { verisureId: string }) => e.verisureId == inmueble?.toString()
      ).tipoInmuebleId
    ),
    centroCosto: 181,
    prospecto: prospecto,
    rut: rut.replace(/\./g, '').trim(),
  };
};
