import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import InterestSelector from '@/components/interest-selector';
import { ScenarioModeContext } from '@/hooks/use-scenario-mode';

describe('InterestSelector', () => {
  it('updates the selected topics when a chip is toggled', async () => {
    const handleInterestsUpdate = jest.fn();
    const user = userEvent.setup();

    render(
      <ScenarioModeContext.Provider
        value={{
          mode: 'dream',
          setMode: () => {},
          toggleMode: () => {},
          isDoom: false,
        }}
      >
        <InterestSelector
          interests={['nature']}
          onInterestsUpdate={handleInterestsUpdate}
        />
      </ScenarioModeContext.Provider>,
    );

    expect(screen.getByText('1 selected')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /nature/i }));
    expect(handleInterestsUpdate).toHaveBeenCalledWith([]);

    await user.click(screen.getByRole('button', { name: /office/i }));
    expect(handleInterestsUpdate).toHaveBeenLastCalledWith(['nature', 'office']);
  });
});
