'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AnalysisResult } from '@/components/analysis/analysis-result';
import { analyzeFoodImage, type AnalyzeFoodImageOutput } from '@/ai/flows/analyze-food-image';
import { Loader2, Camera, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/locale-context';

export function CameraInput() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeFoodImageOutput | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const { toast } = useToast();
  const { t } = useLocale();

  const startCamera = useCallback(async (mode: 'user' | 'environment') => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast({
        title: t('cameraErrorTitle'),
        description: t('cameraErrorDescription'),
        variant: "destructive",
      });
    }
  }, [stream, toast, t]);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const takePhoto = () => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setPhoto(dataUri);
        stream?.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const analyzePhoto = async () => {
    if (!photo) return;
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeFoodImage({ photoDataUri: photo });

      const isWater = result.foodItems.some(item => item.name.toLowerCase().includes('water'));
      
      // The AI should return > 0 calories for food. If not, we consider it a failure to identify.
      // This also handles cases where non-food items are correctly identified with 0 calories.
      if (result.estimatedCalories <= 0 && !isWater) {
          toast({
              title: t('couldNotIdentifyFood'),
              description: t('couldNotIdentifyFoodInImage'),
              variant: "destructive"
          });
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
    startCamera(facingMode);
  };
  
  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  if (analysisResult) {
    return <AnalysisResult result={analysisResult} onReset={reset} />;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-lg border aspect-video">
        {photo ? (
          <img src={photo} alt="Captured meal" className="h-full w-full object-cover" />
        ) : (
          <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {!photo && stream && (
          <Button onClick={takePhoto} size="lg">
            <Camera className="mr-2 h-4 w-4" />
            {t('takePhoto')}
          </Button>
        )}
         {!photo && (
          <Button onClick={toggleCamera} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('switchCamera')}
          </Button>
        )}
        {photo && (
          <>
            <Button onClick={analyzePhoto} size="lg" disabled={isLoading} className="bg-accent hover:bg-accent/90">
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t('analyzePhoto')}
            </Button>
            <Button onClick={reset} variant="outline" disabled={isLoading}>
              {t('retakePhoto')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
