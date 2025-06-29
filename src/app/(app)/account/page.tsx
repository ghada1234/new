'use client';
import { useAuth } from '@/contexts/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AccountPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="font-headline text-2xl font-bold">الحساب</h1>
      <Card>
        <CardHeader>
          <CardTitle>الملف الشخصي</CardTitle>
          <CardDescription>
            هكذا يظهر ملفك الشخصي للآخرين.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.photoURL ?? ''} />
            <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="grid gap-2">
            <Label htmlFor="name">الاسم</Label>
            <Input id="name" defaultValue={user.displayName ?? ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" readOnly defaultValue={user.email ?? ''} />
          </div>
          <Button>حفظ التغييرات</Button>
        </CardContent>
      </Card>
    </div>
  );
}
