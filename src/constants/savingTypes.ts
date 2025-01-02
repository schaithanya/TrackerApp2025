export const SAVING_TYPES = [
    'FD',
    'Insurance',
    'MF',
    'PPF',
    'CASH',
    'NPS',
    'PF',
    'Others'
] as const;

export type SavingType = typeof SAVING_TYPES[number];
