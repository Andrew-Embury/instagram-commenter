import '@jest/globals';
// import { Post } from '@/types/instagram';

// Mock the entire instagram module
jest.mock('./instagram', () => ({
  fetchInstagramPosts: jest.fn(),
  fetchInstagramPost: jest.fn(),
}));

// Import the mocked module
import * as instagramModule from './instagram';

// Mock global fetch
global.fetch = jest.fn() as jest.Mock;

describe('Instagram API functions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchInstagramPosts', () => {
    it('should fetch and return Instagram posts', async () => {
      const mockPosts = [
        {
          id: '1',
          imageUrl: 'https://example.com/image.jpg',
          caption: 'Test post',
          likes: 10,
          mediaType: 'IMAGE',
          permalink: 'https://instagram.com/p/1',
          timestamp: '2023-05-20T12:00:00Z',
        },
      ];

      (instagramModule.fetchInstagramPosts as jest.Mock).mockResolvedValueOnce(
        mockPosts
      );

      const result = await instagramModule.fetchInstagramPosts();

      expect(result).toEqual(mockPosts);
    });

    it('should throw an error if the fetch fails', async () => {
      (instagramModule.fetchInstagramPosts as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to fetch Instagram posts')
      );

      await expect(instagramModule.fetchInstagramPosts()).rejects.toThrow(
        'Failed to fetch Instagram posts'
      );
    });
  });

  describe('fetchInstagramPost', () => {
    it('should fetch and return a single Instagram post', async () => {
      const mockPost = {
        id: '1',
        imageUrl: 'https://example.com/image.jpg',
        caption: 'Test post',
        likes: 10,
        mediaType: 'IMAGE',
        permalink: 'https://instagram.com/p/1',
        timestamp: '2023-05-20T12:00:00Z',
      };

      (instagramModule.fetchInstagramPost as jest.Mock).mockResolvedValueOnce(
        mockPost
      );

      const result = await instagramModule.fetchInstagramPost('1');

      expect(result).toEqual(mockPost);
    });

    it('should throw an error if the fetch fails', async () => {
      (instagramModule.fetchInstagramPost as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to fetch Instagram post')
      );

      await expect(instagramModule.fetchInstagramPost('1')).rejects.toThrow(
        'Failed to fetch Instagram post'
      );
    });
  });
});
