import { serialize } from 'next-mdx-remote/serialize'

export async function serializeMDX(content: string) {
  return serialize(content, {
    parseFrontmatter: false,
  })
}
