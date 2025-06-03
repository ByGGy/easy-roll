import { SvgIcon, SvgIconProps } from '@mui/material'

export const DiceIcon = ({ strokeWidth = 2, ...others }: SvgIconProps) => {
  return (
    <SvgIcon strokeWidth={strokeWidth} {...others}>
      <svg viewBox='0 0 50 50' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path d='M1.17908 22.0135C1.17913 19.1739 13.7362 2.78013 16.6523 1.28692C19.1666 -0.000524879 40.0798 5.07003 42.064 7.08081C42.9818 8.01087 49.7059 24.2434 49.146 27.2698C48.628 30.0694 36.5109 47.8831 33.6133 48.8924C30.3948 50.0134 11.8317 45.8461 9.92741 43.636C8.07792 41.4897 1.17901 25.4779 1.17908 22.0135Z' stroke='currentColor' />
        <path d='M9.80835 43.3972L15.7596 41.7844L42.4806 31.9288L48.6879 28.5144' stroke='currentColor' />
        <path d='M1.18359 22.1694L21.0564 14.4873L42.0927 7.10547' stroke='currentColor' />
        <path d='M1.25037 22.4152L15.0934 42.0575L34.0177 48.4844L42.8411 31.7745L42.1447 7.15771' stroke='currentColor'  />
        <path d='M17.0805 1.23022L20.8502 14.5699L15.1373 42.0293' stroke='currentColor' />
        <path d='M20.9277 14.6089L42.6517 31.693' stroke='currentColor' />
      </svg>
    </SvgIcon>
  )
}