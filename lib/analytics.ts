/** Classify only public destinations; never forward query strings or email addresses. */
export function classifyLink(href: string, origin: string) {
  let url: URL
  try { url = new URL(href, origin) } catch { return null }
  if (url.protocol === 'mailto:') return { name: 'contact_click', params: { method: 'email' } }
  if (!['http:', 'https:'].includes(url.protocol)) return null
  if (url.origin === origin) {
    if (url.pathname === '/Jinyao_Ouyang_Resume.pdf') return { name: 'resume_click', params: {} }
    const match = url.pathname.match(/^\/work\/([^/]+)\/?$/)
    return match ? { name: 'project_open', params: { project_slug: match[1] } } : null
  }
  const host = url.hostname
  if (host === 'www.linkedin.com' || host === 'linkedin.com') return { name: 'contact_click', params: { method: 'linkedin' } }
  if (['trailai-rose.vercel.app', 'flexi-casa.com', 'www.flexi-casa.com'].includes(host)) return { name: 'demo_click', params: { destination: host } }
  if (host === 'github.com') return { name: 'source_click', params: { destination: host } }
  return null
}
