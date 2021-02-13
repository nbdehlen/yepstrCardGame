export type Deck = {
  success: boolean
  deck_id: string
  shuffled: boolean
  remaining: number
}

export type CardObject = {
  success: boolean
  cards: Card[]
  deck_id: string
  remaining: number
}

export type Card = {
  image: string
  value: string
  suit: string
  code: string
}
