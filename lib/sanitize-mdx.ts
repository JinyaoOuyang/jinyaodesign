/**
 * Sanitizes raw MDX body text so it never breaks the next-mdx-remote compiler.
 *
 * Medium exports (and other pasted content) routinely contain patterns that
 * MDX tries to parse as JSX and chokes on. Rather than hand-fixing the source
 * files every time an upstream commit reintroduces them, we normalize the
 * content once here, at the single point where every page loads its MDX.
 *
 * Handled cases:
 *  1. `*` inside Medium CDN image URLs (e.g. `1*AbC.png`) → percent-encoded,
 *     so the asterisk is not read as Markdown emphasis / an invalid character.
 *  2. `<` immediately followed by a digit (e.g. `<15%`) → escaped to `&lt;`,
 *     since a JSX/HTML tag name can never start with a digit.
 *  3. Bare lowercase HTML block tags (`<main>`, `<article>`, …) left in prose
 *     → wrapped in inline code, so MDX shows them as text instead of expecting
 *     a matching closing JSX element.
 *
 * Implementation: a SINGLE left-to-right tokenizing pass. Each match is either
 * a code construct (fenced block or inline span) — returned verbatim — or one
 * of the target patterns. Because code constructs are consumed as whole tokens
 * before any target alternative can match their interior, code is protected
 * without relying on fragile "split and count segments" parity.
 *
 * The tokenizer regex is created FRESH on every call. A shared module-level
 * global RegExp carries mutable `lastIndex` state between invocations, which
 * during a multi-page build caused the same input to sanitize correctly on one
 * call and not on the next — do not hoist it back out of this function.
 */

const BARE_HTML_TAGS = [
  'main',
  'article',
  'section',
  'aside',
  'header',
  'footer',
  'nav',
  'figure',
  'figcaption',
  'details',
  'summary',
  'dialog',
]

function buildTokenRegex(): RegExp {
  // Capture groups, in order:
  //  1: code construct (fenced ``` block, or inline `…` span) — leave untouched
  //  2: Medium CDN URL — percent-encode `*`
  //  3: `<` directly before a digit — escape to &lt;
  //  4: bare lowercase HTML block tag — wrap in inline code
  //
  // No `i` flag — MDX components are PascalCase (e.g. <Figure>), so matching
  // only lowercase tag names avoids clobbering real components.
  return new RegExp(
    [
      '(```[\\s\\S]*?```|`[^`\\n]*`)',
      "(https?:\\/\\/[^\\s)<>\"']*medium\\.com[^\\s)<>\"']*)",
      '(<(?=\\d))',
      `(<\\/?(?:${BARE_HTML_TAGS.join('|')})\\b[^>]*>)`,
    ].join('|'),
    'g'
  )
}

export function sanitizeMdx(source: string): string {
  if (!source) return source

  return source.replace(
    buildTokenRegex(),
    (match, code, mediumUrl, ltDigit, bareTag) => {
      if (code !== undefined) return code
      if (mediumUrl !== undefined) return mediumUrl.replace(/\*/g, '%2A')
      if (ltDigit !== undefined) return '&lt;'
      if (bareTag !== undefined) return '`' + bareTag + '`'
      return match
    }
  )
}
