
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnalysisResult } from '@/components/analysis/analysis-result';
import { analyzeFoodImage, type AnalyzeFoodImageOutput } from '@/ai/flows/analyze-food-image';
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLocale } from '@/contexts/locale-context';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageUploadInput() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeFoodImageOutput | null>(null);
  const { toast } = useToast();
  const { t } = useLocale();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: t('fileTooLargeTitle'),
        description: t('fileTooLargeDescription', { size: '5MB' }),
        variant: 'destructive',
      });
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: t('invalidFileTypeTitle'),
        description: t('invalidFileTypeDescription'),
        variant: 'destructive',
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imageFile || !preview) return;
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeFoodImage({ photoDataUri: preview });
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: t('analysisFailedTitle'),
        description: t('analysisFailedDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setImageFile(null);
    setPreview(null);
    setAnalysisResult(null);
  };

  if (analysisResult) {
    return <AnalysisResult result={analysisResult} onReset={reset} />;
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{t('uploadImage')}</CardTitle>
        <CardDescription>{t('uploadImageDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {preview ? (
          <div className="space-y-4">
            <div className="relative w-full aspect-video overflow-hidden rounded-lg border">
              <Image src={preview} alt={t('imagePreviewAlt')} fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleAnalyze} disabled={isLoading} className="flex-grow">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('analyzePhoto')}
              </Button>
              <Button onClick={() => { setImageFile(null); setPreview(null); }} variant="outline" disabled={isLoading}>
                {t('changeImage')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-2">
            <Label htmlFor="image-upload" className="sr-only">{t('selectImage')}</Label>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">{t('clickToUpload')}</span> {t('orDragAndDrop')}</p>
                        <p className="text-xs text-muted-foreground">{t('supportedFormats')}</p>
                    </div>
                    <Input id="image-upload" type="file" className="hidden" onChange={handleFileChange} accept={ACCEPTED_IMAGE_TYPES.join(',')} />
                </label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
