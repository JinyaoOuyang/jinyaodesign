export function articleSource(content: string) {
  const attribution = content.match(/^\s*> Originally published on Medium:\s*(https:\/\/(?:medium\.com|[a-z0-9-]+\.medium\.com)\/\S+)\s*/)
  if (!attribution) return { sourceUrl: null, content }
  const url = new URL(attribution[1])
  url.search = ''
  url.hash = ''
  return { sourceUrl: url.toString(), content: content.slice(attribution[0].length) }
}
