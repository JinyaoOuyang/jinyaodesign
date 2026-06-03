import { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import { AboutHero } from '@/components/AboutHero'
import { AboutStats } from '@/components/AboutStats'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Jinyao Ouyang — PM and Design Engineer at the intersection of AI, product, and engineering. Sole builder at FLEXI-CASA. MS HCI, University of Washington.',
}

export default function AboutPage() {
  return (
    <article>
      {/* Intro — above portrait */}
      <div className="mx-auto max-w-[1100px] px-6 pb-12 pt-24 md:pb-16 md:pt-32">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[auto_1fr] md:items-end md:gap-20">
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              About / Intro
            </div>
            <h2 className="font-display text-[clamp(36px,4.5vw,56px)] font-normal leading-[1.05] tracking-[-0.02em]">
              About <em className="italic text-primary">me</em>
            </h2>
          </div>

          <div className="flex md:justify-end">
            <AboutStats
              stats={[
                { value: 'MS HCI', label: 'University of Washington' },
                { value: 'FLEXI-CASA', label: 'PM & Design Engineer' },
                { value: 'Imagine Cup', label: 'Americas Regional Champion' },
              ]}
            />
          </div>
        </div>

        <div className="mt-12 max-w-[720px] md:mt-16">
          <p className="text-lg leading-[1.65] text-foreground md:text-xl">
            I&apos;m Jinyao — a PM and builder at the intersection of AI, product, and
            engineering.
          </p>

          <div className="mt-8 space-y-5 text-base leading-[1.75] text-muted-foreground">
            <p>
              I don&apos;t hand things off. I design it, build it, and ship it — from system
              architecture to the final pixel. Currently, I&apos;m the sole PM and Design
              Engineer at{' '}
              <span className="text-foreground">FLEXI-CASA</span>, a multi-channel DTC brand
              spanning a headless Shopify/Next.js storefront, Amazon, and Etsy. I own the full
              stack: product strategy, conversion funnel, experimentation, and the code that
              makes it run.
            </p>
            <p>
              Outside of work, I build things because the problem is worth solving.{' '}
              <span className="text-foreground">Trail</span>, an AI-powered job search copilot,
              went from idea to live product in ~4 days — designed, built, and shipped solo.
              That&apos;s how I work.
            </p>
          </div>
        </div>
      </div>

      <AboutHero />

      <div className="mx-auto max-w-[1100px] px-6 py-20 md:py-28">
        {/* What I'm looking for */}
        <section className="max-w-[720px]">
          <h3 className="font-display text-[clamp(24px,3vw,32px)] font-normal leading-tight tracking-[-0.02em]">
            What I&apos;m <em className="italic text-primary">looking for</em>
          </h3>
          <div className="mt-6 space-y-5 text-base leading-[1.75] text-muted-foreground">
            <p>
              I&apos;m actively exploring PM and Design Engineer roles at AI-native companies
              — teams that value judgment over process, ship fast, and treat AI as a core
              product discipline, not a feature checkbox.
            </p>
            <p>
              I&apos;m especially drawn to{' '}
              <span className="text-foreground">growth</span>,{' '}
              <span className="text-foreground">tooling</span>, and{' '}
              <span className="text-foreground">consumer AI</span> problems.
            </p>
          </div>
          <p className="mt-6 border-l-2 border-primary/30 pl-4 text-sm leading-relaxed text-muted-foreground">
            Based in Grand Rapids, MI.(willing to relocate){' '}
            <span className="text-foreground">H-1B transfer-ready</span>.
          </p>
        </section>

        <hr className="my-14 border-border md:my-20" />

        {/* Beyond the work */}
        <section className="max-w-[720px]">
          <h3 className="font-display text-[clamp(24px,3vw,32px)] font-normal leading-tight tracking-[-0.02em]">
            Beyond the <em className="italic text-primary">work</em>
          </h3>
          <ul className="mt-6 space-y-3 text-base leading-[1.75] text-muted-foreground">
            <li className="flex gap-3">
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" aria-hidden="true" />
              <span>
                MS in Technology Innovation (HCI) from the{' '}
                <span className="text-foreground">University of Washington</span>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" aria-hidden="true" />
              <span>
                Originally from China — fluent in{' '}
                <span className="text-foreground">Mandarin</span> and{' '}
                <span className="text-foreground">English</span>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" aria-hidden="true" />
              <span>
                I write on{' '}
                <a
                  href="https://ginouyang.medium.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  Medium
                </a>{' '}
                about AI-native development
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" aria-hidden="true" />
              <span>
                Microsoft Imagine Cup 2022{' '}
                <span className="text-foreground">Americas Regional Champion</span>
              </span>
            </li>
          </ul>
          <p className="mt-8 text-base leading-[1.75] text-muted-foreground italic">
            When I&apos;m not building, I&apos;m strength training, watching chipmunks in my
            backyard, or eating my way through whatever cuisine I haven&apos;t tried yet.
          </p>
        </section>

        <hr className="my-16 border-border md:my-20" />

        {/* Skills & Connect */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Skills &amp; Tools
            </h3>
            <div className="mt-6 grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-medium">Design</h4>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>Product Design</li>
                  <li>UX Research</li>
                  <li>Interaction Design</li>
                  <li>Design Systems</li>
                  <li>Prototyping</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium">Tools</h4>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>Figma</li>
                  <li>Framer</li>
                  <li>Windsurf</li>
                  <li>Notion</li>
                  <li>HTML / CSS / JS</li>
                  <li>React / TypeScript</li>
                  <li>Next.js</li>
                  <li>Supabase</li>
                  <li>Cursor / Claude</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Connect
            </h3>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Open to PM and Design Engineer conversations at AI-native teams. Say hi.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {siteConfig.email}
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
