import { describe, expect, test } from '@jest/globals'

import { rollDice } from '../roll'

// To test if the observed frequencies are consistent with a fair dice (i.e., a uniform distribution of the sides),
// we can perform a Chi-Square Goodness-of-Fit test:
//  1. Define the null hypothesis (H0) and the alternative hypothesis (H1):
//    H0: The observed frequencies follow a fair die (i.e., a uniform distribution)
//    H1: The observed frequencies do not follow a fair die
//  2. Set the significance level (α) for the test. Let's assume α = 0.05
//  3. Calculate the expected frequency for each side assuming a fair dice.
//  4. Compute the Chi-Square test statistic (χ^2) by comparing the observed and expected frequencies using the formula χ^2 = Σ((O - E)^2 / E)
//  5. Calculate the degrees of freedom (df) for the test. In this case, df = number of categories - 1 = diceFaceQty - 1
//  6. Determine the critical value from the Chi-Square distribution table or using statistical software at the given significance level (α) and degrees of freedom (df)
//    e.g. for α = 0.05 and df = 5, the critical value is approximately 11.07 (cf Chi-square distribution table)
//  7. Compare the calculated test statistic (χ^2) with the critical value
//    If χ^2 > critical value, reject the null hypothesis
//    otherwise, fail to reject the null hypothesis

describe('roll module', () => {
  test('checks the die is not too biased', () => {
    const diceFaceQty = 8
    // for α = 0.05 and df = 7
    const criticalValue = 14.067
  
    const observedFrequencies: Record<string, number> = {}
    let sampleQty = 0
  
    while (Object.values(observedFrequencies).length === 0 || Object.values(observedFrequencies).some(v => v < diceFaceQty -1)) {
      const value = rollDice(diceFaceQty)
      if (observedFrequencies[value]) {
        observedFrequencies[value] = observedFrequencies[value] +1
      } else {
        observedFrequencies[value] = 1
      }
      sampleQty++
    }
  
    const expectedFrequency = sampleQty / diceFaceQty
    const chiSquarePerValue = Object.keys(observedFrequencies).reduce((acc, key) => {
      acc[key] = ((observedFrequencies[key] - expectedFrequency) * (observedFrequencies[key] - expectedFrequency)) / expectedFrequency
      return acc
    }, {} as Record<string, number>)
  
    const chiSquareTotal = Object.values(chiSquarePerValue).reduce((acc, value) => acc + value, 0)
  
    console.log(`Sample Qty = ${sampleQty}`)
    console.log('Observed frequencies:')
    console.log(observedFrequencies)
  
    console.log('Chi-Square per value:')
    console.log(chiSquarePerValue)
  
    console.log(`Chi-Square = ${chiSquareTotal}`)
    console.log(`degrees of freedom = ${diceFaceQty -1}`)
    console.log(`criticalValue = ${criticalValue}`)
  
    expect(chiSquareTotal <= criticalValue).toBe(true)
  })
})
