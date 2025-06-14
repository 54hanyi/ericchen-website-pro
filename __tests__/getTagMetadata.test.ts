import { getTagMetadata } from '../lib/getTagMetadata';

describe('getTagMetadata', () => {
  const origEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...origEnv };
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  afterAll(() => {
    process.env = origEnv;
  });

  it('當未設定 NEXT_PUBLIC_SITE_URL 時，使用 default siteName 並回傳正確 metadata', async () => {
    const tag = 'testTag';
    const decodedTag = 'testTag';
    const siteName = 'http://localhost:3000';
    const expectedOgImageUrl = `https://ericchen-website-pro.vercel.app/api/og?title=${encodeURIComponent(
      `#${decodedTag}`
    )}`;

    const metadata = await getTagMetadata(tag);

    // Assert: 基本欄位
    expect(metadata.title).toBe(`#${decodedTag} - ${siteName}`);
    expect(metadata.description).toBe(`這是關於「${decodedTag}」的筆記列表。`);

    // openGraph 檢查
    expect(metadata.openGraph).toBeDefined();
    if (metadata.openGraph) {
      expect(metadata.openGraph.title).toBe(`#${decodedTag} - ${siteName}`);
      expect(metadata.openGraph.description).toBe(`這是關於「${decodedTag}」的筆記列表。`);

      const images = metadata.openGraph.images;
      expect(images).toBeDefined();
      if (Array.isArray(images)) {
        expect(images).toHaveLength(1);
        const img = images[0];
        if (img && typeof img === 'object') {
          interface OGImage {
            url: string;
            width: number;
            height: number;
            alt: string;
          }
          const ogImg = img as OGImage;
          expect(ogImg.url).toBe(expectedOgImageUrl);
          expect(ogImg.width).toBe(1200);
          expect(ogImg.height).toBe(630);
          expect(ogImg.alt).toBe(decodedTag);
        }
      }
    }

    // twitter 檢查（僅檢查 TS type 已知欄位）
    expect(metadata.twitter).toBeDefined();
    if (metadata.twitter) {
      expect(metadata.twitter.title).toBe(`#${decodedTag} - ${siteName}`);
      expect(metadata.twitter.description).toBe(`這是關於「${decodedTag}」的筆記列表。`);

      const twImages = metadata.twitter.images;
      expect(twImages).toBeDefined();
      if (Array.isArray(twImages)) {
        expect(twImages).toHaveLength(1);
        expect(twImages[0]).toBe(expectedOgImageUrl);
      }
      // 不檢查 twitter.card，因 TS type 未宣告，避免 any/ts-ignore
    }
  });

  it('當設定 NEXT_PUBLIC_SITE_URL 時，title 中使用該值', async () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    const tag = 'Example';
    const decodedTag = 'Example';
    const siteName = 'https://example.com';
    const expectedOgImageUrl = `https://ericchen-website-pro.vercel.app/api/og?title=${encodeURIComponent(
      `#${decodedTag}`
    )}`;

    const metadata = await getTagMetadata(encodeURIComponent(tag));

    expect(metadata.title).toBe(`#${decodedTag} - ${siteName}`);
    expect(metadata.description).toBe(`這是關於「${decodedTag}」的筆記列表。`);

    expect(metadata.openGraph).toBeDefined();
    if (metadata.openGraph) {
      expect(metadata.openGraph.title).toBe(`#${decodedTag} - ${siteName}`);
      expect(metadata.openGraph.description).toBe(`這是關於「${decodedTag}」的筆記列表。`);
      const images = metadata.openGraph.images;
      expect(images).toBeDefined();
      if (Array.isArray(images)) {
        expect(images[0]).toMatchObject({
          url: expectedOgImageUrl,
          width: 1200,
          height: 630,
          alt: decodedTag,
        });
      }
    }

    expect(metadata.twitter).toBeDefined();
    if (metadata.twitter) {
      expect(metadata.twitter.title).toBe(`#${decodedTag} - ${siteName}`);
      expect(metadata.twitter.description).toBe(`這是關於「${decodedTag}」的筆記列表。`);
      const twImages = metadata.twitter.images;
      expect(twImages).toBeDefined();
      if (Array.isArray(twImages)) {
        expect(twImages[0]).toBe(expectedOgImageUrl);
      }
    }
  });

  it('可以處理經 URL 編碼的 tag，例如含空格或特殊字元', async () => {
    const rawTag = 'hello world';
    const encodedTag = encodeURIComponent(rawTag);
    const decodedTag = 'hello world';
    const siteName = 'http://localhost:3000';
    const expectedOgImageUrl = `https://ericchen-website-pro.vercel.app/api/og?title=${encodeURIComponent(
      `#${decodedTag}`
    )}`;

    const metadata = await getTagMetadata(encodedTag);

    expect(metadata.title).toBe(`#${decodedTag} - ${siteName}`);
    expect(metadata.description).toBe(`這是關於「${decodedTag}」的筆記列表。`);

    expect(metadata.openGraph).toBeDefined();
    if (metadata.openGraph) {
      const images = metadata.openGraph.images;
      expect(images).toBeDefined();
      if (Array.isArray(images)) {
        const img = images[0];
        if (img && typeof img === 'object') {
          interface OGImage {
            url: string;
            alt: string;
          }
          const ogImg = img as OGImage;
          expect(ogImg.alt).toBe(decodedTag);
          expect(ogImg.url).toBe(expectedOgImageUrl);
        }
      }
    }
    expect(metadata.twitter).toBeDefined();
    if (metadata.twitter) {
      const twImages = metadata.twitter.images;
      expect(twImages).toBeDefined();
      if (Array.isArray(twImages)) {
        expect(twImages[0]).toBe(expectedOgImageUrl);
      }
    }
  });
});
