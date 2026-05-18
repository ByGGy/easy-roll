export const rollDice = (max: number) => {
  const offset = Math.sign(max)
  const toInt = max >=0 ? Math.floor : Math.ceil
  return offset + toInt(Math.random() * max)
}

export const rollExplodingDice = (max: number) => {
  // prevent infinite rolls
  if (Math.abs(max) < 2) {
    return [rollDice(max)]
  } else {
    const result: Array<number> = []
    do {
      result.push(rollDice(max))
    } while (result[result.length -1] === max)
    return result
  }
}