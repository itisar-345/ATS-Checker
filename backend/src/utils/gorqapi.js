import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getResumeSuggestions = async (resumeText) => {
  try {

    
    const prompt = `
    Analyze this resume and provide 5-7 specific improvement suggestions to maximize its ATS score and increase selection chances for the toughest company screenings (e.g., FAANG). Focus on:
    - Optimizing action verbs for impact (e.g., "developed" vs. "worked on")
    - Adding quantifiable metrics (e.g., "increased sales by 20%" vs. "improved sales")
    - Enhancing industry-specific keywords (e.g., AWS, Python, Agile) for top-tier roles
    - Improving section organization and hierarchy (e.g., clear headers, consistent formatting)
    - Enhancing professional presentation (e.g., concise phrasing, no typos)
    - Ensuring alignment with MAANGM or MAANG+ level ATS criteria (technical depth, measurable results)

    For each suggestion, provide:
    - category (dynamic, e.g., Skills Enhancement, Experience Optimization, Metrics Focus, etc.)
    - title (short description)
    - detailed description
    - "before" example with line numbers (e.g., L1: Original text)
    - "after" example with line numbers (e.g., L1: Improved text)
    - rationale (why this improves ATS score and selection odds)

    IMPORTANT: Return ONLY a valid JSON array. Do not include any explanatory text, markdown formatting, or code blocks. Start your response with [ and end with ]. Format:
    [{
      "category": "Skills Enhancement",
      "title": "Add Technical Skills",
      "description": "The resume lacks key technical skills...",
      "before": "L1: Worked on projects",
      "after": "L1: Developed projects using Python and AWS",
      "rationale": "Adding specific skills like Python and AWS boosts keyword matching for FAANG ATS systems."
    }]

    Resume:
    ${resumeText.substring(0, 10000)}
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 3000
    });

    const text = completion.choices[0]?.message?.content || '';
    console.log('Raw Groq API response text:', text);

    // Extract JSON from response - more robust pattern matching
    let jsonText = text;
    
    // Try to find JSON array pattern with various approaches
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    } else {
      // If no direct match, try to extract content between code blocks
      const codeBlockMatch = text.match(/```(?:json)?([\s\S]*?)```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        jsonText = codeBlockMatch[1].trim();
      }
    }

    try {
      // Clean and validate JSON text
      jsonText = jsonText.trim();
      
      // Check if we have valid JSON structure
      if (!jsonText || jsonText.length < 2) {
        throw new Error('Empty or invalid JSON response');
      }
      
      // Ensure it starts with [ and ends with ]
      if (!jsonText.startsWith('[') || !jsonText.endsWith(']')) {
        // Try to extract just the array part
        const startIndex = jsonText.indexOf('[');
        const endIndex = jsonText.lastIndexOf(']');
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          jsonText = jsonText.substring(startIndex, endIndex + 1);
        } else {
          throw new Error('No valid JSON array found in response');
        }
      }
      
      console.log('Attempting to parse JSON:', jsonText.substring(0, 200) + '...');
      const parsed = JSON.parse(jsonText);
      
      if (!Array.isArray(parsed)) {
        console.error('Parsed Groq API response is not an array:', parsed);
        throw new Error('Groq API response is not an array');
      }
      if (parsed.length === 0) {
        console.warn('Groq API returned an empty suggestions array');
      }
      console.log('Parsed Groq API suggestions:', parsed);
      return parsed;
    } catch (parseError) {
      console.error('Error parsing JSON from Groq API response:', parseError);
      console.error('Response text:', text);
      throw parseError;
    }
  } catch (error) {
    console.error('Groq API error:', error);
    // Return a structured error instead of empty array
    return [{
      id: 'error_suggestion',
      category: 'System Error',
      title: 'Unable to Generate Suggestions',
      description: `Failed to generate improvement suggestions: ${error.message}`,
      rationale: 'Please check your API configuration and try again.',
      before: '',
      after: ''
    }];
  }
};
