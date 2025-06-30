
'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useLocale } from '@/contexts/locale-context';
import { GoogleIcon, FacebookIcon } from '@/components/icons';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required.'),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const { t } = useLocale();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginData) {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast({
        title: t('loginSuccessTitle'),
        description: t('loginSuccessDescription'),
      });
      router.push('/home');
    } catch (error) {
      console.error(error);
      toast({
        title: t('loginErrorTitle'),
        description: t('loginErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSocialLogin(provider: 'google' | 'facebook') {
    setIsSocialLoading(provider);
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else {
        await loginWithFacebook();
      }
      toast({
        title: t('loginSuccessTitle'),
        description: t('loginSuccessDescription'),
      });
      router.push('/home');
    } catch (error) {
      console.error(error);
      toast({
        title: t('loginErrorTitle'),
        description: t('loginErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsSocialLoading(null);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{t('login')}</CardTitle>
          <CardDescription>
            {t('loginDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>{t('password')}</FormLabel>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading || !!isSocialLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('login')}
              </Button>
            </form>
          </Form>
           <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                {t('orContinueWith')}
                </span>
            </div>
          </div>
        
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => handleSocialLogin('google')} disabled={isLoading || !!isSocialLoading}>
                {isSocialLoading === 'google' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                Google
            </Button>
            <Button variant="outline" onClick={() => handleSocialLogin('facebook')} disabled={isLoading || !!isSocialLoading}>
                {isSocialLoading === 'facebook' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FacebookIcon className="mr-2 h-4 w-4" />}
                Facebook
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            {t('noAccount')}{' '}
            <Link href="/register" className="underline">
              {t('registerLink')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
