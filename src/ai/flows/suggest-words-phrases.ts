'use server';
/**
 * @fileOverview AI agent that suggests words and phrases for a poem.
 *
 * - suggestWordsAndPhrases - A function that suggests words and phrases for a poem.
 * - SuggestWordsAndPhrasesInput - The input type for the suggestWordsAndPhrases function.
 * - SuggestWordsAndPhrasesOutput - The return type for the suggestWordsAndPhrases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestWordsAndPhrasesInputSchema = z.object({
  topic: z.string().describe('The topic of the poem.'),
  style: z.string().describe('The style of the poem.'),
  poemFragment: z.string().describe('A fragment of the poem to improve.'),
});
export type SuggestWordsAndPhrasesInput = z.infer<typeof SuggestWordsAndPhrasesInputSchema>;

const SuggestWordsAndPhrasesOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of suggested words and phrases.'),
});
export type SuggestWordsAndPhrasesOutput = z.infer<typeof SuggestWordsAndPhrasesOutputSchema>;

export async function suggestWordsAndPhrases(input: SuggestWordsAndPhrasesInput): Promise<SuggestWordsAndPhrasesOutput> {
  return suggestWordsAndPhrasesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestWordsAndPhrasesPrompt',
  input: {schema: SuggestWordsAndPhrasesInputSchema},
  output: {schema: SuggestWordsAndPhrasesOutputSchema},
  prompt: `You are a creative writing assistant that suggests words and phrases to improve a poem.\n\nTopic: {{{topic}}}\nStyle: {{{style}}}\nPoem Fragment: {{{poemFragment}}}\n\nSuggest words and phrases that fit the style of the poem and improve the poem fragment. Return an array of strings. Focus on specific, actionable suggestions. Do not suggest full sentences, instead focus on specific words or short phrases.
`,
});

const suggestWordsAndPhrasesFlow = ai.defineFlow(
  {
    name: 'suggestWordsAndPhrasesFlow',
    inputSchema: SuggestWordsAndPhrasesInputSchema,
    outputSchema: SuggestWordsAndPhrasesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
