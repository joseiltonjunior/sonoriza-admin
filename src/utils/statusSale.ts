export function formatStatusSale(status: number) {
  switch (status) {
    case 1:
      return 'Pendente'

    case 2:
      return 'Finalizada'

    default:
      return ''
  }
}
