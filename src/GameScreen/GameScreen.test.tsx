import React from "react"
import GameScreen from "../GameScreen/GameScreen"
import * as ReactDOM from "react-dom"

describe("GameScren component tests", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    ReactDOM.render(<GameScreen />, container)
  })

  afterEach(() => {
    document.body.removeChild(container)
    container.remove()
  })

  it("Renders play button on startup", () => {
    const buttons = container.querySelectorAll("button")
    expect(buttons).toHaveLength(1)

    const playBtn = container.querySelector("[data-test='play'")
    expect(playBtn).toBeInTheDocument()
  })
})
