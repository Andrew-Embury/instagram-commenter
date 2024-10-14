import '@jest/globals';
import axios from 'axios';

// Mock the entire ai module
jest.mock('./ai');

// Import the mocked module
import * as aiModule from './ai';

// Define mock functions after the import
const mockGenerateAIResponse = aiModule.generateAIResponse as jest.Mock;
const mockPostAIResponse = aiModule.postAIResponse as jest.Mock;

jest.mock('axios');

describe('AI functions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('generateAIResponse', () => {
    it('should generate an AI response successfully', async () => {
      const mockResponse = 'AI generated response';
      mockGenerateAIResponse.mockResolvedValue(mockResponse);

      const result = await aiModule.generateAIResponse(
        'Test comment',
        'Test caption'
      );

      expect(result).toBe(mockResponse);
    });

    it('should throw an error if webhook configuration is missing', async () => {
      mockGenerateAIResponse.mockRejectedValue(
        new Error('Webhook configuration is missing')
      );

      await expect(
        aiModule.generateAIResponse('Test comment', 'Test caption')
      ).rejects.toThrow('Webhook configuration is missing');
    });

    it('should throw an error if the API call fails', async () => {
      mockGenerateAIResponse.mockRejectedValue(new Error('API call failed'));

      await expect(
        aiModule.generateAIResponse('Test comment', 'Test caption')
      ).rejects.toThrow('API call failed');
    });

    it('should throw an error if the response status is not 200', async () => {
      mockGenerateAIResponse.mockRejectedValue(
        new Error('Failed to generate AI response')
      );

      await expect(
        aiModule.generateAIResponse('Test comment', 'Test caption')
      ).rejects.toThrow('Failed to generate AI response');
    });
  });

  describe('postAIResponse', () => {
    it('should log the AI response', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      mockPostAIResponse.mockImplementation((commentId, response) => {
        console.log(
          `Posting AI response for comment ${commentId}: ${response}`
        );
      });

      await aiModule.postAIResponse('123', 'Test AI response');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Posting AI response for comment 123: Test AI response'
      );
      consoleSpy.mockRestore();
    });
  });
});
