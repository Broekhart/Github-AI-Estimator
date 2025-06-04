import { z } from 'zod';
import { Octokit } from 'octokit';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import OpenAI from 'openai';
import { EstimationSchema, FilesSchema } from '~/lib/schemas';
import { decodeBase64 } from '~/lib/utils';

export const openai = new OpenAI();

export const githubToolDefinition = {
  name: 'github',
  parameters: z.object({
    url: z.string().describe('The URL of the GitHub repo to fetch codebase from'),
  }),
};

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type GetEstimationPayload = {
  username: string;
  publicRepo: string;
  feature: string;
};

export const getEstimation = async ({ username, publicRepo, feature }: GetEstimationPayload) => {
  const treeResponse = await octokit.rest.git.getTree({
    owner: username,
    repo: publicRepo,
    tree_sha: 'HEAD',
    recursive: 'true',
  });
  const allPaths = treeResponse.data.tree.filter((item) => item.type === 'blob').map((f) => f.path);

  const relevanceResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a senior developer. 
        You are given a list of file paths from a frontend GitHub repository and a user feature request. 
        Identify which files are most likely to be involved in implementing the request. 
        Return ONLY a JSON array of file paths.`,
      },
      {
        role: 'user',
        content: `Feature request: "${feature}"\n\nHere are the file paths:\n${allPaths.join('\n')}`,
      },
    ],
    temperature: 0.2,
    response_format: zodResponseFormat(FilesSchema, 'files'),
  });

  const selectedPaths = FilesSchema.parse(
    JSON.parse(relevanceResponse.choices[0].message.content ?? '[]')
  ).files;

  const fileContents = await Promise.all(
    selectedPaths.map(async (path) => {
      try {
        const res = await octokit.rest.repos.getContent({
          owner: username,
          repo: publicRepo,
          path,
        });
        if (!('content' in res.data)) return null;
        return {
          path,
          content: decodeBase64(res.data.content),
        };
      } catch (err) {
        return null;
      }
    })
  );

  const filtered = fileContents.filter(Boolean) as {
    path: string;
    content: string;
  }[];

  const context = filtered.map((f) => `// FILE: ${f.path}\n${f.content}`).join('\n\n');

  const estimationResponse = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a senior developer.
        You will be provided with the contents of several files from a frontend codebase (React, Next.js, Astro, etc).
        Estimate the time (in hours) and cost (in euros, €20/hour) required to implement the user's requested feature.
        Include an explanation.`,
      },
      {
        role: 'user',
        content: `Requested feature: "${feature}"\n\nHere are the files:\n\n${context}`,
      },
    ],
    temperature: 0.2,
    response_format: zodResponseFormat(EstimationSchema, 'estimation'),
  });

  const estimation = EstimationSchema.parse(
    JSON.parse(estimationResponse.choices[0].message.content ?? '{}')
  );

  return estimation;
};
