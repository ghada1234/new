
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
import { Label } from '@/components/ui/label';
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

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required.'),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, signInWithGoogle, signInWithFacebook } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const { t } = useLocale();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const anyLoading = isLoading || isGoogleLoading || isFacebookLoading;

  async function onSubmit(data: LoginData) {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast({
        title: t('loginSuccessTitle'),
        description: t('loginSuccessDescription'),
      });
      router.push('/dashboard');
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

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: t('loginSuccessTitle'),
        description: t('loginSuccessDescription'),
      });
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast({
        title: t('loginErrorTitle'),
        description: t('loginErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsFacebookLoading(true);
    try {
      await signInWithFacebook();
      toast({
        title: t('loginSuccessTitle'),
        description: t('loginSuccessDescription'),
      });
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast({
        title: t('loginErrorTitle'),
        description: t('loginErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsFacebookLoading(false);
    }
  };

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
                        disabled={anyLoading}
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
                      <Input type="password" {...field} disabled={anyLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={anyLoading}>
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
              <span className="bg-background px-2 text-muted-foreground">
                {t('orContinueWith')}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleGoogleLogin} disabled={anyLoading}>
              {isGoogleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Google
            </Button>
            <Button variant="outline" onClick={handleFacebookLogin} disabled={anyLoading}>
              {isFacebookLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
