'use client';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className='h-screen p-2'>
      <div className='flex h-full items-center justify-center rounded-lg bg-neutral-25 py-4'>
        <div className='flex max-w-[30rem] flex-col items-center gap-4 text-center'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-[32px] font-bold'>Oops... Something went wrong</h1>
            <p>
              It seems we have encountered an issue. Please refresh the page or try again later. Need help?
              Our support team is here for you.
            </p>
            <button
              type='button'
              className='mt-2 py-3 px-5 bg-black text-white rounded-full font-semibold min-w-[120px] cursor-pointer disabled:opacity-50'
              onClick={() => reset()}>
              Go back
            </button>{' '}
          </div>
        </div>
      </div>
    </div>
  );
}
