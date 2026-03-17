import { Helmet } from 'react-helmet-async'

/**
 * PageMeta - SEO metadata per route per document spec
 * Route-specific titles, meta descriptions, Open Graph, Twitter Card
 */
export default function PageMeta({ title, description, path }) {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const canonicalUrl = path ? `${siteUrl}${path}` : siteUrl

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}
