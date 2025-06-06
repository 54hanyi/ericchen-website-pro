export async function getTagMetadata(tag: string) {
  const decodedTag = decodeURIComponent(tag)
  const siteName = '你的網站名稱' // ← 記得換成你的網站名稱
  const ogImageUrl = `https://你的網域/api/og?title=${encodeURIComponent(`#${decodedTag}`)}`

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
