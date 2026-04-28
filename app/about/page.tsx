import { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import { AboutHero } from '@/components/AboutHero'
import { AboutStats } from '@/components/AboutStats'

export const metadata: Metadata = {
  title: 'About',
  description: `Learn more about ${siteConfig.name}, a Design Engineer.`,
}

export default function AboutPage() {
  return (
    <article>
      {/* Hero */}
      <AboutHero />

      {/* Content block */}
      <div className="mx-auto max-w-[1100px] px-6 py-20 md:py-28">
        {/* Upper section: title (left) + credentials (right) */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[auto_1fr] md:items-end md:gap-20">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
              About / Intro
            </div>
            <h2 className="font-display font-normal text-[clamp(36px,4.5vw,56px)] leading-[1.05] tracking-[-0.02em]">
              About <em className="italic text-primary">me</em>
            </h2>
          </div>

          <div className="flex md:justify-end">
            <AboutStats
              stats={[
                { value: 'MS HCI', label: 'University of Washington' },
                { value: 'TEAGUE', label: 'Product Design Studio' },
                { value: 'FLEXI-CASA', label: 'Sole Designer & Engineer' },
              ]}
            />
          </div>
        </div>

        {/* Lower section: bio paragraphs, single column */}
        <div className="mt-12 md:mt-16 max-w-[720px] space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            I&apos;m Jinyao Ouyang, a Design Engineer with 4+ years spanning UX/Product
            design, HCI research, and full-stack product development. I hold an MS in
            Technology Innovation (HCI) from the University of Washington and a BE in
            Interaction Design from South China University of Technology.
          </p>
          <p>
            I&apos;ve designed across health, travel, and automotive — and most recently,
            I built and shipped FLEXI-CASA&apos;s headless Shopify storefront
            (Next.js/TypeScript) solo in three weeks, including AI agent infrastructure,
            Etsy integrations, and Amazon tooling.
          </p>
          <p>
            I design and build AI-powered products with a focus on adaptive systems,
            restraint, and human-centered decision making.
          </p>
        </div>

        {/* Divider */}
        <hr className="my-16 border-border md:my-20" />

        {/* Skills & Connect — two-column */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
          {/* Skills */}
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

          {/* Connect */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Connect
            </h3>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              I&apos;m always open to discussing new projects, creative ideas, or
              opportunities to collaborate.
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
