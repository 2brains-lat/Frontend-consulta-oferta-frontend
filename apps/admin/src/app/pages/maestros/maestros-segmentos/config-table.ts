import { OptionColumn, typeColumn } from "../types";

export const maestroSegmentos: OptionColumn[] = [
    {
      name: 'ID MR',
      value: 'motorReglasId',
      type: typeColumn.TEXT
    },
    {
      name: 'ID VS',
      value: 'verisureId',
      type: typeColumn.TEXT
    },
    {
      name: 'Agrupación',
      value: 'agrupacionId',
      type: typeColumn.DYNAMIC
    },
    {
      name: 'Glosa',
      value: 'glosa',
      type: typeColumn.TEXT
    },
    {
      name: 'Descripción',
      value: 'descripcion',
      type: typeColumn.TEXT
    },
    {
      name: 'Estado',
      value: 'activo',
      type: typeColumn.DYNAMIC
    },
    {
      name: 'Editar',
      value: 'editar',
      type: typeColumn.DYNAMIC
    }    
  ];