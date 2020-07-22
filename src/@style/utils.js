import Color from 'color'

const range = n => [...Array(n).keys()]

const convert = val => (val instanceof Color ? val : Color(val))

export const createColorScale = (colorA, colorB, steps) => {
  const a = convert(colorA)
  const b = convert(colorB)
  const centerScale =
    steps > 2 ? range(steps - 2).map(n => a.mix(b, (n + 1) / (steps - 1)).hex()) : []

  return [a.hex(), ...centerScale, b.hex()]
}

export const createColorShades = val => {
  const color = convert(val)

  return {
    100: color.lighten(0.5).hex(),
    200: color.lighten(0.375).hex(),
    300: color.lighten(0.25).hex(),
    400: color.lighten(0.125).hex(),
    500: color.hex(),
    600: color.darken(0.125).hex(),
    700: color.darken(0.25).hex(),
    800: color.darken(0.375).hex(),
    900: color.darken(0.5).hex(),
  }
}
