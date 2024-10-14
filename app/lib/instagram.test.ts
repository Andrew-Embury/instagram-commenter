import '@jest/globals';
import { fetchInstagramPosts, fetchInstagramPost } from './instagram';
import { Post } from '@/types/instagram';

// Mock the process.env
jest.mock('process', () => ({
  env: { INSTAGRAM_ACCESS_TOKEN: 'mock-access-token' },
}));

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
          caption: 'Test post',
          media_type: 'IMAGE',
          media_url: 'https://example.com/image.jpg',
          permalink: 'https://instagram.com/p/1',
          timestamp: '2023-05-20T12:00:00Z',
          like_count: 10,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockPosts }),
      });

      const result = await fetchInstagramPosts();

      expect(result).toEqual([
        {
          id: '1',
          imageUrl: 'https://example.com/image.jpg',
          caption: 'Test post',
          likes: 10,
          mediaType: 'IMAGE',
          permalink: 'https://instagram.com/p/1',
          timestamp: '2023-05-20T12:00:00Z',
        },
      ]);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://graph.instagram.com/v20.0/me/media'),
        expect.any(Object)
      );
    });

    it('should throw an error if the fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchInstagramPosts()).rejects.toThrow(
        'Failed to fetch Instagram posts'
      );
    });
  });

  describe('fetchInstagramPost', () => {
    it('should fetch and return a single Instagram post', async () => {
      const mockPost = {
        id: '1',
        caption: 'Test post',
        media_type: 'IMAGE',
        media_url: 'https://example.com/image.jpg',
        permalink: 'https://instagram.com/p/1',
        timestamp: '2023-05-20T12:00:00Z',
        like_count: 10,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPost,
      });

      const result = await fetchInstagramPost('1');

      expect(result).toEqual({
        id: '1',
        imageUrl: 'https://example.com/image.jpg',
        caption: 'Test post',
        likes: 10,
        mediaType: 'IMAGE',
        permalink: 'https://instagram.com/p/1',
        timestamp: '2023-05-20T12:00:00Z',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://graph.instagram.com/v20.0/1'),
        expect.any(Object)
      );
    });

    it('should throw an error if the fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchInstagramPost('1')).rejects.toThrow(
        'Failed to fetch Instagram post'
      );
    });
  });
});
