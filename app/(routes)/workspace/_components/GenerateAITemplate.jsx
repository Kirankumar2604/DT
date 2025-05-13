import React, { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { LayoutGrid, X, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "../../../../@/components/ui/dialog"
import { Input } from '../../../../@/components/ui/input';
import { chatSession } from '../../../../config/GoogleAIModel';
import { toast } from 'sonner';

function GenerateAITemplate({ setGeneratedTemplate }) {
    const [open, setOpen] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);

    const GenerateFromAI = async () => {
        if (!userInput) return;
        
        setLoading(true);
        try {
            const PROMPT = `You are a smart assistant. Given the following user input:

"${userInput}"

Your task is to:
1. Analyze the input and understand its intent and context.
2. Choose the best way to represent the information: 
   - If the input is a list or involves categorization, return it as a clean, structured, categorized list with item names and quantities.
   - If the input is descriptive, respond with a structured summary or breakdown.
   - If the input is more complex (e.g., contains steps, instructions, goals), generate a detailed, organized output using bullet points, subheadings, or a step-by-step format.
3. Use common sense and fill in any gaps logically.
4. Be adaptive: do not force a fixed format. Format your response based on what makes the most sense for the input.
5. Keep your response concise, clear, and easy to understand.
6. Do not include explanations about what you're doing — only return the final formatted output.

Now process the input accordingly.`;

            
            const result = await chatSession.sendMessage(PROMPT);
            const content = result.response.text();
            console.log('AI Response:', content);
            
            // Split the content into categories and items
            const categories = content.split('\n\n').filter(cat => cat.trim());
            
            // Create blocks for each category and its items
            const blocks = categories.map(category => {
                const [categoryTitle, ...items] = category.split('\n');
                return [
                      // Category header
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        type: "header",
                        data: {
                            text: categoryTitle.replace(':', '').trim(),
                            level: 3
                        }
                    },
                    // Items list
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        type: "list",
                        data: {
                            style: "unordered",
                            items: items.map(item => item.replace('-', '').trim())
                        }
                    }
                ];
            }).flat();
            
            // Create a valid editor.js template structure
            const template = {
                time: Date.now(),
                blocks: [
                    // Title
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        type: "header",
                        data: {
                            text: userInput,
                            level: 2
                        }
                    },
                    // Content blocks
                    ...blocks
                ],
                version: "2.8.1"
            };
            
            console.log('Generated Template:', template);
            setGeneratedTemplate(template);
            setOpen(false);
            toast.success('Template generated successfully');
            
        } catch (error) {
            console.error('Error generating template:', error);
            toast.error('Failed to generate template');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className='flex items-center gap-2'>
                    <LayoutGrid className='w-4 h-4' /> Generate AI Template
                </Button>
            </DialogTrigger>
            <DialogContent className="!w-[90vw] lg:!w-[500px] !max-w-none !translate-x-[-50%] !translate-y-[-50%] !top-[50%] !left-[50%] !fixed !z-50 !bg-white !text-black !border-border !shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-left">Generate AI Template</DialogTitle>
                </DialogHeader>
                <div className="mt-4 flex flex-col gap-4">
                    <p className="text-base font-medium">What do you want to generate?</p>
                    <Input type="text" placeholder="Enter your prompt" 
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end items-center">
                        <Button variant="gost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button variant="" 
                        disabled={!userInput||loading}
                        onClick={GenerateFromAI}>
                            {loading?<Loader2 className='w-4 h-4 animate-spin' />:"Generate"}
                        </Button>
                    </div>
                </div>
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}

export default GenerateAITemplate;