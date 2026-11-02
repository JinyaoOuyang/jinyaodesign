'use client'

import Image from 'next/image'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { siteConfig } from '@/lib/config'

type ChatRole = 'user' | 'assistant'

type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  /** Assistant-only: show a mailto CTA instead of text-only fallback */
  showEmailCta?: boolean
}

type BotReply =
  | { type: 'answer'; text: string }
  | { type: 'email'; text: string }

const WELCOME =
  "Hi! I'm Jinyao's AI. Ask me anything about her work, skills, or background."

const SUGGESTIONS = ['What do you build?', 'Tech stack?', 'Tell me about Trail'] as const

function normalize(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, ' ')
}

/** Basic intents — short, scripted answers */
function matchBasic(q: string): string | null {
  if (/^(hi|hello|hey|yo|hiya)\b/.test(q)) {
    return "Hey! I'm Jinyao's portfolio assistant. Ask about her work, skills, projects, or how to get in touch."
  }

  if (
    /\b(introduce|introduction|who are you|who is jinyao|tell me about (you|jinyao|yourself)|about you|about jinyao)\b/.test(
      q
    ) ||
    q.includes('introduce yourself') ||
    q.includes('introduce yourselves')
  ) {
    return "Jinyao Ouyang is a Design Engineer and AI-native builder. She designs and ships product experiences—from Figma through deployed code—with a focus on restraint and human-centered systems. Browse Work for case studies or About for more context."
  }

  if (/\b(design engineer|what do you do|role|job title|position)\b/.test(q)) {
    return 'She works as a Design Engineer: product design, prototyping, and front-end implementation—especially for AI-powered products.'
  }

  if (q.includes('what do you build') || q.includes('what you build') || /\bwhat.*build\b/.test(q)) {
    return 'Jinyao designs and ships AI-powered product experiences—from Figma systems through deployed code—with a focus on restraint and human-centered decisions.'
  }

  if (q.includes('tech stack') || /\b(stack|tools|technologies)\b/.test(q)) {
    return 'Typical stack: React, Next.js, TypeScript, Tailwind, Figma, and AI-assisted workflows from exploration through production.'
  }

  if (q.includes('trail')) {
    return 'Trail is an AI-powered job hunt copilot—featured as a case study on this site. Open Work → Trail for the full story.'
  }

  if (/\b(skill|strength|expertise|good at)\b/.test(q)) {
    return 'Core strengths: product design, design systems, prototyping, React/Next.js, and shipping AI-native product flows end to end.'
  }

  if (/\b(experience|background|career|resume|cv)\b/.test(q)) {
    return 'She has shipped work across e-commerce, travel, EV charging, and AI copilots. Grab the resume from the header, or explore case studies under Work.'
  }

  if (
    /\b(project|work|portfolio|case stud(y|ies)?)\b/.test(q) ||
    q.includes('featured') ||
    q.includes('tesla') ||
    q.includes('trip planner') ||
    q.includes('luna')
  ) {
    return 'Selected case studies are on the homepage and under Work—Trail, AI Trip Planner, Tesla charging, and more. Each covers problem, approach, and outcomes.'
  }

  if (/\b(blog|writing|article|post|medium)\b/.test(q)) {
    return 'She publishes notes on the Blog—build logs, AI product thinking, and process. Check Latest notes on the homepage.'
  }

  if (/\b(open to|opportunit|hire|hiring|available|freelance|full.?time|contract)\b/.test(q)) {
    return "Yes—she's open to opportunities (see the badge on the homepage). For roles or collaborations, email works best for details."
  }

  if (/\b(linkedin|medium)\b/.test(q)) {
    return 'LinkedIn and Medium links are in the site footer and hero. For a direct line, use Email me below or the hero LinkedIn link.'
  }

  if (/\b(email|contact|reach|get in touch|message)\b/.test(q)) {
    return `You can reach Jinyao at ${siteConfig.email}.`
  }

  if (/\b(resume|pdf)\b/.test(q)) {
    return 'Resume is linked in the header (Resume). Download there for the latest version.'
  }

  if (/\b(where|location|based|timezone)\b/.test(q)) {
    return "For location and availability details, email is the best channel—happy to connect there."
  }

  if (/\b(thanks|thank you|thx|ty)\b/.test(q)) {
    return "You're welcome! Anything else about work, stack, or projects?"
  }

  if (/\b(bye|goodbye|see you)\b/.test(q)) {
    return 'Bye! Come back anytime—or email Jinyao if you want to talk live.'
  }

  return null
}

/** Long, multi-part, or open-ended questions → email CTA */
function isComplexQuestion(raw: string, q: string): boolean {
  const words = q.split(/\s+/).filter(Boolean)
  if (words.length >= 14) return true
  if (raw.length >= 120) return true
  if ((raw.match(/\?/g) || []).length >= 2) return true

  const complexPatterns = [
    /\b(negotiat|budget|pricing|rate|salary|compensation|contract|nda|legal)\b/,
    /\b(partnership|collaborat|proposal|scope of work|sow|timeline|roadmap)\b/,
    /\b(interview prep|mock interview|case study review|critique my)\b/,
    /\b(explain in detail|walk me through|deep dive|comprehensive|everything about)\b/,
    /\b(compare .+ (and|vs)|difference between .+ and)\b/,
    /\b(how would you|what would you|strategy for|plan for)\b/,
    /\b(custom|bespoke|specific requirement|our company|our team|our product)\b/,
  ]

  return complexPatterns.some((re) => re.test(q))
}

