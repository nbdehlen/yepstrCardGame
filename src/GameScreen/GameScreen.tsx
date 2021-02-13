import React, { FunctionComponent, useEffect, useState } from "react"
import { cardValueMap, ucFirstLetter } from "../utils/utils"
import * as B from "../utils/base"
import back from "../assets/img/back.png"
import { fetchNextCard, fetchDeck } from "../utils/requests"
import { Card, Deck } from "../utils/requestTypes"

type GameState = {
  cards: number[]
  cardCount: number
  cardPicture: string
  guess: string
  score: number
  cardName: string[]
}

const initialGameState: GameState = {
  cards: [],
  cardCount: 52,
  cardPicture: back,
  guess: "",
  score: 0,
  cardName: [],
}

const GameScreen: FunctionComponent = () => {
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
    <div className="h-screen bg-gray-300 font-semibold font-sans pt-8 text-lg">
      <div
        className="container mx-auto text-center juistify-center space-y-2 w-80 
      rounded-xl pb-8 text-white bg-gray-700 font-sans"
      >
        <h1 className="font-sans text-xl pt-4 pb-4 bg-black rounded-t-xl">
          GUESS HIGHER OR LOWER
        </h1>
        <div className="flex justify-center pt-4">
          <img className="rounded-xl " src={cardPicture} alt="" />
        </div>

        <div className="inline-flex justify-between w-48">
          <div className="flex-column">
            <p>Cards left:</p>
            <p>{cardCount}</p>
          </div>
          <div className="flex-column">
            <p>Score: </p>
            <p>
              {score}/{cardCount === 52 ? 0 : 51 - cardCount}
            </p>
          </div>
        </div>

        <p className="border-white border-b-2 border-opacity-50 mx-4 pt-2">
          {cards.length > 1
            ? `
            You guessed ${guess === "higher" ? "larger than " : "smaller than "}
            ${cardName && cardName.length > 1 && cardName[0]}
            `
            : "Your last guess will appear here"}
        </p>

        <div className="pt-4">
          {cardCount === 52 && (
            <button
              onClick={onClickFirst}
              className={B.btnBlue}
              data-test="play"
            >
              Play
            </button>
          )}

          {cardCount === 0 && (
            <button onClick={fetchNewDeck} className={B.btnBlue}>
              Reset
            </button>
          )}

          {!!cards.length && cardCount !== 0 && (
            <div className="inline-flex w-64 justify-center space-x-8 pt-2">
              <button onClick={onClickLower} className={`${B.btnRed} w-24`}>
                Lower
              </button>
              <button onClick={onClickHigher} className={`${B.btnBlue} w-24`}>
                Higher
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameScreen
