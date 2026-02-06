import { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import { AboutHero } from '@/components/AboutHero'
import { AboutStats } from '@/components/AboutStats'

export const metadata: Metadata = {
  title: 'About',
  description: `Learn more about ${siteConfig.name}, a UX/Product Designer.`,
}

export default function AboutPage() {
  return (
    <article>
      {/* Hero */}
      <AboutHero />

      {/* Content block */}
      <div className="mx-auto max-w-[1100px] px-6 py-20 md:py-28">
        {/* Two-column: About text + Stats */}
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[1fr_auto] md:gap-20">
          {/* Left — About Me */}
          <div>
            <h2
              className="text-3xl font-semibold tracking-tight md:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              About Me
            </h2>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>
                I&apos;m Jinyao Ouyang, a UX/Product Designer who designs and builds
                AI-powered products with a focus on adaptive systems, restraint, and
                human-centered decision making. I bring a holistic approach to solving
                complex problems — from strategy through craft.
              </p>
              <p>
                My process is grounded in curiosity and collaboration. I start by asking
                questions, listening carefully, and synthesizing insights into actionable
                directions. I value simplicity, accessibility, and attention to detail —
                every interaction should feel intentional, every flow should feel natural.
              </p>
            </div>
          </div>

          {/* Right — Stats */}
          <div className="flex items-start pt-0 md:pt-14">
            <AboutStats />
          </div>
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
