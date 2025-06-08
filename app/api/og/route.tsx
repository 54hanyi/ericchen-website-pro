import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') || '預設標題';

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#0f172a',
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: title.length > 30 ? '64px' : '72px',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.2,
            maxWidth: '1000px',
            overflowWrap: 'break-word', // 自動換行
            wordBreak: 'break-word',
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: '40px',
            fontSize: '24px',
            color: '#94a3b8',
          }}
        >
          54hanyi
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
