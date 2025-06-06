'use client'

import { highlightText } from '@/utils/highlightText'

export default function HighlightText({
  text,
  keyword,
}: {
  text: string
  keyword: string
}) {
  return <>{highlightText(text, keyword)}</>
}
