import React from 'react';


type SIZES = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl'

const SPACER_SIZES: {
  [K in SIZES]: number
} = {
  xxs: 5,
  xs: 10,
  s: 15,
  m: 20,
  l: 25,
  xl: 30
}

export interface ISpacerProps {
  size: SIZES
  vertical?: boolean
}

export const Spacer: React.FC<ISpacerProps> = (props) => (
  <div
    style={(() => ({
      margin: SPACER_SIZES[props.size],
      display: props.vertical ? 'inline-block' : 'block'
    }))()}
  />
)
