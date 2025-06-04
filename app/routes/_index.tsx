import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, json, useActionData, useNavigation } from '@remix-run/react';
import { FormSchema } from '~/lib/schemas';
import { getEstimation } from '~/services/github.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Github AI Estimator Agent' },
    { name: 'description', content: 'Welcome to Github AI Estimator Agent!' },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const formData = FormSchema.parse(Object.fromEntries(body.entries()));

  const estimation = await getEstimation(formData);

  return json(estimation);
}

export default function Index() {
  const estimate = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <main className='flex flex-col items-center justify-center min-h-screen p-4'>
      <section className='flex flex-col gap-8 w-full max-w-sm'>
        <div className='flex flex-col gap-1 text-center'>
          <h1 className='text-[32px] font-bold'>Github AI Agent Estimator</h1>
          <p>Insert infos to have an estimate of your requests</p>
        </div>

        <Form method='post' className='flex flex-col gap-4'>
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
            <label htmlFor='username'>Enter feature requested:</label>
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
            className='py-3 px-5 bg-black text-white rounded-full font-semibold min-w-[120px] cursor-pointer disabled:opacity-50'
            disabled={isSubmitting}>
            {isSubmitting ? 'Estimating...' : 'Estimate'}
          </button>
        </Form>
      </section>
      {estimate && (
        <div className='max-w-xl mt-4 flex flex-col gap-4 bg-zinc-100 border border-zinc-30 p-4 rounded-xl'>
          <h2 className='text-xl font-bold'>Estimate</h2>
          <p>Estimated hours: {estimate.hours}</p>
          <p>Estimated cost: ${estimate.cost}</p>
          <p>Explanation: {estimate.explanation}</p>
        </div>
      )}
    </main>
  );
}
