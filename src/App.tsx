import axios, { AxiosResponse } from "axios"
import React, { FunctionComponent, useEffect, useState } from "react"
import { Button } from "react-bootstrap"

type Deck = {
  success: boolean
  deck_id: string
  shuffled: boolean
  remaining: number
}

type CardObject = {
  success: boolean
  cards: Card[]
  deck_id: string
  remaining: number
}

type Card = {
  image: string
  value: string
  suit: string
  code: string
}

const cardValueMap = {
  king: 13,
  queen: 12,
  jack: 11,
  ace: 1,
} as const

const App: FunctionComponent = () => {
  const [deck, setDeck] = useState<Deck>()
  const [cards, setCards] = useState<number[]>([])
  const [cardCount, setCardCount] = useState<any>()
  const [cardPicture, setCardPicture] = useState<string[]>()
  const [guess, setGuess] = useState<string>()
  const [score, setScore] = useState<number>(0)

  useEffect(() => {
    fetchDeck().then((res) => res?.data && setDeck(res.data))
  }, [])

  useEffect(() => {
    if (
      guess === "higher" &&
      cards[cards.length - 1] > cards[cards.length - 2]
    ) {
      setScore((prevState) => prevState + 1)
    } else if (
      guess === "lower" &&
      cards[cards.length - 1] < cards[cards.length - 2]
    ) {
      setScore((prevState) => prevState + 1)
    }
  }, [cards])

  const fetchDeck = async () => {
    try {
      const res = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      )
      return res
    } catch (e) {
      console.log(e)
    }
  }

  const drawCard = async (): Promise<AxiosResponse<CardObject> | undefined> => {
    if (deck) {
      try {
        const res = await axios.get(
          `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`
        )
        return res
      } catch (e) {
        console.log(e)
      }
    }
  }

  const handleDrawCard = () => {
    drawCard().then((response) => {
      if (response) {
        setCardCount(response.data.remaining)
        const images = response.data.cards.map((card) => card.image)
        setCardPicture(images)

        const cardValues = handleCardValues(response.data.cards)
        setCards([...cards, ...cardValues])
      }
    })
  }

  const handleCardValues = (cards: Card[]): number[] => {
    //loop cards, if NaN -> map, else -> number(card)

    const formattedCards = cards.map((card) => {
      // for (const key in cardValueMap) {
      //   console.log(cardValueMap[key])
      // }

      if (card.value.toLowerCase() === "ace") return 1
      if (card.value.toLowerCase() === "king") return 13
      if (card.value.toLowerCase() === "queen") return 12
      if (card.value.toLowerCase() === "jack") return 11
      //cardValueMap[key] not working??
      return Number(card.value)
    })
    return formattedCards
  }

  const handleGuess = (guess: string) => {
    setGuess(guess)
  }

  return (
    <div>
      <div> Cards left: {cardCount ? cardCount : "NaN"}</div>
      <div>
        {cardPicture && cardPicture.map((card) => <img src={card} alt="" />)}
      </div>
      <button onClick={handleDrawCard}>Draw card</button>
      <div>
        <button onClick={() => handleGuess("higher")}>Higher?</button>
        <button onClick={() => handleGuess("lower")}>Lower?</button>
      </div>
      <div>
        Your guess: {guess === "higher" ? "> " : " < "}
        {cards[cards.length - 1]}
      </div>
      <div> Score: {score}</div>
    </div>
  )
}

export default App
