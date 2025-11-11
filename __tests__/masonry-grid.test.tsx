import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import MasonryGrid from '@/components/masonry-grid';
import { ScenarioProvider } from '@/hooks/use-scenario';

describe('MasonryGrid', () => {
  it('prompts users to select interests when none are chosen', async () => {
    render(
      <ScenarioProvider>
        <MasonryGrid
          numColumns={3}
          spacing={12}
          userInterests={[]}
          likedImages={[]}
          toggleLike={jest.fn()}
          isImageLiked={() => false}
        />
      </ScenarioProvider>,
    );

    const message = await screen.findByText(
      /Select a few interests to populate your feed/i,
    );
    expect(message).toBeTruthy();
  });
});
