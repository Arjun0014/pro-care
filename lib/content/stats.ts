// TODO(arjun): replace with real numbers from client once confirmed.

export type Stat = {
  value:  number;
  suffix: string;
  label:  string;
};

// TODO(arjun): confirm actual values with client before going live.
// Numbers below are conservative placeholders so the count-up animation
// is visible during build review. ALL must be replaced with client-confirmed
// figures before launch — TODO comments mark each one.
export const stats: Stat[] = [
  {
    value:  5,   // TODO: confirm years operating with client
    suffix: '+',
    label:  'Years delivering across Qatar',
  },
  {
    value:  25,  // TODO: confirm projects completed with client
    suffix: '+',
    label:  'Projects completed',
  },
  {
    value:  8,
    suffix: '',
    label:  'Sectors served',
  },
] as const;
