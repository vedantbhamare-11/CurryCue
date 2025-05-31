export class AIServiceError extends Error {
  statusCode: number;
  provider: string;
  
  constructor(message: string, statusCode: number, provider: string) {
    super(message);
    this.name = 'AIServiceError';
    this.statusCode = statusCode;
    this.provider = provider;
  }
}

export type TextGenerationResult = {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: 'stop' | 'length' | 'content_filter';
};

// Vision-enabled Text Types
export type ContentItem = 
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: ContentItem[];
};

// We reuse TextGenerationResult since the output format is the same


// Stability AI Types
export interface StabilityProxyRequest {
  prompt: string;
}

export interface StabilityProxyResponse {
  data: {
    url: string;
  };
}

export class StabilityProxyError extends Error {
  statusCode: number;
  responseBody?: any;

  constructor(message: string, statusCode: number, responseBody?: any) {
    super(message);
    this.name = 'StabilityProxyError';
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}

// ElevenLabs TTS Types
// Available voices:
// - Aria: American expressive
// - Roger: American confident
// - Charlotte: Swedish seductive
// - Will: American friendly
// - Lily: British warm
// - Bill: American trustworthy
export interface ElevenLabsProxyRequest {
  prompt: string;
  voiceName?: string;
}

export interface ElevenLabsProxyResponse {
  data: {
    url: string;
  };
}

export class ElevenLabsProxyError extends Error {
  statusCode: number;
  responseBody?: any;

