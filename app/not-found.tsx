import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
      <h1 className="text-6xl font-semibold tracking-tight">404</h1>
      <p className="mt-4 text-xl text-muted-foreground">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
      >
        Go Home
      </Link>
    </div>
  )
}
