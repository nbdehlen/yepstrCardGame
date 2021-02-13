import axios from "axios"
import { CardObject, Deck } from "./requestTypes"

export const fetchDeck = async (): Promise<Deck | void> => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_DECK_OF_CARDS}/new/shuffle/?deck_count=1`
    )
    return res.data
  } catch (e) {
    console.log(e.message)
  }
}

export const fetchNextCard = async ({
  deck_id,
}: Deck): Promise<CardObject | void> => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_DECK_OF_CARDS}/${deck_id}/draw/?count=1`
    )
    return res.data
  } catch (e) {
    console.log(e.message)
  }
}