  constructor(message: string, statusCode: number, responseBody?: any) {
    super(message);
    this.name = 'ElevenLabsProxyError';
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}

const CONFIG: {
    webId: string;
    availableProviders: {
      text: string[];
    visionEnabled: string[];
    stability: string[];
    elevenlabsTTS: string[];
    };
  } = {
    webId: "683aa0ebdfca2f001353be48",
    availableProviders: {
  "text": [
    "claude-bedrock",
    "azure-gpt-4o",
    "azure-gpt-4o-o3-mini"
  ],
  "visionEnabled": [
    "claude-bedrock",
    "azure-gpt-4o"
  ],
  "stability": [
    "stability-ai"
  ],
  "elevenlabsTTS": [
    "elevenlabs-tts"
  ]
}
  };

const API_KEYS = {};

// ===== TEXT GENERATION MODULE =====
export interface TextProviderImplementation {
  generate(prompt: string): Promise<TextGenerationResult>;
  generateStream(prompt: string, onChunk: (text: string) => void): Promise<TextGenerationResult>;
}

export interface VisionTextProviderImplementation extends TextProviderImplementation {
  generateWithImages(prompt: string, imageUrls: string[]): Promise<TextGenerationResult>;
  generateWithImagesStream(prompt: string, imageUrls: string[], onChunk: (text: string) => void): Promise<TextGenerationResult>;
}

/**
 * Generate text using a specific provider
 * @param prompt - The prompt to generate text from
 * @param provider - The provider to use
 * @returns A promise that resolves to the generated text
 */
export async function generateText(
  prompt: string,
  provider: string
): Promise<TextGenerationResult> {
  if (!prompt) throw new Error('Prompt is required');
  if (!provider) throw new Error('Provider is required');
  
  if (!CONFIG.availableProviders.text.includes(provider)) {
    throw new Error(`Provider ${provider} is not available`);
  }
  
  try {
    return await textProviderImplementations[provider].generate(prompt);
  } catch (error) {
    if (error instanceof AIServiceError) {
      throw error;
    } else {
      throw new AIServiceError(
        `Error generating text: ${error instanceof Error ? error.message : String(error)}`,
        500,
        provider
      );
    }
  }
}


/**
 * Generate text using a specific provider and stream the results
 * @param prompt - The prompt to generate text from
 * @param onChunk - A callback function that receives a chunk of text, can be used to update a UI or display the text in real-time
 * @param provider - The provider to use
 * @returns A promise that resolves to the generated text
 */
export async function generateTextStream(
  prompt: string,
  onChunk: (text: string) => void,
  provider: string
): Promise<TextGenerationResult> {
  if (!prompt) throw new Error('Prompt is required');
  if (!onChunk) throw new Error('onChunk callback is required');
  if (!provider) throw new Error('Provider is required');
  
  if (!CONFIG.availableProviders.text.includes(provider)) {
    throw new Error(`Provider ${provider} is not available`);
  }
  
  try {
    return await textProviderImplementations[provider].generateStream(prompt, onChunk);
  } catch (error) {
    if (error instanceof AIServiceError) {
      throw error;
    } else {
      throw new AIServiceError(
        `Error streaming text: ${error instanceof Error ? error.message : String(error)}`,
        500,
        provider
      );
    }
  }
}

/**
 * Get all available text providers
 * @returns An array of all available text providers
 */
export function getTextProviders(): string[] {
  return CONFIG.availableProviders.text;
}

/**
 * Get all available vision-enabled providers
 * @returns An array of all available vision-enabled providers
 */
export function getVisionEnabledProviders(): string[] {
  return CONFIG.availableProviders.visionEnabled;
}

/**
 * Generate text using a specific provider and provide images
 * @param prompt - The prompt to generate text from
 * @param imageUrls - An array of image URLs
 * @param provider - The provider to use
 * @returns A promise that resolves to the generated text
 */
export async function generateTextWithImages(
  prompt: string, 
  imageUrls: string[],
  provider: string
): Promise<TextGenerationResult> {
  if (!prompt) throw new Error('Prompt is required');
  if (!imageUrls || !Array.isArray(imageUrls)) throw new Error('Image URLs must be an array');
  if (!provider) throw new Error('Provider is required');
  
  if (!CONFIG.availableProviders.visionEnabled.includes(provider)) {
    throw new Error(`Provider ${provider} does not support image inputs`);
  }
  
  try {
    const implementation = textProviderImplementations[provider] as VisionTextProviderImplementation;
    return await implementation.generateWithImages(prompt, imageUrls);
  } catch (error) {
    if (error instanceof AIServiceError) {
      throw error;
    } else {
      throw new AIServiceError(
        `Error generating text with images: ${error instanceof Error ? error.message : String(error)}`,
        500,
        provider
      );
    }
  }
}

/**
 * Generate text using a specific provider and provide images and stream the results
 * @param prompt - The prompt to generate text from
 * @param imageUrls - An array of image URLs
 * @param onChunk - A callback function that receives a chunk of text, can be used to update a UI or display the text in real-time
 * @param provider - The provider to use
 * @returns A promise that resolves to the generated text
 */
export async function generateTextWithImagesStream(
  prompt: string,
  imageUrls: string[],
  onChunk: (text: string) => void,
  provider: string
): Promise<TextGenerationResult> {
  if (!prompt) throw new Error('Prompt is required');
  if (!imageUrls || !Array.isArray(imageUrls)) throw new Error('Image URLs must be an array');
  if (!onChunk) throw new Error('onChunk callback is required');
  if (!provider) throw new Error('Provider is required');
  
  if (!CONFIG.availableProviders.visionEnabled.includes(provider)) {
    throw new Error(`Provider ${provider} does not support image inputs`);
  }
  
  try {
    const implementation = textProviderImplementations[provider] as VisionTextProviderImplementation;
    return await implementation.generateWithImagesStream(prompt, imageUrls, onChunk);
  } catch (error) {
    if (error instanceof AIServiceError) {
      throw error;
    } else {
      throw new AIServiceError(
        `Error streaming text with images: ${error instanceof Error ? error.message : String(error)}`,
        500,
        provider
      );
    }
  }
}

// Shared implementation for all LiteLLM text providers
/**
 * Generate text using a specific provider
 * @param prompt - The prompt to generate text from
 * @param integrationId - The integration ID to use
 * @param model - The model to use
 * @returns A promise that resolves to the generated text
 */
async function proxyGenerate(prompt: string, integrationId: string, model: string): Promise<TextGenerationResult> {
  const requestBody = {
    webId: CONFIG.webId,
    integrationId,
    prompt,
    stream: false,
    model
  };
  
  try {
    const response = await fetch('https://proxy.getcreatr.com/v1/proxy/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      throw new AIServiceError(
        `Proxy error: ${response.status} ${response.statusText}`,
        response.status,
        model
      );
    }
    
    const data = await response.json();
    console.log(data);
    
    return {
      text: data.data.choices[0].message.content,
      usage: {
        promptTokens: data.data.usage.prompt_tokens,
        completionTokens: data.data.usage.completion_tokens,
        totalTokens: data.data.usage.total_tokens
      },
      finishReason: data.data.choices[0].finish_reason
    };
  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    throw new Error(`Failed to call proxy: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Generate text using a specific provider and stream the results
 * @param prompt - The prompt to generate text from
 * @param onChunk - A callback function that receives a chunk of text, can be used to update a UI or display the text in real-time
 * @param integrationId - The integration ID to use
 * @param model - The model to use
 * @returns A promise that resolves to the generated text
 */
async function proxyGenerateStream(prompt: string, onChunk: (text: string) => void, integrationId: string, model: string): Promise<TextGenerationResult> {
  const requestBody = {
    webId: CONFIG.webId,
    integrationId,
    prompt,
    stream: true,
    model
  };
  
  let fullText = '';
  let usage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  let finishReason;
  
  try {
    const response = await fetch('https://proxy.getcreatr.com/v1/proxy/llm/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      throw new AIServiceError(
        `Proxy streaming error: ${response.status} ${response.statusText}`,
        response.status,
        model
      );
    }
    
    if (!response.body) throw new Error('Response body is null or undefined');
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let isStreamActive = true;
    
    while (isStreamActive) {
      const { done, value } = await reader.read();
      
      if (done) {
        isStreamActive = false;
        continue;
      }
      
      buffer += decoder.decode(value, { stream: true });
      
      const events = buffer.split('\n\n');
      buffer = events.pop() || '';
      
      for (const event of events) {
        if (event.startsWith('data: ')) {
          const data = event.slice(6).trim();
          
          if (data === '[DONE]') {
            isStreamActive = false;
            continue;
          }
          
          try {
            const parsed = JSON.parse(data);
            
            const chunkContent = parsed.choices[0]?.delta?.content || '';
            if (chunkContent) {
              fullText += chunkContent;
              onChunk(chunkContent);
            }
            
            if (parsed.choices[0]?.finish_reason) {
              finishReason = parsed.choices[0].finish_reason;
            }

            // Update usage information from the final chunk
            if (parsed.usage) {
              usage = {
                promptTokens: parsed.usage.prompt_tokens,
                completionTokens: parsed.usage.completion_tokens,
                totalTokens: parsed.usage.total_tokens
              };
            }
          } catch (e) {
            console.error('Error parsing stream chunk:', e);
          }
        }
      }
    }
            
    return { text: fullText, usage, finishReason };
  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    throw new Error(`Failed to stream from proxy: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Shared implementation for vision-enabled text providers
/**
 * Generate text using a specific provider and provide images
 * @param prompt - The prompt to generate text from
 * @param imageUrls - An array of image URLs
 * @param integrationId - The integration ID to use
 * @param model - The model to use
 * @returns A promise that resolves to the generated text
 */
async function proxyGenerateWithImages(prompt: string, imageUrls: string[], integrationId: string, model: string): Promise<TextGenerationResult> {
  // Build content array with text and images for each message
  const content: ContentItem[] = [
    { type: 'text', text: prompt }
  ];
  
  // Add each image URL to the content array
  for (const url of imageUrls) {
    content.push({
      type: 'image_url',
      image_url: {
        url: url
      }
    });
  }
  
  // Create the request payload exactly matching the expected format
  const requestBody = {
    model,
    webId: CONFIG.webId,
    integrationId,
    messages: [
      {
        role: 'user',
        content
      }
    ],
    stream: false
  };
  
  try {
    const response = await fetch('https://proxy.getcreatr.com/v1/proxy/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      throw new AIServiceError(
        `Vision proxy error: ${response.status} ${response.statusText}`,
        response.status,
        model
      );
    }
    
    const data = await response.json();
    console.log(data);
    
    return {
      text: data.data.choices[0].message.content,
      usage: {
        promptTokens: data.data.usage.prompt_tokens,
        completionTokens: data.data.usage.completion_tokens,
        totalTokens: data.data.usage.total_tokens
      },
      finishReason: data.data.choices[0].finish_reason
    };
  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    throw new Error(`Failed to call vision proxy: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Generate text using a specific provider and provide images and stream the results
 * @param prompt - The prompt to generate text from
 * @param imageUrls - An array of image URLs
 * @param onChunk - A callback function that receives a chunk of text, can be used to update a UI or display the text in real-time
 * @param integrationId - The integration ID to use
 * @param model - The model to use
 * @returns A promise that resolves to the generated text
 */
async function proxyGenerateWithImagesStream(prompt: string, imageUrls: string[], onChunk: (text: string) => void, integrationId: string, model: string): Promise<TextGenerationResult> {
  // Build content array with text and images
  const content: ContentItem[] = [
    { type: 'text', text: prompt }
  ];
  
  // Add each image URL to the content array
  for (const url of imageUrls) {
    content.push({
      type: 'image_url',
      image_url: {
        url: url
      }
    });
  }
  
  // Create the request payload exactly matching the expected format
  const requestBody = {
    model,
    webId: CONFIG.webId,
    integrationId,
    messages: [
      {
        role: 'user',
        content
      }
    ],
    stream: true
  };
  
  let fullText = '';
  let usage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  let finishReason;
  
  try {
    const response = await fetch('https://proxy.getcreatr.com/v1/proxy/llm/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      throw new AIServiceError(
        `Vision proxy streaming error: ${response.status} ${response.statusText}`,
        response.status,
        model
      );
    }
    
    if (!response.body) throw new Error('Response body is null or undefined');
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let isStreamActive = true;
    
    while (isStreamActive) {
      const { done, value } = await reader.read();
      
      if (done) {
        isStreamActive = false;
        continue;
      }
      
      buffer += decoder.decode(value, { stream: true });
      
      const events = buffer.split('\n\n');
      buffer = events.pop() || '';
      
      for (const event of events) {
        if (event.startsWith('data: ')) {
          const data = event.slice(6).trim();
          
          if (data === '[DONE]') {
            isStreamActive = false;
            continue;
          }
          
          try {
            const parsed = JSON.parse(data);
            
            const chunkContent = parsed.choices[0]?.delta?.content || '';
            if (chunkContent) {
              fullText += chunkContent;
              onChunk(chunkContent);
            }
            
            if (parsed.choices[0]?.finish_reason) {
              finishReason = parsed.choices[0].finish_reason;
            }

            // Update usage information from the final chunk
            if (parsed.usage) {
              usage = {
                promptTokens: parsed.usage.prompt_tokens,
                completionTokens: parsed.usage.completion_tokens,
                totalTokens: parsed.usage.total_tokens
              };
            }
          } catch (e) {
            console.error('Error parsing stream chunk:', e);
          }
        }
      }
    }
            
    return { text: fullText, usage, finishReason };
  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    throw new Error(`Failed to stream from vision proxy: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Text provider implementations
const textProviderImplementations: Record<string, TextProviderImplementation | VisionTextProviderImplementation> = {};

// Vision-enabled text provider: claude-bedrock
textProviderImplementations["claude-bedrock"] = {
  async generate(prompt: string): Promise<TextGenerationResult> {
    return proxyGenerate(prompt, "67d3d8513660678db5fe05bc", "claude-bedrock");
  },
  async generateStream(prompt: string, onChunk: (text: string) => void): Promise<TextGenerationResult> {
    return proxyGenerateStream(prompt, onChunk, "67d3d8513660678db5fe05bc", "claude-bedrock");
  },
  async generateWithImages(prompt: string, imageUrls: string[]): Promise<TextGenerationResult> {
    return proxyGenerateWithImages(prompt, imageUrls, "67d3d8513660678db5fe05bc", "claude-bedrock");
  },
  async generateWithImagesStream(prompt: string, imageUrls: string[], onChunk: (text: string) => void): Promise<TextGenerationResult> {
    return proxyGenerateWithImagesStream(prompt, imageUrls, onChunk, "67d3d8513660678db5fe05bc", "claude-bedrock");
  }
};

// Vision-enabled text provider: azure-gpt-4o
textProviderImplementations["azure-gpt-4o"] = {
  async generate(prompt: string): Promise<TextGenerationResult> {
    return proxyGenerate(prompt, "67e52e6e8e1618ee9ba4117f", "azure-gpt-4o");
  },
  async generateStream(prompt: string, onChunk: (text: string) => void): Promise<TextGenerationResult> {
    return proxyGenerateStream(prompt, onChunk, "67e52e6e8e1618ee9ba4117f", "azure-gpt-4o");
  },
  async generateWithImages(prompt: string, imageUrls: string[]): Promise<TextGenerationResult> {
    return proxyGenerateWithImages(prompt, imageUrls, "67e52e6e8e1618ee9ba4117f", "azure-gpt-4o");
  },
  async generateWithImagesStream(prompt: string, imageUrls: string[], onChunk: (text: string) => void): Promise<TextGenerationResult> {
    return proxyGenerateWithImagesStream(prompt, imageUrls, onChunk, "67e52e6e8e1618ee9ba4117f", "azure-gpt-4o");
  }
};

// Regular text provider: azure-gpt-4o-o3-mini
textProviderImplementations["azure-gpt-4o-o3-mini"] = {
  async generate(prompt: string): Promise<TextGenerationResult> {
    return proxyGenerate(prompt, "67e6270f8e1618ee9ba41189", "azure-gpt-4o-o3-mini");
  },
  async generateStream(prompt: string, onChunk: (text: string) => void): Promise<TextGenerationResult> {
    return proxyGenerateStream(prompt, onChunk, "67e6270f8e1618ee9ba41189", "azure-gpt-4o-o3-mini");
  }
};



export async function stability_proxy(
  request: StabilityProxyRequest,
): Promise<StabilityProxyResponse> {
  if (!request.prompt) {
    throw new Error('Prompt parameter is required');
  }

  // Build the request payload
  const requestBody = {
    prompt: request.prompt,
    webId: CONFIG.webId,
    integrationId: "67d66162ce4370abd9389601"
  };

  try {
    const response = await fetch('https://proxy.getcreatr.com/v1/proxy/imagegen/stability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'Could not retrieve error details';
      }

      throw new StabilityProxyError(
        `Stability proxy error: ${response.status} ${response.statusText}`,
        response.status,
        errorText
      );
    }

    const data = await response.json();
    return data as StabilityProxyResponse;
  } catch (error) {
    if (error instanceof StabilityProxyError) {
      throw error;
    } else {
      throw new Error(`Failed to call Stability proxy: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}


export function stability_getImageUrl(response: StabilityProxyResponse): string | null {
  if (response?.data?.url) {
    return response.data.url;
  }
  return null;
}



export async function elevenlabs_proxy(
  request: ElevenLabsProxyRequest,
): Promise<ElevenLabsProxyResponse> {
  if (!request.prompt) {
    throw new Error('Prompt parameter is required');
  }

  // Build the request payload
  // Available voices:
  // - Aria: American expressive
  // - Roger: American confident
  // - Charlotte: Swedish seductive (default)
  // - Will: American friendly
  // - Lily: British warm
  // - Bill: American trustworthy
  
  const requestBody = {
    prompt: request.prompt,
    webId: CONFIG.webId,
    integrationId: "67e0586b88fd8bd53d129bcb",
    voiceName: request.voiceName || "Charlotte"
  };

  try {
    const response = await fetch('https://proxy.getcreatr.com/v1/proxy/tts/elevenlabs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'Could not retrieve error details';
      }

      throw new ElevenLabsProxyError(
        `ElevenLabs proxy error: ${response.status} ${response.statusText}`,
        response.status,
        errorText
      );
    }

    const data = await response.json();
    return data as ElevenLabsProxyResponse;
  } catch (error) {
    if (error instanceof ElevenLabsProxyError) {
      throw error;
    } else {
      throw new Error(`Failed to call ElevenLabs proxy: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}


export function elevenlabs_getAudioUrl(response: ElevenLabsProxyResponse): string | null {
  if (response?.data?.url) {
    return response.data.url;
  }
  return null;
}

