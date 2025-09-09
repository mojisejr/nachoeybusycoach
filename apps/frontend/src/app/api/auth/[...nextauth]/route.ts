import { NextRequest, NextResponse } from 'next/server';

// Proxy all NextAuth requests to the backend server
export async function GET(request: NextRequest) {
  return proxyToBackend(request);
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request);
}

async function proxyToBackend(request: NextRequest) {
  const url = new URL(request.url);
  const backendUrl = `http://localhost:3001${url.pathname}${url.search}`;
  
  try {
    const body = request.method === 'POST' ? await request.text() : undefined;
    
    const response = await fetch(backendUrl, {
      method: request.method,
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
        'Cookie': request.headers.get('Cookie') || '',
        'User-Agent': request.headers.get('User-Agent') || '',
        'Accept': request.headers.get('Accept') || '*/*',
      },
      body,
    });

    const responseBody = await response.text();
    
    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Set-Cookie': response.headers.get('Set-Cookie') || '',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}