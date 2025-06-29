
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLocale } from '@/contexts/locale-context';

type MacroProgressProps = {
    label: string;
    consumed: number;
    target: number;
    unit: string;
};

const MacroProgressBar = ({ label, consumed, target, unit }: MacroProgressProps) => {
    const progress = target > 0 ? Math.min(100, (consumed / target) * 100) : 0;
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm font-medium">
                <span className="flex items-center gap-2">
                    {label}
                    <span className="text-xs text-muted-foreground">({progress.toFixed(0)}%)</span>
                </span>
                <span className="text-muted-foreground">{consumed.toFixed(0)}{unit} / {target}{unit}</span>
            </div>
            <Progress value={progress} />
        </div>
    )
}

type MacroProgressCardProps = {
    consumedProtein: number;
    targetProtein: number;
    consumedCarbs: number;
    targetCarbs: number;
    consumedFat: number;
    targetFat: number;
}

export const MacroProgressCard = ({
    consumedProtein,
    targetProtein,
    consumedCarbs,
    targetCarbs,
    consumedFat,
    targetFat,
}: MacroProgressCardProps) => {
    const { t } = useLocale();

    return (
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>{t('macroGoals')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <MacroProgressBar label={t('protein')} consumed={consumedProtein} target={targetProtein} unit={t('grams')} />
                <MacroProgressBar label={t('carbohydrates')} consumed={consumedCarbs} target={targetCarbs} unit={t('grams')} />
                <MacroProgressBar label={t('fat')} consumed={consumedFat} target={targetFat} unit={t('grams')} />
            </CardContent>
        </Card>
    )
}
