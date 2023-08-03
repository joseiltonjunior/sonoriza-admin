interface ProductProps {
  id: number
  name: string
  price: number
}

export interface SalesProps {
  id: string
  priceTotal: number
  status: number
  products: ProductProps[]
}
