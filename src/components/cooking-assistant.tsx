"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Pause, Play, ChevronDown, ChevronUp, Bot, User, Loader2 } from 'lucide-react';
import { generateText } from '@/lib/api/util';
import { Recipe } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
}
interface CookingAssistantProps {
  recipe: Recipe;
  currentStep: number;
  onStepChange: (step: number) => void;
  isPaused: boolean;
  onPauseToggle: () => void;
}
export function CookingAssistant({
  recipe,
  currentStep,
  onStepChange,
  isPaused,
  onPauseToggle
}: CookingAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with system message and first step
  useEffect(() => {
    const initialMessages: Message[] = [{
      id: 'system-1',
      content: `I'm your cooking assistant for "${recipe.title}". I'll guide you through each step. Ask me anything about the recipe!`,
      role: 'system',
      timestamp: Date.now()
    }, {
      id: `step-${currentStep}`,
      content: `Step ${currentStep + 1}: ${recipe.steps[currentStep]}`,
      role: 'assistant',
      timestamp: Date.now()
    }];
    setMessages(initialMessages);
  }, []);

  // Update when step changes
  useEffect(() => {
    if (messages.length > 0) {
      const stepMessage: Message = {
        id: `step-${currentStep}`,
        content: `Step ${currentStep + 1}: ${recipe.steps[currentStep]}`,
        role: 'assistant',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, stepMessage]);
    }
  }, [currentStep]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      role: 'user',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    try {
      // Create context for the AI
      const context = `
        You are a helpful cooking assistant guiding the user through a recipe for "${recipe.title}".
        Current step (${currentStep + 1} of ${recipe.steps.length}): "${recipe.steps[currentStep]}"
        
        Recipe ingredients:
        ${recipe.ingredients.map(ing => `- ${ing.name} ${ing.quantity ? `(${ing.quantity} ${ing.unit || ''})` : ''}`).join('\n')}
        
        All recipe steps:
        ${recipe.steps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}
        
        Answer the user's question about the recipe. Be concise but helpful. If they ask about a different step, you can reference it.
        If they want to move to the next or previous step, suggest they use the navigation controls.
        If they ask about ingredients, provide details from the recipe.
      `;
      const userQuery = inputValue;
      const prompt = `${context}\n\nUser question: ${userQuery}\n\nYour response:`;
      const response = await generateText(prompt, "azure-gpt-4o");
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: response.text,
        role: 'assistant',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleNextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      toast.success("You've completed all steps!");
    }
  };
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };
  return <div className="bg-card border border-border rounded-xl overflow-hidden shadow-md flex flex-col" data-unique-id="a5650078-cd65-4d88-a6ad-1e5454c3c8d6" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="p-3 border-b border-border flex justify-between items-center bg-muted/30" data-unique-id="9a59dfda-2ba4-4a80-9e18-85da5f517645" data-file-name="components/cooking-assistant.tsx">
        <div className="flex items-center gap-2" data-unique-id="f8510fd8-bf43-4875-95e3-9ccfe16270a2" data-file-name="components/cooking-assistant.tsx">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-sm" data-unique-id="b39eee0b-c4b4-45d3-9192-b2be8a508ebe" data-file-name="components/cooking-assistant.tsx"><span className="editable-text" data-unique-id="a6bf4c9f-c7e6-486f-ae74-9e18ba2dd83e" data-file-name="components/cooking-assistant.tsx">Cooking Assistant</span></h3>
        </div>
        <div className="flex items-center gap-2" data-unique-id="493b1aee-a627-43b9-9980-6277d7bd59da" data-file-name="components/cooking-assistant.tsx">
          <button onClick={onPauseToggle} className={cn("p-1.5 rounded-full transition-colors", isPaused ? "bg-primary/20 text-primary" : "bg-muted hover:bg-muted/80")} aria-label={isPaused ? "Resume cooking" : "Pause cooking"} data-unique-id="7ac8a9ac-e69b-401e-a8dd-1eacedc92a03" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true">
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 rounded-full hover:bg-muted transition-colors" aria-label={isExpanded ? "Collapse chat" : "Expand chat"} data-unique-id="5b770ceb-2cea-4d3d-9a96-71f8d9cbf22f" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="px-3 py-2 bg-muted/20 border-b border-border" data-unique-id="791265ab-f400-4352-b6a9-2514a0c7bc5c" data-file-name="components/cooking-assistant.tsx">
        <div className="flex justify-between items-center mb-1 text-xs" data-unique-id="0d2d1ada-031f-42f1-a481-8dc2d87e53c3" data-file-name="components/cooking-assistant.tsx">
          <span className="text-muted-foreground" data-unique-id="96f65bfe-6922-4d8c-bbdf-4d4c77222d51" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="7e680670-b774-4a0b-b464-7b6288ca83f8" data-file-name="components/cooking-assistant.tsx">Step </span>{currentStep + 1}<span className="editable-text" data-unique-id="4d1e680a-49b6-4c23-a9d9-04df1152f9c4" data-file-name="components/cooking-assistant.tsx"> of </span>{recipe.steps.length}</span>
          <span className="font-medium" data-unique-id="0eeeb88b-582f-4828-8dfb-cbdaa71939a3" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true">{Math.round((currentStep + 1) / recipe.steps.length * 100)}<span className="editable-text" data-unique-id="c8eff67e-97d6-42aa-a1c9-4e2dba9365a9" data-file-name="components/cooking-assistant.tsx">% complete</span></span>
        </div>
        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden" data-unique-id="aad19a1d-5aeb-423c-913a-5874ba2cfab3" data-file-name="components/cooking-assistant.tsx">
          <motion.div className="h-full bg-primary" initial={{
          width: `${currentStep / recipe.steps.length * 100}%`
        }} animate={{
          width: `${(currentStep + 1) / recipe.steps.length * 100}%`
        }} transition={{
          duration: 0.3
        }} data-unique-id="458b68aa-b04e-41cb-ac84-725dc7de4c36" data-file-name="components/cooking-assistant.tsx" />
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && <motion.div initial={{
        height: 0,
        opacity: 0
      }} animate={{
        height: 'auto',
        opacity: 1
      }} exit={{
        height: 0,
        opacity: 0
      }} className="flex-1 overflow-hidden" data-unique-id="d20e5a53-1db0-4596-b563-23591c9590dd" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true">
            {/* Messages container */}
            <div className="h-[300px] overflow-y-auto p-3 space-y-3" data-unique-id="3d67c27d-f0cd-41c2-abdc-a3cf83af0cb5" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true">
              {messages.map(message => <div key={message.id} className={cn("flex gap-2 max-w-[85%] animate-in fade-in-50", message.role === 'user' ? "ml-auto" : "mr-auto", message.role === 'system' && "w-full max-w-full")} data-unique-id="41669eb1-d634-46ad-93cd-562e3bac7570" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true">
                  {message.role !== 'user' && <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center" data-unique-id="2c4c03c5-7e29-495b-a4ee-5d3be518d88d" data-file-name="components/cooking-assistant.tsx">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>}
                  
                  <div className={cn("rounded-lg p-2.5 text-sm", message.role === 'user' ? "bg-primary text-primary-foreground" : message.role === 'system' ? "bg-muted/50 text-muted-foreground w-full" : "bg-muted")} data-unique-id="f4672e8d-25c6-4fdd-8b8d-a755bb9e833d" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true">
                    {message.content}
                  </div>
                  
                  {message.role === 'user' && <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center" data-unique-id="28ae4c1b-d159-4ec6-9b2b-f7fafea2bb39" data-file-name="components/cooking-assistant.tsx">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>}
                </div>)}
              
              {isLoading && <div className="flex gap-2 max-w-[85%] mr-auto" data-unique-id="27193155-3aa1-4cb1-8b41-0268733a90ca" data-file-name="components/cooking-assistant.tsx">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center" data-unique-id="c8c46eb2-ecef-4344-a24d-b69636aa279e" data-file-name="components/cooking-assistant.tsx">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg p-3" data-unique-id="84055d3a-b11b-4497-8499-79523fcc9b3e" data-file-name="components/cooking-assistant.tsx">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                </div>}
              
              <div ref={messagesEndRef} data-unique-id="605d7e1f-aef2-47dc-b761-4ba07dee1018" data-file-name="components/cooking-assistant.tsx" />
            </div>
            
            {/* Step navigation */}
            <div className="flex justify-between p-2 border-t border-border bg-muted/20" data-unique-id="b5aa93d4-810e-47bf-af87-24c56f39d7a5" data-file-name="components/cooking-assistant.tsx">
              <button onClick={handlePreviousStep}  className={cn("px-3 py-1 text-xs rounded-md transition-colors", currentStep === 0 ? "bg-muted" : "hover:bg-muted")} data-unique-id="38a8eff4-f44d-4d3f-aa14-3ecf8abe4991" data-file-name="components/cooking-assistant.tsx"><span className="editable-text" data-unique-id="4e099085-5652-4991-8b5a-06077ae65474" data-file-name="components/cooking-assistant.tsx">
                Previous Step
              </span></button>
              <button onClick={handleNextStep}  className={cn("px-3 py-1 text-xs rounded-md transition-colors", currentStep === recipe.steps.length - 1 ? "bg-muted" : "bg-primary/10 text-primary hover:bg-primary/20")} data-unique-id="8e788359-2036-409c-a498-8d045e3e437a" data-file-name="components/cooking-assistant.tsx"><span className="editable-text" data-unique-id="fdb6d12e-944a-432f-9c5d-7dd984cd7d8a" data-file-name="components/cooking-assistant.tsx">
                Next Step
              </span></button>
            </div>
            
            {/* Input area */}
            <div className="p-3 border-t border-border flex gap-2" data-unique-id="da893e05-5ae6-4ba7-a7c4-7043f08c1e7e" data-file-name="components/cooking-assistant.tsx">
              <input ref={inputRef} type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about this step..." className="flex-1 px-3 py-2 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20 text-sm"  data-unique-id="86a1873b-db54-4a2b-b6e6-e6c0f46c56d0" data-file-name="components/cooking-assistant.tsx" />
              <button onClick={handleSendMessage} className={cn("p-2 rounded-lg transition-colors", !inputValue.trim() || isLoading ? "bg-muted" : "bg-primary text-primary-foreground hover:bg-primary/90")} data-unique-id="c357dd97-8572-40e6-af9a-994c9c3bd407" data-file-name="components/cooking-assistant.tsx">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}