// src/lib/utils.ts

/**
 * Formata um valor numérico (em cêntimos) para Euros.
 * Ex: 2500 -> 25,00 €
 */
export const formatPrice = (valueInCents: number | undefined) => {
  if (valueInCents === undefined || valueInCents === null) return "€ 0,00";

  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(valueInCents / 100); // A divisão mágica acontece aqui
};
