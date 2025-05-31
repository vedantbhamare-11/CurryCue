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
  return <div className="bg-card border border-border rounded-xl overflow-hidden shadow-md flex flex-col" data-unique-id="999c4f5e-ab34-46fe-b224-8e1bea625506" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="p-3 border-b border-border flex justify-between items-center bg-muted/30" data-unique-id="4e0529c5-2584-4145-95cb-75a4653c13ff" data-file-name="components/cooking-assistant.tsx">
        <div className="flex items-center gap-2" data-unique-id="c2caa1d8-5130-445c-a6fa-8160f30a800b" data-file-name="components/cooking-assistant.tsx">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-sm" data-unique-id="2f3f8441-f154-47b4-8e19-e2548787c97c" data-file-name="components/cooking-assistant.tsx"><span className="editable-text" data-unique-id="ddaab06c-66df-4746-a64a-4881bd5f5fa9" data-file-name="components/cooking-assistant.tsx">Cooking Assistant</span></h3>
        </div>
        <div className="flex items-center gap-2" data-unique-id="7abd08a5-3563-40bb-a9d4-876541b870c3" data-file-name="components/cooking-assistant.tsx">
          <button onClick={onPauseToggle} className={cn("p-1.5 rounded-full transition-colors", isPaused ? "bg-primary/20 text-primary" : "bg-muted hover:bg-muted/80")} aria-label={isPaused ? "Resume cooking" : "Pause cooking"} data-unique-id="4b810461-2e3a-4fac-9cc7-2ed0fc50634b" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true">
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 rounded-full hover:bg-muted transition-colors" aria-label={isExpanded ? "Collapse chat" : "Expand chat"} data-unique-id="213182e3-f7f9-459b-9aaf-5d2f9c0986c3" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="px-3 py-2 bg-muted/20 border-b border-border" data-unique-id="cfa49689-7b6b-421b-8ef7-c1ca857b1d81" data-file-name="components/cooking-assistant.tsx">
        <div className="flex justify-between items-center mb-1 text-xs" data-unique-id="ebdd315d-077c-4f61-b3e0-0e5d71c4d48f" data-file-name="components/cooking-assistant.tsx">
          <span className="text-muted-foreground" data-unique-id="1c2c5f78-f7b4-4b1e-95cc-44d5113ac2ab" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c2af5874-27be-46d8-a2a9-6eb8177c162c" data-file-name="components/cooking-assistant.tsx">Step </span>{currentStep + 1}<span className="editable-text" data-unique-id="37c44e7b-069c-4288-8d55-7260887de3e3" data-file-name="components/cooking-assistant.tsx"> of </span>{recipe.steps.length}</span>
          <span className="font-medium" data-unique-id="08fbfa15-8491-4879-b53b-5f605b563bc4" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true">{Math.round((currentStep + 1) / recipe.steps.length * 100)}<span className="editable-text" data-unique-id="dbd25912-dfc4-473c-873f-6d59e5c4135e" data-file-name="components/cooking-assistant.tsx">% complete</span></span>
        </div>
        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden" data-unique-id="49496360-11e1-43d5-91ee-b127ccce5400" data-file-name="components/cooking-assistant.tsx">
          <motion.div className="h-full bg-primary" initial={{
          width: `${currentStep / recipe.steps.length * 100}%`
        }} animate={{
          width: `${(currentStep + 1) / recipe.steps.length * 100}%`
        }} transition={{
          duration: 0.3
        }} data-unique-id="1dc80b70-9c1e-4e2c-b755-f2de4f0d6879" data-file-name="components/cooking-assistant.tsx" />
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
      }} className="flex-1 overflow-hidden" data-unique-id="ae339677-755b-4305-a387-bddbb779abe9" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true">
            {/* Messages container */}
            <div className="h-[300px] overflow-y-auto p-3 space-y-3" data-unique-id="d7bc3df6-0d68-490c-b483-ea9a9ff8f790" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true">
              {messages.map(message => <div key={message.id} className={cn("flex gap-2 max-w-[85%] animate-in fade-in-50", message.role === 'user' ? "ml-auto" : "mr-auto", message.role === 'system' && "w-full max-w-full")} data-unique-id="23013407-2044-4b0e-8023-fe1c8ab407ca" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true">
                  {message.role !== 'user' && <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center" data-unique-id="2415d1f7-2d4b-4ede-b9be-eb943e9c9aa7" data-file-name="components/cooking-assistant.tsx">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>}
                  
                  <div className={cn("rounded-lg p-2.5 text-sm", message.role === 'user' ? "bg-primary text-primary-foreground" : message.role === 'system' ? "bg-muted/50 text-muted-foreground w-full" : "bg-muted")} data-unique-id="32fbea9b-9d81-4300-a858-6834a89f1278" data-file-name="components/cooking-assistant.tsx" data-dynamic-text="true">
                    {message.content}
                  </div>
                  
                  {message.role === 'user' && <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center" data-unique-id="a566c458-8c58-4ea6-8f6c-ca321d734c54" data-file-name="components/cooking-assistant.tsx">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>}
                </div>)}
              
              {isLoading && <div className="flex gap-2 max-w-[85%] mr-auto" data-unique-id="d7d9e044-303a-43c4-87ff-ba30ceadafaf" data-file-name="components/cooking-assistant.tsx">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center" data-unique-id="3e2cb032-8e26-4aef-8a1e-f16306551b28" data-file-name="components/cooking-assistant.tsx">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg p-3" data-unique-id="c2f44494-c07f-4b04-af39-1be89ef4dc16" data-file-name="components/cooking-assistant.tsx">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                </div>}
              
              <div ref={messagesEndRef} data-unique-id="dfcbd8c5-5dbf-46d7-a60f-0ffda58d9819" data-file-name="components/cooking-assistant.tsx" />
            </div>
            
            {/* Step navigation */}
            <div className="flex justify-between p-2 border-t border-border bg-muted/20" data-unique-id="af726b84-e021-47c5-89d1-402a23854568" data-file-name="components/cooking-assistant.tsx">
              <button onClick={handlePreviousStep} disabled={currentStep === 0} className={cn("px-3 py-1 text-xs rounded-md transition-colors", currentStep === 0 ? "opacity-50 cursor-not-allowed text-muted-foreground" : "hover:bg-muted")} data-unique-id="5cc55e09-5f1e-4c62-a715-a8517f2f1fdf" data-file-name="components/cooking-assistant.tsx"><span className="editable-text" data-unique-id="d5640e97-3714-4e31-85fa-c87a55a18162" data-file-name="components/cooking-assistant.tsx">
                Previous Step
              </span></button>
              <button onClick={handleNextStep} disabled={currentStep === recipe.steps.length - 1} className={cn("px-3 py-1 text-xs rounded-md transition-colors", currentStep === recipe.steps.length - 1 ? "opacity-50 cursor-not-allowed text-muted-foreground" : "bg-primary/10 text-primary hover:bg-primary/20")} data-unique-id="3f88607a-a1bb-418a-8a2f-2c30efad2201" data-file-name="components/cooking-assistant.tsx"><span className="editable-text" data-unique-id="6b6d5569-1f72-4c9f-8eb7-cccaa27cb8c3" data-file-name="components/cooking-assistant.tsx">
                Next Step
              </span></button>
            </div>
            
            {/* Input area */}
            <div className="p-3 border-t border-border flex gap-2" data-unique-id="399b25d5-a85f-4f85-95f2-98f440cc9e7e" data-file-name="components/cooking-assistant.tsx">
              <input ref={inputRef} type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about this step..." className="flex-1 px-3 py-2 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20 text-sm" disabled={isLoading} data-unique-id="52e4c802-c4ce-4bb0-aa54-1581cf14c5f3" data-file-name="components/cooking-assistant.tsx" />
              <button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} className={cn("p-2 rounded-lg transition-colors", !inputValue.trim() || isLoading ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90")} data-unique-id="999cf8a1-4930-4b07-8ce1-12fcf9e6aed2" data-file-name="components/cooking-assistant.tsx">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}