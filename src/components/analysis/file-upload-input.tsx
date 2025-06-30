
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AnalysisResult } from '@/components/analysis/analysis-result';
import { analyzeFoodImage, type AnalyzeFoodImageOutput } from '@/ai/flows/analyze-food-image';
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/locale-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

export function FileUploadInput() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeFoodImageOutput | null>(null);
  const { toast } = useToast();
  const { t } = useLocale();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast({
        title: t('fileUploadErrorTitle'),
        description: t('fileTooLarge', { size: MAX_FILE_SIZE_MB }),
        variant: "destructive",
      });
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: t('fileUploadErrorTitle'),
        description: t('invalidFileType'),
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzePhoto = async () => {
    if (!photo) return;
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeFoodImage({ photoDataUri: photo });
       const isWater = result?.foodItems?.some(item => item.name.toLowerCase().includes('water'));
      
      if (!result || !result.foodItems || result.foodItems.length === 0 || ((!result.estimatedCalories || result.estimatedCalories <= 0) && !isWater)) {
          toast({
              title: t('couldNotIdentifyFood'),
              description: t('couldNotIdentifyFoodInImage'),
              variant: "destructive"
          });
          setIsLoading(false);
          return;
      }
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: t('analysisFailedTitle'),
        description: t('analysisFailedDescription'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setPhoto(null);
    setAnalysisResult(null);
  };

  if (analysisResult) {
    return <AnalysisResult result={analysisResult} onReset={reset} />;
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{t('upload')}</CardTitle>
        <CardDescription>{t('uploadFileDescription', { size: MAX_FILE_SIZE_MB })}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {photo ? (
          <div className="relative w-full max-w-lg overflow-hidden rounded-lg border aspect-video">
            <img src={photo} alt="Uploaded meal" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg">
             <Upload className="w-12 h-12 text-muted-foreground" />
             <Label htmlFor="file-upload" className="mt-4 text-center cursor-pointer text-primary hover:underline">
                {t('selectImage')}
             </Label>
             <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept={ACCEPTED_IMAGE_TYPES.join(',')} />
          </div>
        )}

        {photo && (
          <div className="flex flex-wrap gap-2">
            <Button onClick={analyzePhoto} size="lg" disabled={isLoading} className="bg-accent hover:bg-accent/90">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('analyzePhoto')}
            </Button>
            <Button onClick={reset} variant="outline" disabled={isLoading}>
              {t('changeImage')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
