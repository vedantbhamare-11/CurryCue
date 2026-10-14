"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Pause, Play, ChevronDown, ChevronUp, Bot, User, Loader2 } from 'lucide-react';
import { generateText } from '@/lib/api/util';
import { Recipe } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ChatMarkdown } from './chat-markdown';
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  // 'step' = the "Step N: ..." announcements; only 'chat' turns are sent back to the model as history
  kind: 'intro' | 'step' | 'chat';
  timestamp: number;
}

// How many previous chat turns to include so follow-up questions have context
const HISTORY_TURNS = 6;
const MAX_HISTORY_CHARS = 600;
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Unique, monotonically increasing ids. Step messages used `step-${n}`, which repeated whenever
  // the user revisited a step and produced duplicate React keys.
  const nextId = useRef(0);
  const makeId = (prefix: string) => `${prefix}-${nextId.current++}`;

  // Initialize with system message and first step
  useEffect(() => {
    const initialMessages: Message[] = [{
      id: makeId('intro'),
      content: `I'm your cooking assistant for "${recipe.title}". I'll guide you through each step. Ask me anything about the recipe!`,
      role: 'system',
      kind: 'intro',
      timestamp: Date.now()
    }, {
      id: makeId('step'),
      content: `Step ${currentStep + 1}: ${recipe.steps[currentStep]}`,
      role: 'assistant',
      kind: 'step',
      timestamp: Date.now()
    }];
    setMessages(initialMessages);
  }, []);

  // Update when step changes
  useEffect(() => {
    if (messages.length > 0) {
      const stepMessage: Message = {
        id: makeId('step'),
        content: `Step ${currentStep + 1}: ${recipe.steps[currentStep]}`,
        role: 'assistant',
        kind: 'step',
        timestamp: Date.now()
      };
      // Replace the previous step announcement: replaying every step turned the chat into a second copy of the recipe
      setMessages(prev => [...prev.filter(message => message.kind !== 'step'), stepMessage]);
    }
  }, [currentStep]);

  // Auto-scroll the chat list to the bottom. scrollIntoView() would scroll every ancestor too, so
  // each new message or step change yanked the whole page around.
  useEffect(() => {
    const list = messagesContainerRef.current;
    list?.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage: Message = {
      id: makeId('user'),
      content: inputValue,
      role: 'user',
      kind: 'chat',
      timestamp: Date.now()
    };
    // Earlier chat turns (not step announcements), so "and what about the second one?" works
    const history = messages
      .filter(message => message.kind === 'chat')
      .slice(-HISTORY_TURNS)
      .map(message => `${message.role === 'user' ? 'User' : 'Assistant'}: ${message.content.slice(0, MAX_HISTORY_CHARS)}`)
      .join('\n');
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
      const prompt = `${context}\n\n${history ? `Conversation so far:\n${history}\n\n` : ''}User question: ${userQuery}\n\nYour response:`;
      const response = await generateText(prompt);
      const assistantMessage: Message = {
        id: makeId('assistant'),
        content: response.text,
        role: 'assistant',
        kind: 'chat',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const message = error instanceof Error ? error.message : '';
      toast.error(/rate limit/i.test(message) ? message : 'Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
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
  return <div className="bg-card border border-border rounded-xl overflow-hidden shadow-md flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border flex justify-between items-center bg-muted/30">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-sm">Cooking Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onPauseToggle} className={cn("p-1.5 rounded-full transition-colors", isPaused ? "bg-primary/20 text-primary" : "bg-muted hover:bg-muted/80")} aria-label={isPaused ? "Resume cooking" : "Pause cooking"}>
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 rounded-full hover:bg-muted transition-colors" aria-label={isExpanded ? "Collapse chat" : "Expand chat"}>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="px-3 py-2 bg-muted/20 border-b border-border">
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="text-muted-foreground">Step {currentStep + 1} of {recipe.steps.length}</span>
          <span className="font-medium">{Math.round((currentStep + 1) / recipe.steps.length * 100)}% complete</span>
        </div>
        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary" initial={{
          width: `${currentStep / recipe.steps.length * 100}%`
        }} animate={{
          width: `${(currentStep + 1) / recipe.steps.length * 100}%`
        }} transition={{
          duration: 0.3
        }} />
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
      }} className="flex-1 overflow-hidden">
            {/* Messages container */}
            <div ref={messagesContainerRef} className="h-[300px] overflow-y-auto p-3 space-y-3">
              {messages.map(message => <div key={message.id} className={cn("flex gap-2 max-w-[85%]", message.role === 'user' ? "ml-auto" : "mr-auto", message.role === 'system' && "w-full max-w-full")}>
                  {message.role !== 'user' && <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>}
                  
                  <div className={cn("rounded-lg p-2.5 text-sm min-w-0", message.role === 'user' ? "bg-primary text-primary-foreground" : message.role === 'system' ? "bg-muted/50 text-muted-foreground w-full" : "bg-muted")}>
                    {message.role === 'user' ? <span className="whitespace-pre-wrap break-words">{message.content}</span> : <ChatMarkdown text={message.content} />}
                  </div>
                  
                  {message.role === 'user' && <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>}
                </div>)}
              
              {isLoading && <div className="flex gap-2 max-w-[85%] mr-auto">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                </div>}
            </div>
            
            {/* Step navigation */}
            <div className="flex justify-between p-2 border-t border-border bg-muted/20">
              <button onClick={handlePreviousStep}  className={cn("px-3 py-1 text-xs rounded-md transition-colors", currentStep === 0 ? "bg-muted" : "hover:bg-muted")}>
                Previous Step
              </button>
              <button onClick={handleNextStep}  className={cn("px-3 py-1 text-xs rounded-md transition-colors", currentStep === recipe.steps.length - 1 ? "bg-muted" : "bg-primary/10 text-primary hover:bg-primary/20")}>
                Next Step
              </button>
            </div>
            
            {/* Input area */}
            <div className="p-3 border-t border-border flex gap-2">
              <input ref={inputRef} type="text" aria-label="Ask the cooking assistant" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about this step..." className="flex-1 px-3 py-2 rounded-lg bg-input-background dark:bg-input border border-border outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              <button onClick={handleSendMessage} aria-label="Send message" className={cn("p-2 rounded-lg transition-colors", !inputValue.trim() || isLoading ? "bg-muted" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
}