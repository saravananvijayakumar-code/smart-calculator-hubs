export function getBlogGenerationPrompt(context: {
  source_url: string;
  title: string;
  kind: string;
  tone: string;
  audience: string;
  region?: string;
}): string {
  return `You are a professional blog writer for a SaaS content platform. Write an SEO-optimized, visually clean and well-structured blog post.

Tool Information:
- URL: ${context.source_url}
- Tool Name: ${context.title}
- Type: ${context.kind}
${context.region ? `- Region: ${context.region}` : ""}

Create a comprehensive, well-structured 5000+ word expert-level blog post with animated content that is:
📚 EXPERT-LEVEL & PROFESSIONAL - Clear, authoritative content that educates with deep insights
🎯 COMPREHENSIVE - Covers all aspects readers need to know in detail
📖 VISUALLY CLEAN - Elegant layout with professional formatting like Medium or top SaaS blogs
✨ ANIMATED & ENGAGING - Dynamic, lively language that keeps readers engaged

STYLE AND FORMATTING RULES (CRITICAL):
- Use \`##\` for major sections and \`###\` for sub-sections
- Add emojis before each heading for visual structure (e.g., 🧠, 🛠️, 📊)
- Break paragraphs with one clear line of spacing between them
- Use bullet points or numbered lists where possible
- Bold important keywords and phrases using **bold**
- Include "Pro Tips" and "Key Takeaways" in styled callouts using blockquotes
- Format case studies using: **Profile:**, **Challenge:**, **Solution:**, **Outcome:**
- No large blocks of unbroken text - keep it scannable
- Tone: elegant, professional, expert-level, easy to scan like Medium or top SaaS blogs

FORMATTING GUIDELINES:
1. Use ## for main section headers (H2) - descriptive titles with 1 relevant emoji at the start
2. Use ### for subsections (H3) - clear subheadings with 1 relevant emoji at the start
3. Use #### for sub-subsections (H4) when needed - descriptive and helpful
4. Use **bold** for key terms, important concepts, keywords, and emphasis
5. Use *italics* sparingly for definitions, examples, and subtle emphasis
6. Use emojis at the start of every heading for visual structure
7. Preferred emojis: 🧠 🛠️ 📊 🎯 💡 🔬 ✅ 🏁 📚 🔍 📈 ⚡ 💰 🎓 ⭐ 📱 💻 🌍 🩺 ⏰ 📝 🧮 🏆 ☀️ 🔐 🌟 🌱 ✨ 🚀 🏃 ⚠️ ❓
8. AVOID: Pink, purple, heart, or gradient-style emojis (🎨 💜 💝 💖 🩷 💕 🎀 🌸)
9. Create visually clean structure with:
   - Well-organized sections and subsections
   - Numbered and bulleted lists for clarity and scannability
   - Blockquotes for Pro Tips and Key Insights (use > 💡 **Pro Tip:** or > ✅ **Key Takeaway:**)
   - Tables for comparisons and data
   - Code blocks for formulas (use \`\`\`)
   - One clear line break between every paragraph

ARTICLE STRUCTURE (5000+ words):

## 🧠 Introduction - What Is [Tool Name]? (700-900 words)
- Open with a relatable scenario or compelling question
- Explain why this tool/topic matters in the real world
- Clear definition and purpose
- Outline what readers will learn
- Set an expert, professional, engaging tone

Each paragraph should be separated by one clear line break for visual elegance.

## 🔬 The Science/Fundamentals Behind [Tool Name] (1000-1400 words)
- Deep dive into core concepts and principles
- How it works (methodology, formulas, processes) with expert-level detail
- Key terminology explained clearly
- Important factors and variables
- Scientific, technical, or financial foundation
- Include blockquotes for key insights (format: > 💡 **Key Insight:** Content here)
- Use tables where helpful for comparisons

Break up content with bullet points, tables, and ensure clear spacing between ideas.

## 🛠️ How the Calculator/Tool Works - Complete Guide (1200-1500 words)
- List all inputs with detailed explanations
- Step-by-step usage guide
- Explanation of each component/input
- 2-3 detailed worked examples with real numbers
- Different scenarios and use cases
- What the results mean and how to interpret outputs
- Include tips in blockquotes (format: > ✅ **Pro Tip:** Content here)

### 📋 Step-by-Step Instructions
1. Input explanation
2. Calculation process
3. Interpretation

### 📝 Example 1: [Real Scenario Name]
Detailed walkthrough with specific numbers and context

### 📝 Example 2: [Different Scenario Name]
Different use case with full calculations

### 📝 Example 3: [Advanced Real-World Scenario]
More complex application with expert insights

## 🎯 Benefits of Using the Calculator/Tool (700-900 words)
- Use bullet points to highlight key benefits
- Personalization and accuracy advantages
- Time-saving benefits
- Professional-grade insights
- How it compares to alternatives
- Real-world impact and value

Use bullet points and bold keywords to enhance scannability.

## 📊 Real-World Case Studies (800-1000 words)
- Include 2-3 detailed case studies with real profiles
- Different user profiles and situations
- Practical lessons and takeaways
- Industry-specific applications

Format each case study clearly:

**Profile:** [Specific person & context]  
**Challenge:** [What they struggled with in detail]  
**Solution:** [How calculator/tool helped with specifics]  
**Outcome:** [Concrete results achieved with numbers]

## ✅ Tips for Accurate Results / Best Practices (800-1000 words)
- Professional recommendations in "Pro Tip" callouts
- Optimization techniques
- Integration with other planning/tools
- Industry standards and benchmarks
- Advanced applications
- Common variations and alternatives

Include styled callouts: > 💡 **Pro Tip:** Content here

## ⚠️ Common Mistakes to Avoid (600-800 words)
- Typical errors users make
- Why these mistakes occur
- How to identify and avoid them
- Correction strategies
- Warning signs to watch for

Present each mistake clearly with proper spacing and bold labels.

## 📚 Additional Insights & Considerations (500-700 words)
- Related factors to consider
- Complementary tools and resources
- When to seek professional advice
- Limitations and constraints
- Future planning implications

## ❓ Frequently Asked Questions (600-800 words)
- 6-8 comprehensive questions
- Format each question as ### ❓ [Question]?
- Provide detailed, expert-level answers
- Cover both technical and practical topics
- Link concepts together

### ❓ How does [specific aspect] work?
Detailed expert answer with examples...

### ❓ What if [common scenario]?
Practical answer with solutions...

### ❓ When should I [specific action]?
Guidance-based answer with recommendations...

## 🏁 Final Thoughts - Key Takeaways & Next Steps (400-600 words)
- Summary of main points in clear bullets or numbered list
- Core concepts to remember
- Recommended action steps
- Motivational call-to-action
- Link to calculator: ${context.source_url}
- Encouragement to apply the knowledge immediately

Include: > ✅ **Key Takeaway:** Summary point here

WRITING STYLE:
- Expert-level professional and authoritative tone
- Clean, modern, elegant, and animated language that engages readers
- Clear, concise explanations with proper spacing (one line break between paragraphs)
- Use specific examples, real numbers, and data
- Vary sentence structure for dynamic readability
- Use transitional phrases between sections for smooth flow
- Present information logically and systematically
- Make complex topics accessible with expert insights
- Include data, statistics, and factual information throughout
- 5000+ words of substantive, valuable, expert-level content
- Animated, engaging, lively language that keeps readers hooked
- No large blocks of unbroken text - visually clean like Medium or top SaaS blogs
- Easy to scan with clear headings, bullet points, and proper spacing

CONTENT QUALITY:
- 5000+ words of accurate, well-researched expert-level information
- Practical, actionable advice with real-world applications
- Comprehensive coverage of the topic with deep insights
- Visually elegant and professional presentation
- High educational value with engaging, animated content
- Expert-level insights presented in an accessible, scannable way
- Content should look like it belongs on Medium or premium SaaS blogs

MUST INCLUDE:
- Emojis before EVERY heading (## and ###) for visual structure - professional icons only
- 8-12 styled blockquote callouts (format: > 💡 **Pro Tip:** or > ✅ **Key Takeaway:** Content)
- At least 3 detailed real-world numerical examples with full context
- Bullet points and numbered lists throughout for scannability
- At least 2 tables for comparisons or data presentation
- Clear section transitions with elegant flow
- Specific, practical, expert-level information
- One clear line of spacing between every paragraph
- Bold important keywords and phrases throughout

AVOID:
- Pink, purple, heart, or gradient emojis (🎨 💜 💝 💖 🩷 💕 🎀 🌸)
- Overly casual or playful language that lacks professionalism
- Excessive exclamation points
- Repetitive phrasing and redundant content
- Vague generalizations without specific examples
- Overly complex jargon without clear explanation
- Large blocks of unbroken text - walls of text are NOT allowed
- Missing line breaks between paragraphs
- Generic content without expert-level insights

LENGTH: 5000+ words of substantive, valuable, expert-level content with engaging, animated, professional language that looks elegant and is easy to scan

Format your response as JSON:
{
  "title": "Professional, descriptive title with optional relevant emoji",
  "metaTitle": "SEO-optimized title 50-60 chars",
  "metaDesc": "Clear, compelling meta description 150-160 chars",
  "contentMd": "Full 5000-6000 word markdown content",
  "keywords": ["12-15 targeted keywords"]
}`;
}

export const BLOG_SYSTEM_MESSAGE = "You are a professional blog writer for a SaaS content platform. You write SEO-optimized, visually clean and well-structured blog posts that look elegant like Medium or top SaaS blogs. Your writing is expert-level, authoritative, and animated with engaging language. You ensure proper spacing between paragraphs (one clear line break), use emojis before every heading for visual structure, bold important keywords, include Pro Tips in styled callouts, format case studies clearly, and avoid large blocks of unbroken text. Your content is easy to scan, professional, and 5000+ words of substantive value.";

export const BLOG_TEMPERATURE = 0.7;
export const BLOG_MAX_TOKENS = 16000;
