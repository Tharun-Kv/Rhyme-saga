'use client';

import { useState, useEffect } from 'react';
import { generatePoem, type GeneratePoemInput } from '@/ai/flows/generate-poem';
import { suggestWordsAndPhrases, type SuggestWordsAndPhrasesInput } from '@/ai/flows/suggest-words-phrases';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LogoIcon } from '@/components/icons/logo';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Download, Lightbulb, Zap } from 'lucide-react';

export default function RhymeSageClient() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('');
  const [poem, setPoem] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGeneratingPoem, setIsGeneratingPoem] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [poemVisible, setPoemVisible] = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (poem) {
      setPoemVisible(true);
    }
  }, [poem]);

  useEffect(() => {
    if (suggestions.length > 0) {
      setSuggestionsVisible(true);
    }
  }, [suggestions]);


  const handleGeneratePoem = async () => {
    if (!topic || !style) {
      toast({
        title: 'Missing information',
        description: 'Please provide both a topic and a style for your poem.',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingPoem(true);
    setPoem(''); // Clear previous poem
    setPoemVisible(false); // Hide poem area before new one is generated
    try {
      const input: GeneratePoemInput = { topic, style };
      const result = await generatePoem(input);
      setPoem(result.poem);
      toast({
        title: 'Poem Generated!',
        description: 'Your new poem is ready.',
      });
    } catch (error) {
      console.error('Error generating poem:', error);
      toast({
        title: 'Generation Failed',
        description: 'Could not generate poem. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPoem(false);
    }
  };

  const handleSuggestWords = async () => {
    if (!poem) {
      toast({
        title: 'No poem found',
        description: 'Please generate or write a poem before asking for suggestions.',
        variant: 'destructive',
      });
      return;
    }

    setIsSuggesting(true);
    setSuggestions([]);
    setSuggestionsVisible(false);
    try {
      const input: SuggestWordsAndPhrasesInput = { topic, style, poemFragment: poem };
      const result = await suggestWordsAndPhrases(input);
      setSuggestions(result.suggestions);
      if (result.suggestions.length > 0) {
        toast({
          title: 'Suggestions Ready!',
          description: 'Here are some ideas for your poem.',
        });
      } else {
        toast({
          title: 'No Suggestions Found',
          description: 'The AI could not find specific suggestions for this poem fragment. Try refining your poem or topic.',
        });
      }
    } catch (error) {
      console.error('Error suggesting words:', error);
      toast({
        title: 'Suggestion Failed',
        description: 'Could not fetch suggestions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleExportPoem = () => {
    if (!poem) {
      toast({
        title: 'Nothing to export',
        description: 'Please generate or write a poem first.',
        variant: 'destructive',
      });
      return;
    }
    const blob = new Blob([poem], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const filename = topic ? `${topic.toLowerCase().replace(/\s+/g, '_')}_poem.txt` : 'rhyme_sage_poem.txt';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast({
      title: 'Poem Exported!',
      description: `Your poem has been downloaded as ${filename}.`,
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center space-x-3">
          <LogoIcon className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Rhyme Sage</h1>
        </div>
        <p className="text-muted-foreground mt-2 text-lg">Your AI companion for poetic inspiration.</p>
      </header>

      <main className="w-full max-w-2xl space-y-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center"><Zap className="mr-2 h-6 w-6 text-primary" />Create Your Poem</CardTitle>
            <CardDescription>Tell us about the poem you want to create.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="topic" className="text-base">Topic</Label>
              <Input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Autumn Rain, Distant Stars"
                className="mt-1 text-base"
              />
            </div>
            <div>
              <Label htmlFor="style" className="text-base">Style</Label>
              <Input
                id="style"
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="e.g., Haiku, Shakespearean, Free Verse"
                className="mt-1 text-base"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleGeneratePoem} disabled={isGeneratingPoem} className="w-full text-lg py-6">
              {isGeneratingPoem ? <Spinner className="mr-2 h-5 w-5" /> : <Zap className="mr-2 h-5 w-5" />}
              Generate Poem
            </Button>
          </CardFooter>
        </Card>

        {poemVisible && (
          <Card className="shadow-xl animate-fade-in-subtle">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Your Masterpiece</CardTitle>
              <CardDescription>Edit, refine, and get suggestions for your poem.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={poem}
                onChange={(e) => setPoem(e.target.value)}
                placeholder="Your poem will appear here..."
                rows={12}
                className="w-full p-4 rounded-md shadow-inner bg-background/50 text-base"
              />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
              <Button onClick={handleSuggestWords} disabled={isSuggesting || !poem} variant="outline" className="w-full sm:w-auto">
                {isSuggesting ? <Spinner className="mr-2 h-4 w-4" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                Suggest Words/Phrases
              </Button>
              <Button onClick={handleExportPoem} disabled={!poem} variant="secondary" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export Poem (.txt)
              </Button>
            </CardFooter>
          </Card>
        )}

        {suggestionsVisible && suggestions.length > 0 && (
          <Card className="shadow-xl animate-fade-in-subtle">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center"><Lightbulb className="mr-2 h-6 w-6 text-primary" />Suggestions</CardTitle>
              <CardDescription>Words and phrases to inspire your writing.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2 p-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground" onClick={() => {
                    navigator.clipboard.writeText(suggestion);
                    toast({title: "Copied!", description: `"${suggestion}" copied to clipboard.`});
                  }}>
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
       <footer className="mt-12 text-center text-muted-foreground text-sm">
        <Separator className="my-4" />
        <p>&copy; {new Date().getFullYear()} Rhyme Sage. Weave words with wisdom.</p>
      </footer>
    </div>
  );
}
