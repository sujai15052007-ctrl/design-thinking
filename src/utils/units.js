const KG_PER_UNIT = {
  g: 0.001,
  kg: 1,
  oz: 0.028349523125,
  lb: 0.45359237,
};

export function toCanonicalQuantity(quantity, unit) {
  const factor = KG_PER_UNIT[unit];
  if (!factor) return { quantity: Number(quantity), unit, weightKg: null };
  const weightKg = Number(quantity) * factor;
  return { quantity: weightKg, unit: 'kg', weightKg };
}

export function fromCanonicalItem(item, units) {
  if (item.unit !== 'kg') return item;
  if (units === 'imperial') {
    return { ...item, quantity: Number(item.quantity) / KG_PER_UNIT.lb, unit: 'lb' };
  }
  return { ...item, quantity: Number(item.quantity) * 1000, unit: 'g' };
}
