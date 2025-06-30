import { PoemGenerator } from '@/components/poem-generator';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">
            Imago Verses
          </h1>
          <p className="mt-2 md:mt-4 text-lg md:text-xl text-muted-foreground font-body">
            Transform your visual moments into poetic text.
          </p>
        </header>
        <PoemGenerator />
      </div>
    </main>
  );
}
