import { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import { AboutWordCloud } from '@/components/AboutWordCloud'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Jinyao Ouyang — PM and Design Engineer at the intersection of AI, product, and engineering. Sole builder at FLEXI-CASA. MS HCI, University of Washington.',
}

export default function AboutPage() {
  return (
    <article>
      {/* Intro — interactive word-cloud portrait + story panel */}
      <div className="mx-auto max-w-[1100px] px-6 pb-16 pt-10 md:pb-24 md:pt-14">
        <AboutWordCloud />
      </div>

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
