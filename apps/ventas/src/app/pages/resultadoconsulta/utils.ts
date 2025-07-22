export const breadcrumbsItemsDefaultValues = [
  { id: '0', label: 'Kit Inicial', disabled: false },
  { id: '1', label: 'Descuentos', disabled: true },
  { id: '2', label: 'Packs', disabled: true },
  { id: '3', label: 'Resumen', disabled: true },
];

export const reviewPrices = () => {
  return {
    kit: 'selectedKit.descripcion',
    paycode: 'instalation.paycode ',
    autorizacion: 'authorization ',
    precioInstalacion: 123219933,
    precioMonitoreo: 1.2,
    descuentoCupon: false,
    descuentoRenove: false,
    descuentoMonitoreo: false,
  };
};
export const different = (array: any[]) => {
  const common = array.reduce(function (acc, obj) {
    for (const p in obj) acc[p] = obj[p];
    return acc;
  }, {});

  const _different = array.reduce(function (acc, obj) {
    for (const p in common)
      if (common[p] !== obj[p]) {
        delete common[p];
        acc.push(p);
      }
    return acc;
  }, []);

  return _different;
};

export const formCacheData = () => {
  return;
};
