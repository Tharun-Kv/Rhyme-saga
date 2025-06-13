import {NextGenkitHandler} from '@genkit-ai/next';

// Important: Import your flows here, or define them in this file.
// This ensures that Genkit can discover and serve your flows.
import '@/ai/flows/generate-poem';
import '@/ai/flows/suggest-words-phrases';

export const POST = NextGenkitHandler();
