// Using a native img here to let the image keep its natural aspect ratio without any cropping.

interface FigureProps {
  src: string
  alt: string
  caption?: string
}

export function Figure({ src, alt, caption }: FigureProps) {
  return (
    <figure className="my-8">
      <div className="rounded-lg bg-transparent overflow-hidden">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="block w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
