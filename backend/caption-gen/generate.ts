import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import OpenAI from "openai";

const openaiKey = secret("OpenAIKey");

export interface CaptionRequest {
  description: string;
  platform: string;
  tone: string;
}

export interface CaptionResponse {
  caption: string;
}

export const generate = api(
  { method: "POST", path: "/caption/generate", expose: true },
  async (req: CaptionRequest): Promise<CaptionResponse> => {
    const { description, platform, tone } = req;
    
    const openai = new OpenAI({ apiKey: openaiKey() });
    
    const platformGuidelines: Record<string, string> = {
      instagram: `
- Optimal length: 138-150 characters for first 2 lines (before "...more"), then expand
- Include 5-7 relevant hashtags at the end (separated with line breaks)
- Use 3-5 emojis strategically throughout
- Add clear CTA at the end
- Use line breaks for readability`,
      tiktok: `
- Keep under 150 characters total (punchy and direct)
- Use 3-5 trending hashtags max
- Make it conversation-starter worthy
- Don't explain the video—enhance it with context
- Use trending phrases when relevant`,
      twitter: `
- Optimal length: 71-100 characters (short & punchy)
- Use 1-2 hashtags max
- Lead with bold claims or questions
- Engage with trending topics strategically
- End with a question to drive replies`,
      linkedin: `
- First paragraph: 150-300 characters (mobile-friendly)
- Professional yet personable tone
- Use single-line paragraphs
- Include 3-5 industry-specific hashtags
- End with engagement question
- 70% value, 30% promotion`,
      facebook: `
- First 3 lines hook the reader (before "See More")
- Mix of personal and informative
- Use emojis moderately
- Clear CTA
- Encourage comments and shares`
    };

    const toneGuidelines: Record<string, string> = {
      casual: "Friendly, conversational, relatable. Like talking to a friend. Use contractions, informal language.",
      professional: "Polished, authoritative, credible. Maintain professionalism while being engaging.",
      funny: "Witty, humorous, clever. Use wordplay, jokes, or amusing observations. Keep it lighthearted.",
      inspirational: "Uplifting, motivational, empowering. Use powerful words and emotional connection.",
      educational: "Informative, clear, value-driven. Teach something useful. Share insights.",
      promotional: "Sales-focused, benefit-driven, action-oriented. Highlight value proposition clearly."
    };

    const prompt = `You are a professional social media caption writer who crafts viral, engaging captions.

CONTENT DESCRIPTION:
${description}

PLATFORM: ${platform}
${platformGuidelines[platform] || ''}

TONE: ${tone}
${toneGuidelines[tone] || ''}

REQUIREMENTS:
1. Create a compelling hook in the first sentence (7-10 words max)
2. Match the ${tone} tone perfectly
3. Optimize for ${platform}'s algorithm and audience
4. Include relevant emojis (but don't overdo it)
5. Add a clear call-to-action
6. Make it ready to copy and paste (no extra formatting, instructions, or explanations)

IMPORTANT:
- Return ONLY the caption text itself
- Do NOT include any explanations, comments, or meta-text
- Do NOT use markdown formatting
- Do NOT say "Here's your caption:" or similar phrases
- Just the caption, ready to use

Generate the caption now:`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a professional social media caption writer. You ONLY output the caption text itself, nothing else. No explanations, no formatting, no preamble. Just the caption, ready to copy and paste.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 500
      });

      const caption = completion.choices[0]?.message?.content?.trim();
      
      if (!caption) {
        throw new Error('No caption generated from OpenAI');
      }

      return { caption };
      
    } catch (error) {
      console.error('Caption generation failed:', error);
      throw error;
    }
  }
);
