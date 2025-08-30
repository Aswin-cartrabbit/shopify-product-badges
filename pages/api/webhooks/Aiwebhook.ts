import { NextApiRequest, NextApiResponse } from 'next';
import { setWebhookResult } from '@/utils/aiStorage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookData = req.body;
    
    // Log the incoming webhook
    console.log('Webhook received:', {
      timestamp: new Date().toISOString(),
      body: webhookData,
      headers: req.headers
    });

    // If status is completed, store the result
    if (webhookData.status === 'COMPLETED' && webhookData.request_id && webhookData.generated) {
      console.log('Webhook: Storing completed generation for:', webhookData.request_id);
      
      setWebhookResult(webhookData.request_id, {
        status: webhookData.status,
        generated: webhookData.generated,
        timestamp: new Date().toISOString()
      });
      
      console.log('Webhook: Stored completed generation:', webhookData.request_id, webhookData.generated[0]);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
