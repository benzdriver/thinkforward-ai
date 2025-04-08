import { Configuration, OpenAIApi } from 'openai';

// Initialize OpenAI configuration with API key from environment variable
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create OpenAI API instance
const openai = new OpenAIApi(configuration);

/**
 * Generate a response using OpenAI's GPT model
 * 
 * @param systemPrompt - The system prompt that defines the AI assistant's behavior
 * @param userPrompt - The user's request or input to process
 * @returns The AI-generated response text
 */
export async function generateAIResponse(systemPrompt: string, userPrompt: string): Promise<string> {
  try {
    // Check if API key is available
    if (!configuration.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Make request to OpenAI API
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Extract the generated text from the response
    const responseText = response.data.choices[0]?.message?.content?.trim();

    if (!responseText) {
      throw new Error('No response generated from OpenAI');
    }

    return responseText;
  } catch (error: any) {
    // Handle request errors
    console.error('Error calling OpenAI API:', error);
    
    if (error.response) {
      console.error('OpenAI API response error:', error.response.data);
      throw new Error(`OpenAI API error: ${error.response.data.error.message}`);
    } else {
      throw new Error(`Error with OpenAI API request: ${error.message}`);
    }
  }
}

/**
 * Generate a JSON response using OpenAI's GPT model with specific formatting instructions
 * 
 * @param systemPrompt - The system prompt that defines the AI assistant's behavior
 * @param userPrompt - The user's request or input to process
 * @param jsonStructure - Description of the expected JSON structure
 * @returns The AI-generated response parsed as JSON
 */
export async function generateJSONResponse<T>(
  systemPrompt: string, 
  userPrompt: string, 
  jsonStructure: string
): Promise<T> {
  // Create a prompt that instructs the model to return valid JSON
  const jsonSystemPrompt = `${systemPrompt}
  
Important: You must respond with valid JSON that matches exactly this structure:
${jsonStructure}

Do not include any explanations, notes, or text outside of the JSON structure.`;

  try {
    const jsonString = await generateAIResponse(jsonSystemPrompt, userPrompt);
    
    // Try to parse the response as JSON
    try {
      return JSON.parse(jsonString) as T;
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', jsonString);
      throw new Error('Invalid JSON format in AI response');
    }
  } catch (error) {
    console.error('Error generating JSON response:', error);
    throw error;
  }
} 