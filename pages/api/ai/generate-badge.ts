import { NextApiRequest, NextApiResponse } from 'next';
import { getWebhookResult, hasWebhookResult, getAllWebhookResults } from '@/utils/aiStorage';

// NOTE: This API bypasses all middleware (verifyRequest, verifyHmac, etc.) for development
// No authentication or token verification is performed
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Make the API call to Freepik from the backend
    const response = await fetch('https://api.freepik.com/v1/ai/text-to-icon', {
      method: 'POST',
      headers: {
        'x-freepik-api-key': process.env.FREEPIK_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        webhook_url: 'https://lokesh2.ngrok.io/api/webhooks/Aiwebhook',
        style: 'color'
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Freepik API error', 
        details: data 
      });
    }

    // Freepik API returns nested structure with data.task_id
    const requestId = data.data?.task_id || data.data?.request_id || data.task_id || data.request_id || data.id || data.requestId;
    
    if (!requestId) {
      console.error('No request_id found in response. Full response:', data);
      return res.status(400).json({
        success: false,
        error: 'No request_id received from Freepik API',
        response: data
      });
    }

    // Check if the response already contains completed status
    if (data.data?.status === 'COMPLETED' && data.data?.generated && data.data.generated.length > 0) {
      return res.status(200).json({
        success: true,
        status: 'COMPLETED',
        request_id: requestId,
        generated: data.data.generated,
        message: 'AI generation completed immediately'
      });
    }
    
    // Return immediately - don't wait for webhook
    console.log('AI generation started, returning task_id for frontend polling');
    return res.status(200).json({
      success: true,
      status: 'STARTED',
      request_id: requestId,
      message: 'AI generation started. Use the request_id to check status.',
      poll_url: `/api/ai/check-status/${requestId}`
    });

  } catch (error) {
    console.error('Error generating AI badge:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to start AI generation'
    });
  }
}
