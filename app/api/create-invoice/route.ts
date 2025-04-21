import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  
  try {
    const body = await req.json();
    const { userId,amount,title } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing required fields: userId and itemId' }, { status: 400 });
    }
    
    const BOT_TOKEN = "7778372967:AAE62_2VWulVJ65ENcLs0QXCLnX0kd0K2IY"
    // process.env.BOT_TOKEN;
    
    if (!BOT_TOKEN) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
    }
    const pay = randomUUID();
    const payload = JSON.stringify({ pay });
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title:title,
        description:`Buy ${title}`,
        payload: payload, // In production, use a JSON string with a unique request ID
        currency: 'XTR',    // Telegram Stars currency code
        prices: [{ label: "dsadsa", amount: Number(amount) }],
        start_parameter: "start_parameter" // Required for some clients
      })
    });

    const data = await response.json();
    
    if (!data.ok) {
      console.error('Telegram API error:', data);
      return NextResponse.json({ error: data.description || 'Failed to create invoice' }, { status: 500 });
    }
    
    
    const invoiceLink = data.result;
 
    return NextResponse.json({ invoiceLink,gterror:data.error });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
} 
