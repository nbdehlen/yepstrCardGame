import React, { FunctionComponent, useEffect, useState } from "react"
import { cardValueMap, ucFirstLetter } from "./utils/utils"
import * as B from "./utils/base"
import back from "./assets/img/back.png"
import "./flip.css"
import { fetchNextCard, fetchDeck } from "./utils/requests"
import { Card, Deck } from "./utils/requestTypes"

type GameState = {
  cards: number[]
  cardCount: number
  cardPicture: string
  guess: string
  score: number
  cardName: string[]
}

const initialGameState = {
  cards: [],
  cardCount: 52,
  cardPicture: back,
  guess: "",
  score: 0,
  cardName: [],
}

const App: FunctionComponent = () => {
  const [deck, setDeck] = useState<Deck>()
  const [gameState, setGameState] = useState<GameState>(initialGameState)

  useEffect(() => {
    fetchNewDeck()
  }, [])

  const { cards, cardCount, cardPicture, guess, score, cardName } = gameState

  const fetchNewDeck = () => {
    cardCount === 0 && setGameState(initialGameState)
    fetchDeck().then((data) => data && setDeck(data))
  }

  const handleDrawCard = (guess = "") => {
    if (deck) {
      fetchNextCard(deck).then((data) => {
        if (data) {
          const image = data.cards[0].image
          const cardNameArr = handleCardName(ucFirstLetter(data.cards[0].value))
          const cardValue = handleCardValue(data.cards[0])

          const updateScore = handleScore(
            guess,
            cards[cards.length - 1],
            cardValue
          )
          setGameState({
            ...gameState,
            cardCount: data.remaining,
            cardPicture: image,
            guess: guess,
            score: gameState.score + updateScore,
            cardName: cardNameArr,
            cards: [...gameState.cards, cardValue],
          })
        }
      })
    }
  }

  const handleCardName = (formattedCardName: string): string[] =>
    gameState.cardName
      ? [
          ...gameState.cardName.slice(gameState.cardName.length - 1),
          formattedCardName,
        ]
      : [formattedCardName]

  const handleCardValue = (card: Card): number => cardValueMap[card.value]

  const handleScore = (guess: string, prevCard: number, curCard: number) => {
    if (guess === "higher" && curCard > prevCard) {
      return 1
    } else if (guess === "lower" && curCard < prevCard) {
      return 1
    }
    return 0
  }

  const onClickHigher = () => handleDrawCard("higher")
  const onClickLower = () => handleDrawCard("lower")
  const onClickFirst = () => handleDrawCard()

  return (
    <div className="h-screen bg-gray-200 font-semibold">
      <div className="container mx-auto text-center">
        <div className="flex justify-center">
          <img className="rounded-xl" src={cardPicture} alt="" />
        </div>

        <div className="flex-column flex-initial justify-center text-center">
          <div className="text-center justify-self-center">
            Cards left: {cardCount}
          </div>
          <div>
            Score: {score}/{cardCount === 52 ? 0 : 51 - cardCount}
          </div>
        </div>

        {cards.length > 1 && (
          <div>
            You guessed {guess === "higher" ? "larger than " : "Smaller than "}
            {cardName && cardName.length > 1 && cardName[0]}
          </div>
        )}

        {cardCount === 52 && (
          <button onClick={onClickFirst} className={B.btnBlue}>
            Play
          </button>
        )}

        {cardCount === 0 && (
          <button onClick={fetchNewDeck} className={B.btnBlue}>
            Reset
          </button>
        )}

        {!!cards.length && cardCount !== 0 && (
          <div>
            <button onClick={onClickHigher} className={B.btnBlue}>
              Guess higher
            </button>
            <button onClick={onClickLower} className={B.btnBlue}>
              Guess lower
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
