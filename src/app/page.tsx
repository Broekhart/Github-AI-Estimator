'use client';

import { estimateAction } from './actions';
import { useActionState } from 'react';

export default function HomePage() {
  const [state, formAction] = useActionState(estimateAction, null);
  const { estimation } = state ?? {};

  return (
    <main className='flex flex-col items-center justify-center min-h-screen p-4'>
      <section className='flex flex-col gap-8 w-full max-w-sm'>
        <div className='flex flex-col gap-1 text-center'>
          <h1 className='text-[32px] font-bold'>Github AI Agent Estimator</h1>
          <p>Insert infos to have an estimate of your requests</p>
        </div>

        <form action={formAction} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='username'>Enter GitHub Username:</label>
            <input
              type='text'
              id='username'
              name='username'
              placeholder='Username'
              required
              className='border border-black rounded-full px-5 py-3 outline-none'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='publicRepo'>Enter GitHub public repo:</label>
            <input
              type='text'
              id='publicRepo'
              name='publicRepo'
              placeholder='Repo'
              required
              className='border border-black rounded-full px-5 py-3 outline-none'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='feature'>Enter feature requested:</label>
            <input
              type='text'
              id='feature'
              name='feature'
              placeholder='Feature'
              required
              className='border border-black rounded-full px-5 py-3 outline-none'
            />
          </div>
          <button
            type='submit'
            className='py-3 px-5 bg-black text-white rounded-full font-semibold min-w-[120px] cursor-pointer disabled:opacity-50'>
            Estimate
          </button>
        </form>
      </section>

      {estimation && (
        <div className='max-w-xl mt-4 flex flex-col gap-4 bg-zinc-100 border border-zinc-30 p-4 rounded-xl'>
          <h2 className='text-xl font-bold'>Estimate</h2>
          <p>Estimated hours: {estimation.hours}</p>
          <p>Estimated cost: ${estimation.cost}</p>
          <p>Explanation: {estimation.explanation}</p>
        </div>
      )}
    </main>
  );
}
