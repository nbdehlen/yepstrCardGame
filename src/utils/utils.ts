export const cardValueMap: { [key: string]: number } = {
  KING: 13,
  QUEEN: 12,
  JACK: 11,
  10: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  ACE: 1,
}

export const ucFirstLetter = (str: string): string => {
  if (cardValueMap[str] < 11 && cardValueMap[str] > 1) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
