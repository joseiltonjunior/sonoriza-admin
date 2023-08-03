export function formatMoney(money: number) {
  const valorFormatado = money.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return valorFormatado
}
