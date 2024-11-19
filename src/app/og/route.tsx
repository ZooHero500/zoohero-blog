import { baseConfig } from '@/config/base'
import { ImageResponse } from 'next/og'

  /**
   * This is an API route that generates an open graph image.
   * The image is a white background with a bold black text in the middle.
   * The text is the title of the page, which is passed as a query parameter.
   * If no title is provided, the default title is "Next.js Portfolio Starter".
   * The image is 1200px wide and 630px tall.
   *
   * @param {Request} request - The request object.
   * @returns {ImageResponse} - The image response.
   */
export function GET(request: Request) {
  let url = new URL(request.url)
  let title = url.searchParams.get('title') || baseConfig.title + ' - Blog'

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
        <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
          <h2 tw="flex flex-col text-4xl font-bold tracking-tight text-left">
            {title}
          </h2>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  )
}
