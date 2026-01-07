export type DreamMockUser = {
  name: string;
  initials: string;
};

const DREAM_MOCK_USERS: readonly DreamMockUser[] = [
  { name: 'John Doe', initials: 'JD' },
  { name: 'Jane Smith', initials: 'JS' },
  { name: 'Alex Johnson', initials: 'AJ' },
  { name: 'Mei Chen', initials: 'MC' },
  { name: 'Samira Khan', initials: 'SK' },
  { name: 'Luca Rossi', initials: 'LR' },
];

export const getDreamMockUser = (seed: string): DreamMockUser => {
  let score = 0;
  for (let i = 0; i < seed.length; i += 1) {
    score += seed.charCodeAt(i);
  }

  const index = score % DREAM_MOCK_USERS.length;
  return DREAM_MOCK_USERS[index] ?? DREAM_MOCK_USERS[0]!;
};
