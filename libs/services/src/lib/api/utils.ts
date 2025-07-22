export function createCache(key: string, value: any, ttl: number) {
  const now = new Date();
  if (ttl === undefined || ttl === 0) {
    const diaSemana = now.getDay();
    // Si el día de la semana es diferente de 0 (domingo), resta la cantidad de días necesarios
    // obten el domingo del dia actual
    if (diaSemana !== 0) {
      const diasHastaProximoDomingo = 7 - diaSemana;
      now.setDate(now.getDate() + diasHastaProximoDomingo);
    } else {
      // Si hoy es domingo, simplemente sumar 7 días para obtener el próximo domingo
      now.setDate(now.getDate() + 7);
    }
  } else {
    now.setDate(now.getDate() + ttl);
  }
  const item = {
    value: value,
    expiry: now.getTime(),
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getCache(key: string) {
  const localStorageCache = localStorage.getItem(key);

  if (localStorageCache == undefined || localStorageCache == null) {
    return null;
  }
  const item = JSON.parse(localStorageCache);
  if (!item) {
    return null;
  }
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}
