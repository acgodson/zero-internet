// pages/api/sms.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const smsBody = req.body.Body;
    const fromNumber = req.body.From;

    console.log(`Received SMS from ${fromNumber}: ${smsBody}`);

    // Here we can connect to Chainlink or any other service


    res.status(200).json({ title: "Penny SMS", message: "SMS received" });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
