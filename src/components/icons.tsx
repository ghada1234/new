import type { SVGProps } from 'react';

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.73 1.9-5.77 0-10.4-4.87-10.4-10.9 0-6.03 4.63-10.9 10.4-10.9 3.37 0 5.33 1.44 6.55 2.62l2.35-2.35C19.29.93 16.33 0 12.48 0 5.88 0 0 5.93 0 12.4s5.88 12.4 12.48 12.4c3.24 0 5.95-1.08 7.95-3.03s2.95-5.05 2.95-8.33c0-.73-.05-1.42-.15-2.08H12.48z" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Facebook</title>
      <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z" />
    </svg>
  );
}