function getReply(text: string): BotReply {
  const q = normalize(text)
  if (!q) {
    return { type: 'answer', text: 'Type a question or tap a suggestion below.' }
  }

  const basic = matchBasic(q)
  if (basic) {
    return { type: 'answer', text: basic }
  }

  if (isComplexQuestion(text, q)) {
    return {
      type: 'email',
      text: "That's a bigger question—Jinyao can answer best over email.",
    }
  }

  // Short, unmatched questions still get a helpful nudge (not email)
  if (wordsUnder(q, 12)) {
    return {
      type: 'answer',
      text: "I'm best at quick questions about Jinyao's work, stack, and projects. Try a suggestion chip below—or ask something more specific about a case study.",
    }
  }

  return {
    type: 'email',
    text: "I don't have a scripted answer for that—reach out directly.",
  }
}

function wordsUnder(q: string, max: number) {
  return q.split(/\s+/).filter(Boolean).length < max
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const TYPING_MS_MIN = 700
const TYPING_MS_MAX = 1200

export function HeroChat() {
  const formId = useId()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: WELCOME },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAnchorRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim()
      if (!text || isTyping) return

      const userMsg: ChatMessage = { id: newId(), role: 'user', content: text }
      setMessages((prev) => [...prev, userMsg])
      setInput('')
      setIsTyping(true)

      const delay = TYPING_MS_MIN + Math.random() * (TYPING_MS_MAX - TYPING_MS_MIN)
      window.setTimeout(() => {
        const reply = getReply(text)
        const assistantMsg: ChatMessage = {
          id: newId(),
          role: 'assistant',
          content: reply.text,
          showEmailCta: reply.type === 'email',
        }
        setMessages((prev) => [...prev, assistantMsg])
        setIsTyping(false)
      }, delay)
    },
    [isTyping]
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    send(input)
  }

  return (
    <div className="min-w-0 lg:pt-2">
      <div className="overflow-hidden rounded-2xl border-[0.5px] border-border bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)] dark:shadow-none">
        <div className="flex items-center gap-3 border-b-[0.5px] border-border bg-muted/40 px-4 py-3.5">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full border-[0.5px] border-border">
            <Image
              src="/avatar-jinyao.png"
              alt="Jinyao Ouyang"
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[-0.01em] text-foreground">Ask Jinyao</p>
            <p className="text-xs text-muted-foreground">AI · responds instantly</p>
          </div>
        </div>

        <div
          className="max-h-[min(420px,55vh)] space-y-3 overflow-y-auto px-4 py-4"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {m.role === 'assistant' && (
                <div
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-[0.5px] border-border bg-muted text-[11px] font-semibold text-foreground"
                  aria-hidden
                >
                  J
                </div>
              )}
              <div
                className={
                  m.role === 'assistant'
                    ? 'max-w-[92%] rounded-2xl rounded-tl-md border-[0.5px] border-border bg-muted/60 px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground'
                    : 'max-w-[92%] rounded-2xl rounded-tr-md border-[0.5px] border-border bg-background px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground'
                }
              >
                <p>{m.content}</p>
                {m.role === 'assistant' && m.showEmailCta && (
                  <a
                    href={`mailto:${siteConfig.email}?subject=${encodeURIComponent('Hello from jinyaodesign.com')}`}
                    className="mt-3 inline-flex items-center justify-center rounded-[8px] btn-primary px-4 py-2 text-[12px] font-medium"
                  >
                    Email me
                  </a>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2">
              <div
                className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-[0.5px] border-border bg-muted text-[11px] font-semibold text-foreground"
                aria-hidden
              >
                J
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border-[0.5px] border-border bg-muted/60 px-4 py-3">
                <span className="hero-typing-dot size-1.5 rounded-full bg-muted-foreground/70" />
                <span className="hero-typing-dot size-1.5 rounded-full bg-muted-foreground/70" />
                <span className="hero-typing-dot size-1.5 rounded-full bg-muted-foreground/70" />
                <span className="sr-only">Jinyao&apos;s AI is typing</span>
              </div>
            </div>
          )}
          <div ref={scrollAnchorRef} />
        </div>

        <div className="space-y-2 border-t-[0.5px] border-border bg-muted/20 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((label) => (
              <button
                key={label}
                type="button"
                disabled={isTyping}
                onClick={() => send(label)}
                className="rounded-full border-[0.5px] border-border bg-background px-3 py-1.5 text-left text-[12px] font-medium text-foreground transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {label}
              </button>
            ))}
          </div>

          <form id={formId} onSubmit={onSubmit} className="flex gap-2">
            <label htmlFor={`${formId}-input`} className="sr-only">
              Message to Ask Jinyao
            </label>
            <input
              id={`${formId}-input`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              disabled={isTyping}
              className="min-h-[44px] flex-1 rounded-lg border-[0.5px] border-border bg-background px-3.5 text-[13px] text-foreground outline-none ring-primary/20 placeholder:text-muted-foreground/70 focus:ring-2 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg border-[0.5px] border-border bg-foreground text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
