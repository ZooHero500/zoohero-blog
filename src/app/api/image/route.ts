import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const imageId = searchParams.get('id')

  if (!imageId) {
    return new NextResponse('Missing image ID', { status: 400 })
  }

  const directusUrl = process.env.DIRECTUS_URL
  const directusToken = process.env.DIRECTUS_TOKEN

  try {
    const response = await fetch(`${directusUrl}/assets/${imageId}`, {
      headers: {
        Authorization: `Bearer ${directusToken}`
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const buffer = await response.arrayBuffer()
    const headers = new Headers(response.headers)

    // 设置缓存头
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')

    return new NextResponse(buffer, {
      headers,
      status: 200
    })
  } catch (error) {
    console.error('Error fetching image:', error)
    return new NextResponse('Failed to fetch image', { status: 500 })
  }
}
