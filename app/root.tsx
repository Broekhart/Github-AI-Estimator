import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useRouteError,
} from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import './tailwind.css';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
  },
];

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (error instanceof Error) console.error('Error stack trace is', error.stack);

  return (
    <main className='h-screen p-2'>
      <div className='flex h-full items-center justify-center rounded-lg bg-neutral-25 py-4'>
        <div className='flex max-w-[30rem] flex-col items-center gap-4 text-center'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-[32px] font-bold'>Oops... Something went wrong</h1>
            <p>
              It seems we've encountered an issue. Please refresh the page or try again later. Need help? Our
              support team is here for you.
            </p>
            <button
              type='button'
              className='mt-2 py-3 px-5 bg-black text-white rounded-full font-semibold min-w-[120px] cursor-pointer disabled:opacity-50'
              onClick={() => navigate('.')}>
              Go back
            </button>{' '}
          </div>
        </div>
      </div>
    </main>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
