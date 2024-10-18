export const rollDice = (max: number) => 1 + Math.floor(Math.random() * max)

// cf Chi-square distribution table
export const runTest = () => {
  const sampleQty = 10000
  const diceMaxValue = 8
  const results: Record<number, number> = {}

  for (let i = 0; i < sampleQty; i++){
    const value = rollDice(diceMaxValue)
    if (results[value]) {
      results[value] = results[value] +1
    } else {
      results[value] = 1
    }
  }

  const perfectQtyPerValue = sampleQty / diceMaxValue
  const gapPerValue = Object.keys(results).reduce((acc, key) => {
    acc[key] = ((results[key] - perfectQtyPerValue) * (results[key] - perfectQtyPerValue)) / perfectQtyPerValue
    return acc
  }, {} as Record<number, number>)

  const overallGap = Object.values(gapPerValue).reduce((acc, value) => acc + value, 0)

  console.log(results)
  console.log(gapPerValue)
  console.log(overallGap)
}