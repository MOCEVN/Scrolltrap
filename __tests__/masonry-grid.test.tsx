import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import MasonryGrid from '@/components/masonry-grid';

describe('MasonryGrid', () => {
  it('prompts users to select interests when none are chosen', async () => {
    render(
      <MasonryGrid
        numColumns={3}
        spacing={12}
        userInterests={[]}
        likedImages={[]}
        toggleLike={jest.fn()}
        isImageLiked={() => false}
      />,
    );

    expect(
      await screen.findByText(/Select a few interests to populate your feed/i),
    ).toBeInTheDocument();
  });
});
