'use client';

import { useState, useRef, useTransition, useCallback } from 'react';
import Image from 'next/image';
import { Upload, Copy, RefreshCw, Sparkles, Loader2, Image as ImageIcon, FileWarning } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { handlePoemGeneration } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

export function PoemGenerator() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [poem, setPoem] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: `Please upload an image file (${ACCEPTED_IMAGE_TYPES.map(type => type.split('/')[1]).join(', ')}).`,
        });
        return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({
            variant: 'destructive',
            title: 'File Too Large',
            description: `Please upload an image smaller than ${MAX_FILE_SIZE_MB}MB.`,
        });
        return;
    }

    setIsReadingFile(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setPoem(null);
      setError(null);
      setIsReadingFile(false);
    };
    reader.onerror = () => {
        setError('Failed to read file.');
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the selected file. Please try again.',
        });
        setIsReadingFile(false);
    }
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0] ?? null);
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files?.[0] ?? null);
  };

  const handleSubmit = useCallback(() => {
    if (!imagePreview) return;
    setError(null);
    setPoem(null);
    startTransition(async () => {
      const result = await handlePoemGeneration(imagePreview);
      if (result.poem) {
        setPoem(result.poem);
      } else {
        const errorMessage = result.error || 'Failed to generate poem. Please try again.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Poem Generation Error',
          description: errorMessage,
        });
      }
    });
  }, [imagePreview, toast]);

  const handleCopy = () => {
    if (!poem) return;
    navigator.clipboard.writeText(poem);
    toast({
      title: 'Poem Copied!',
      description: 'The verses are now in your clipboard.',
    });
  };

  const handleReset = () => {
    setImagePreview(null);
    setPoem(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!imagePreview) {
    return (
      <Card 
        className="max-w-2xl mx-auto shadow-lg border-primary/20"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Start with a Photo</CardTitle>
          <CardDescription className="font-body">Upload an image to inspire a new poem.</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary hover:bg-secondary/50 transition-all duration-300 group"
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />
            <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept={ACCEPTED_IMAGE_TYPES.join(',')} />
            {isReadingFile ? (
              <>
                <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
                <p className="mt-4 font-body text-muted-foreground">Reading file...</p>
              </>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                <p className="mt-4 font-body text-muted-foreground">
                  <span className="text-primary font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">{ACCEPTED_IMAGE_TYPES.map(t => t.split('/')[1].toUpperCase()).join(', ')} up to {MAX_FILE_SIZE_MB}MB</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <div className="relative aspect-square w-full">
            <Image src={imagePreview} alt="Uploaded photo" fill className="rounded-lg object-cover" data-ai-hint="user photo" />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col gap-6 h-full">
        <Card className="flex-grow shadow-lg animate-in fade-in duration-500">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="font-headline flex items-center gap-2 text-2xl">
              <Sparkles className="text-accent w-6 h-6" />
              Generated Poem
            </CardTitle>
            {poem && !isPending && (
              <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy poem">
                <Copy className="h-5 w-5" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="min-h-[200px] flex flex-col justify-center">
            {isPending && (
              <div className="space-y-3">
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/6" />
                <Skeleton className="h-5 w-5/6" />
              </div>
            )}
            {error && !isPending && (
              <div className="text-center text-destructive font-body flex flex-col items-center gap-2">
                <FileWarning className="w-10 h-10" />
                <p className="font-semibold">Oops! Something went wrong.</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {!isPending && !error && !poem && (
                 <div className="text-center text-muted-foreground font-body flex flex-col items-center gap-2">
                    <ImageIcon className="w-10 h-10" />
                    <p>Your poem will appear here.</p>
                </div>
            )}
            {poem && !isPending && (
              <p className="font-body text-lg/relaxed whitespace-pre-wrap animate-in fade-in duration-700">
                {poem}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleSubmit} disabled={isPending} className="w-full text-base py-6">
            {isPending ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</>
            ) : (
              <>{poem ? '✨ Regenerate Poem' : '✨ Generate Poem'}</>
            )}
          </Button>
          <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto" aria-label="Start Over">
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
