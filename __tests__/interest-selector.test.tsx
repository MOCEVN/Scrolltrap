import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import InterestSelector from '@/components/interest-selector';

describe('InterestSelector', () => {
  it('updates the selected topics when a chip is toggled', async () => {
    const handleInterestsUpdate = jest.fn();
    const user = userEvent.setup();

    render(
      <InterestSelector
        interests={['nature']}
        onInterestsUpdate={handleInterestsUpdate}
      />,
    );

    expect(screen.getByText('1 topic selected')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'nature' }));
    expect(handleInterestsUpdate).toHaveBeenCalledWith([]);

    await user.click(screen.getByRole('button', { name: 'office' }));
    expect(handleInterestsUpdate).toHaveBeenLastCalledWith(['nature', 'office']);
  });
});
