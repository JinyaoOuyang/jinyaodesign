import { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'About',
  description: `Learn more about ${siteConfig.name}, a UX/Product Designer.`,
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">About</h1>
      </header>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-xl text-muted-foreground leading-relaxed">
          I&apos;m Jinyao Ouyang, a UX/Product Designer passionate about creating 
          intuitive and meaningful digital experiences.
        </p>

        <h2>Background</h2>
        <p>
          With a background spanning product design, user research, and design systems, 
          I bring a holistic approach to solving complex problems. I believe that great 
          design emerges from understanding people deeply and iterating relentlessly.
        </p>
        <p>
          Currently, I focus on designing products that balance business goals with 
          genuine user needs. I enjoy working at the intersection of strategy and craft, 
          where thoughtful decisions create lasting impact.
        </p>

        <h2>Approach</h2>
        <p>
          My design process is grounded in curiosity and collaboration. I start by 
          asking questions, listening carefully, and synthesizing insights into 
          actionable directions. From there, I prototype, test, and refine until 
          the solution feels right.
        </p>
        <p>
          I value simplicity, accessibility, and attention to detail. Every interaction 
          should feel intentional, every flow should feel natural.
        </p>

        <h2>Skills & Tools</h2>
        <div className="grid grid-cols-2 gap-4 not-prose mt-6">
          <div>
            <h3 className="font-medium mb-2">Design</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Product Design</li>
              <li>UX Research</li>
              <li>Interaction Design</li>
              <li>Design Systems</li>
              <li>Prototyping</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Tools</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Figma</li>
              <li>Framer</li>
              <li>Principle</li>
              <li>Notion</li>
              <li>HTML/CSS/JS</li>
            </ul>
          </div>
        </div>

        <h2>Connect</h2>
        <p>
          I&apos;m always open to discussing new projects, creative ideas, or 
          opportunities to collaborate.
        </p>
        <p>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <br />
          <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </p>
      </div>
    </div>
  )
}
