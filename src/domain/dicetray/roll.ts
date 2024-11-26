export const rollDice = (max: number) => {
  const offset = Math.sign(max)
  const toInt = max >=0 ? Math.floor : Math.ceil
  return offset + toInt(Math.random() * max)
}