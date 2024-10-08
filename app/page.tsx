'use client';

import { useState, useTransition } from 'react';
import { Menu, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

// Server action to handle form submission
async function submitComment(input: string) {
  const webhookUrl =
    'https://theuncommonspirit.app.n8n.cloud/webhook-test/instacomments';

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });

    if (!response.ok) {
      throw new Error('Failed to send data to the webhook');
    }

    // Parse the response from the webhook
    const responseData = await response.json();
    return responseData.output; // Assuming the response has an 'output' field
  } catch (error) {
    console.error('Error in submitComment:', error);
    throw error;
  }
}

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const result = await submitComment(input);
        setOutput(result); // Set the output state with the response
        setInput('');
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    });
  };

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar for larger screens */}
      <aside className='hidden w-64 bg-white p-4 shadow-md lg:block'>
        <nav>
          <h2 className='mb-4 text-xl font-bold'>Dashboard</h2>
          <ul>
            <li>
              <a
                href='#'
                className='flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-200'
              >
                <MessageSquare className='mr-2 h-5 w-5' />
                Comments
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className='flex flex-1 flex-col'>
        {/* Header */}
        <header className='bg-white p-4 shadow-md lg:hidden'>
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-bold'>Dashboard</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <Menu className='h-6 w-6' />
                  <span className='sr-only'>Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-64'>
                <nav>
                  <h2 className='mb-4 text-xl font-bold'>Dashboard</h2>
                  <ul>
                    <li>
                      <a
                        href='#'
                        className='flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-200'
                      >
                        <MessageSquare className='mr-2 h-5 w-5' />
                        Comments
                      </a>
                    </li>
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Page content */}
        <div className='flex-1 overflow-auto p-4'>
          <h2 className='mb-4 text-2xl font-bold'>Comments</h2>
          <form onSubmit={handleSubmit} className='mb-4 space-y-4'>
            <Input
              type='text'
              placeholder='Enter your comment...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
          <div className='rounded-lg bg-white p-4 shadow-md'>
            <h3 className='mb-2 font-semibold'>AI Response:</h3>
            <Textarea readOnly value={output} className='h-32 resize-none' />
          </div>
        </div>
      </main>
    </div>
  );
}
