import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getResumeSuggestions = async (resumeText) => {
  try {
    const prompt = `
    CRITICAL ANALYSIS: This resume must pass the most ruthless ATS filters used by Meta, Google, Amazon, Apple, Netflix, Microsoft, and other Tier-1 tech giants. These companies reject 99% of applications. Provide 6-8 brutal but actionable improvements focusing on:

    TECHNICAL EXCELLENCE GAPS:
    - Missing cutting-edge technologies: Kubernetes, Terraform, GraphQL, TypeScript, Rust, Go, distributed systems architecture
    - Weak system design indicators: No mention of scalability (millions of users), high-availability (99.99% uptime), performance optimization (sub-100ms latency)
    - Insufficient cloud-native expertise: Multi-cloud strategies, serverless architectures, containerization at enterprise scale
    - Lack of AI/ML integration: Machine learning pipelines, data engineering, real-time analytics, recommendation systems

    IMPACT MEASUREMENT FAILURES:
    - Vague accomplishments without concrete business metrics: revenue impact, user growth, performance improvements, cost savings
    - Missing scale indicators: data volume processed, concurrent users handled, system throughput, infrastructure managed
    - No leadership quantification: team size led, cross-functional collaboration scope, mentorship impact

    ELITE-LEVEL REQUIREMENTS:
    - Advanced algorithmic thinking: Complex problem-solving, optimization challenges, computational efficiency
    - Open-source contributions and technical thought leadership
    - Industry recognition: Patents, publications, conference speaking, technical blog authorship
    - Continuous learning: Latest certifications, advanced degrees, cutting-edge technology adoption

    For each critical improvement:
    - category: Choose from Technical Depth, Scale & Performance, Leadership Impact, Innovation & Research, Business Value, System Architecture
    - title: Specific weakness identified
    - description: Detailed explanation of why this is a deal-breaker for elite companies
    - before: Exact weak text from the resume
    - after: Elite-level replacement that demonstrates exceptional capability
    - rationale: How this transforms the candidate from average to exceptional in ATS ranking

    Return ONLY valid JSON array. No explanations, no markdown:
    [{
      "category": "Technical Depth",
      "title": "Demonstrate Advanced System Architecture",
      "description": "Current description shows basic development work instead of complex system design that FAANG expects from senior engineers",
      "before": "Built web applications using React",
      "after": "Architected microservices platform serving 50M+ users with 99.99% uptime, implementing event-driven architecture with Kafka, Redis caching, and auto-scaling Kubernetes clusters",
      "rationale": "Elite companies filter for candidates who can design and scale complex distributed systems, not just build basic applications"
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
