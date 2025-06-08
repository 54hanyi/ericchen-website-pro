export async function getTagMetadata(tag: string) {
  const decodedTag = decodeURIComponent(tag)
  const siteName = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const ogImageUrl = `https://ericchen-website-pro.vercel.app/api/og?title=${encodeURIComponent(`#${decodedTag}`)}`

  return {
    title: `#${decodedTag} - ${siteName}`,
    description: `這是關於「${decodedTag}」的筆記列表。`,
    openGraph: {
      title: `#${decodedTag} - ${siteName}`,
      description: `這是關於「${decodedTag}」的筆記列表。`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: decodedTag,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `#${decodedTag} - ${siteName}`,
      description: `這是關於「${decodedTag}」的筆記列表。`,
      images: [ogImageUrl],
    },
  }
}
