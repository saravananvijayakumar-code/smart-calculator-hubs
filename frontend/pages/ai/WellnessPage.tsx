import { Link } from 'react-router-dom';
import { Heart, Sparkles, BookOpen } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { AffiliateBanner } from '@/components/AffiliateBanner';
import { AutoAdSlot } from '@/components/ads/AutoAdSlot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const aiTools = [
  {
    id: 'mood-journal',
    name: 'AI Mood Journal',
    description: 'Track your emotions and get AI-powered insights for better mental wellness',
    icon: BookOpen,
    path: '/ai/wellness/mood-journal',
    badge: 'New'
  }
];

export default function WellnessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-green-900/20 dark:to-teal-900/20">
      <SEOHead
        title="AI Wellness Tools - Smart Calculator Hubs"
        description="Improve your wellbeing with AI-powered wellness tools including mood tracking, meditation guides, and mental health insights."
        keywords="AI wellness, mood journal, mental health AI, wellness tracker"
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">AI-Powered Wellness</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              🌱 Wellness AI Tools
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nurture your mental and physical wellbeing with AI-powered insights. Track your mood, set wellness goals, and get personalized recommendations.
            </p>
          </div>

          <AutoAdSlot placement="top-banner" className="mb-8" />

          <AutoAdSlot placement="in-feed" className="mb-8" />

          <div className="grid md:grid-cols-2 gap-6">
            {aiTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.id} to={tool.path} className="group">
                  <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] border-2 hover:border-green-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                          <Icon className="h-6 w-6 text-green-600" />
                        </div>
                        {tool.badge && (
                          <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <CardTitle className="mt-4 group-hover:text-green-600 transition-colors">
                        {tool.name}
                      </CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-green-600 font-medium">
                        Try it now
                        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 space-y-8">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-200 dark:border-green-800">
              <h2 className="text-3xl font-bold mb-6 flex items-center text-foreground">
                <Heart className="h-7 w-7 text-green-600 mr-3" />
                Elevating Mental and Physical Wellness Through AI Innovation
              </h2>
              
              <AutoAdSlot placement="mid-content" className="my-8" />

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  Wellness encompasses the multidimensional pursuit of physical health, mental wellbeing, emotional balance, and holistic life satisfaction. In our complex modern world, maintaining wellness requires navigating stress management, lifestyle choices, emotional regulation, sleep optimization, nutrition decisions, exercise habits, and mental health awareness. Artificial intelligence has emerged as a transformative force in wellness support, offering personalized insights, pattern recognition, and evidence-based guidance that empowers individuals to understand themselves deeply and make informed choices supporting long-term health and happiness.
                </p>

                <AutoAdSlot placement="in-article" className="my-8" />

                <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">The Modern Wellness Challenge</h3>
                <p className="leading-relaxed mb-4">
                  Contemporary life presents unprecedented wellness challenges. Chronic stress from always-on connectivity, demanding work cultures, and information overload activates our stress response systems continuously rather than episodically as they evolved. Sleep disruption from artificial light, irregular schedules, and screen exposure compromises recovery and cognitive function. Sedentary lifestyles combined with processed food availability create metabolic and cardiovascular health risks. Social isolation despite digital connection undermines emotional wellbeing and mental health.
                </p>
                <p className="leading-relaxed mb-4">
                  These challenges compound through complex interactions. Poor sleep impairs emotional regulation, increasing stress sensitivity. Chronic stress disrupts sleep architecture and drives emotional eating. Lack of physical activity reduces stress resilience and mood regulation capacity. Traditional wellness approaches often address symptoms individually without recognizing these interconnected systems. AI-powered wellness tools excel at identifying these complex patterns, revealing how different lifestyle factors interact to influence overall wellbeing in ways that might not be obvious to individuals tracking their experiences.
                </p>

                <AutoAdSlot placement="mid-content" className="my-8" />

                <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">The Science of Mood and Emotional Wellness</h3>
                <p className="leading-relaxed mb-4">
                  Emotional experiences represent complex interactions between neurological processes, hormonal fluctuations, environmental factors, cognitive patterns, and physiological states. Mood varies naturally across time scales – circadian rhythms create daily fluctuations, hormonal cycles drive weekly or monthly patterns, and seasonal changes influence emotional states through sunlight exposure and temperature variations. Beyond these natural cycles, mood responds to sleep quality, nutrition, exercise, social interactions, stress levels, and countless environmental factors.
                </p>
                <p className="leading-relaxed mb-4">
                  Understanding your unique mood patterns requires tracking experiences over extended periods and identifying correlations that might not be immediately apparent. Perhaps your mood consistently dips three days after poor sleep, or specific social situations reliably trigger anxiety that manifests hours later. Maybe seasonal transitions affect you more significantly than you realize, or dietary choices influence emotional states in delayed ways. AI mood tracking tools excel at revealing these patterns by analyzing data across timeframes and variables beyond human pattern recognition capabilities.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">How AI Mood Journals Transform Self-Understanding</h3>
                <p className="leading-relaxed mb-4">
                  AI-powered mood journals represent sophisticated wellness tools that go far beyond simple emotion logging. They employ natural language processing to analyze journal entries, identifying emotional themes, cognitive patterns, and subtle shifts in mental state reflected in language choices. Machine learning algorithms recognize correlations between moods and lifestyle factors like sleep duration, exercise frequency, social activities, weather patterns, work stress, and dietary choices. Over time, these systems build comprehensive models of individual emotional patterns and wellness factors.
                </p>
                <p className="leading-relaxed mb-4">
                  Advanced AI mood journals can identify trigger patterns you might not consciously recognize. They might notice that your anxiety peaks consistently on Sunday evenings, suggesting anticipatory stress about the upcoming work week. They could reveal that your mood improves reliably after specific activities like outdoor exercise or creative hobbies, even when you don't consciously associate these activities with emotional benefits. They might detect early warning signs of depressive episodes or anxiety escalation, enabling proactive intervention before symptoms become severe.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">Personalized Wellness Recommendations Through Machine Learning</h3>
                <p className="leading-relaxed mb-4">
                  The most valuable aspect of AI wellness tools involves generating personalized recommendations based on your unique patterns rather than generic wellness advice. While general guidance like "exercise regularly" and "get adequate sleep" benefits most people, AI can identify which specific interventions work best for your individual biology, psychology, and circumstances. Perhaps morning exercise dramatically improves your mood while evening workouts interfere with sleep. Maybe mindfulness meditation helps you significantly while progressive muscle relaxation doesn't resonate.
                </p>
                <p className="leading-relaxed mb-4">
                  Machine learning enables this personalization by analyzing which wellness practices correlate with positive outcomes for you specifically. After tracking mood alongside various activities, stress management techniques, and lifestyle factors, AI systems recognize your unique response patterns. They can suggest optimal exercise timing based on when it most improves your mood without disrupting sleep. They identify which stress management approaches work best for your stress profile. They recommend activities proven effective for your specific emotional patterns rather than generically popular practices that might not suit you.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">The Psychology of Self-Awareness and Behavioral Change</h3>
                <p className="leading-relaxed mb-4">
                  Psychological research demonstrates that self-awareness represents a critical prerequisite for meaningful behavioral change. You can't modify patterns you don't recognize, and many wellness-undermining behaviors operate outside conscious awareness. Stress eating might happen automatically when anxious. Sleep procrastination could relate to unrecognized work anxiety. Social withdrawal might stem from depression you haven't fully acknowledged. AI wellness tools enhance self-awareness by making unconscious patterns visible through data visualization and insight generation.
                </p>
                <p className="leading-relaxed mb-4">
                  Beyond awareness, successful behavioral change requires understanding personal motivation, identifying specific obstacles, developing concrete implementation plans, and maintaining consistency through challenges. AI wellness assistants support this change process by helping identify intrinsic motivations for wellness goals, recognizing patterns that sabotage wellness intentions, suggesting specific, achievable behavior modifications, and providing accountability through tracking and progress feedback. This structured support addresses the reality that knowing what to do rarely translates to actually doing it without additional systems and support.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">Stress Management in the Digital Age</h3>
                <p className="leading-relaxed mb-4">
                  Chronic stress represents one of modern life's most pervasive wellness challenges, linked to numerous physical health problems including cardiovascular disease, immune dysfunction, digestive issues, and metabolic disorders, as well as mental health conditions like anxiety and depression. Traditional stress management advice often proves insufficient because stress sources are chronic rather than acute, multi-factorial rather than singular, and deeply embedded in modern work and life structures rather than easily eliminated.
                </p>
                <p className="leading-relaxed mb-4">
                  AI wellness tools approach stress management through sophisticated analysis of stress patterns and personalized intervention matching. They identify your primary stress sources – perhaps work deadlines, relationship conflicts, financial concerns, or health anxiety. They recognize how stress manifests for you specifically – maybe through sleep disruption, irritability, physical tension, or emotional eating. They suggest evidence-based stress management techniques matched to your stress profile and preferences, from cognitive reframing for worry-based stress to somatic practices for physical tension, to time management for overwhelm-driven stress.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">Sleep Optimization and Recovery</h3>
                <p className="leading-relaxed mb-4">
                  Sleep represents the foundation of wellness, influencing virtually every aspect of physical and mental health. Quality sleep supports immune function, metabolic regulation, cognitive performance, emotional regulation, memory consolidation, and cellular repair. Despite sleep's critical importance, many people struggle with insufficient or poor-quality sleep due to irregular schedules, evening screen exposure, caffeine consumption, stress, environmental factors, or underlying sleep disorders.
                </p>
                <p className="leading-relaxed mb-4">
                  AI wellness platforms can analyze sleep patterns alongside daytime behaviors, environmental factors, and wellness outcomes to optimize sleep quality. They might identify that your sleep quality correlates strongly with afternoon caffeine cutoff times, evening screen usage, bedroom temperature, or exercise timing. They can recognize patterns suggesting underlying sleep disorders that warrant professional evaluation. They provide personalized sleep optimization recommendations based on your specific sleep patterns and factors influencing your rest, moving beyond generic sleep hygiene advice to targeted interventions addressing your unique sleep challenges.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">Nutrition, Energy, and Mood Connections</h3>
                <p className="leading-relaxed mb-4">
                  Emerging research reveals profound connections between nutrition and mental health. The gut-brain axis links digestive health with neurological function and emotional states. Blood sugar fluctuations influence energy and mood stability. Nutrient deficiencies affect neurotransmitter production and brain function. Individual variability in nutritional responses means optimal diets differ significantly between people, influenced by genetics, microbiome composition, activity levels, and metabolic factors.
                </p>
                <p className="leading-relaxed mb-4">
                  AI wellness tools that track both nutritional intake and wellness outcomes can reveal your personal nutrition-mood connections. They might identify that protein-rich breakfasts stabilize your mood throughout the day, or that sugar consumption triggers mood crashes hours later for you specifically. They can recognize patterns like increased anxiety following certain foods or improved energy with specific nutrient timing. These personalized insights enable dietary modifications targeting your unique biology rather than following generic nutrition recommendations that might not optimize your individual wellness.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">Movement, Exercise, and Mental Health</h3>
                <p className="leading-relaxed mb-4">
                  Physical activity profoundly influences mental health through multiple mechanisms: neurotransmitter production and regulation, stress hormone modulation, inflammatory pathway effects, neuroplasticity and brain-derived neurotrophic factor production, sleep quality improvement, and self-efficacy and accomplishment feelings. Exercise effectiveness for mental health rivals some medications for conditions like depression and anxiety, without side effects and with additional physical health benefits.
                </p>
                <p className="leading-relaxed mb-4">
                  AI wellness platforms help optimize exercise for mental health benefits by identifying which movement types most improve your specific mood patterns. Some people respond best to vigorous cardiovascular exercise, while others find yoga or strength training more emotionally beneficial. Exercise timing matters too – morning movement might energize some while evening workouts help others decompress from daily stress. AI analysis of your activity patterns alongside mood tracking reveals your optimal exercise prescription for mental wellness, enabling strategic movement planning that maximizes psychological benefits.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">Social Connection and Emotional Wellbeing</h3>
                <p className="leading-relaxed mb-4">
                  Human beings evolved as deeply social creatures, and social connection profoundly influences wellness. Strong social relationships correlate with longer lifespans, better physical health, enhanced immune function, lower anxiety and depression risk, and greater life satisfaction. Conversely, loneliness and social isolation predict numerous negative health outcomes rivaling smoking or obesity as health risk factors. Modern life often undermines social connection through geographic mobility, digital communication replacing face-to-face interaction, demanding work schedules, and urban anonymity.
                </p>
                <p className="leading-relaxed mb-4">
                  AI wellness tools can reveal how social activities influence your specific emotional patterns. They might identify that your mood consistently improves after time with close friends but declines after large social gatherings, suggesting you're more introverted than you realized. They could show that regular brief social connections sustain your mood better than infrequent extended interactions, or that specific relationships consistently lift or drain your energy. These insights enable intentional social life design aligned with your authentic needs rather than perceived social obligations.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">Cognitive Behavioral Patterns and Mental Frameworks</h3>
                <p className="leading-relaxed mb-4">
                  Cognitive behavioral theory demonstrates that thoughts, feelings, and behaviors interconnect in powerful cycles. Negative thought patterns like catastrophizing, all-or-nothing thinking, or harsh self-criticism drive emotional distress and maladaptive behaviors. Conversely, cognitive restructuring – identifying and challenging unhelpful thought patterns – represents a cornerstone of evidence-based mental health treatment. Many people operate with cognitive patterns they don't fully recognize, making self-modification difficult.
                </p>
                <p className="leading-relaxed mb-4">
                  AI mood journals employing natural language processing can identify cognitive patterns reflected in your journal entries. They might notice frequent catastrophizing language, persistent self-criticism, or rumination on unchangeable past events. By highlighting these patterns, AI tools create opportunities for conscious cognitive restructuring. Some platforms suggest alternative thought frameworks or connect identified patterns with relevant cognitive behavioral therapy techniques. This digital cognitive awareness support makes evidence-based mental health practices more accessible outside formal therapy contexts.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">Seasonal and Environmental Wellness Factors</h3>
                <p className="leading-relaxed mb-4">
                  Environmental factors profoundly influence wellness in ways people often underestimate. Seasonal affective patterns affect many individuals beyond those diagnosed with Seasonal Affective Disorder, with mood, energy, and motivation fluctuating across seasons. Sunlight exposure influences circadian rhythms, vitamin D production, and mood regulation. Weather patterns affect some people's emotional states and pain levels. Air quality, noise pollution, and nature access influence stress and wellbeing.
                </p>
                <p className="leading-relaxed mb-4">
                  AI wellness platforms tracking mood alongside environmental data can reveal your personal sensitivities to these factors. They might identify consistent mood dips during overcast weather or energy increases with longer daylight hours. They could recognize that you're particularly affected by seasonal transitions, benefiting from proactive interventions as days shorten or lengthen. These environmental insights enable lifestyle modifications and compensatory practices addressing your unique environmental sensitivities rather than assuming environmental factors affect everyone identically.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">Privacy and Security in Wellness Data</h3>
                <p className="leading-relaxed mb-4">
                  Wellness data represents some of the most sensitive personal information imaginable, documenting mental health struggles, emotional vulnerabilities, and intimate life details. The thought of this information being accessed by employers, insurers, or malicious actors rightfully concerns many potential users of digital wellness tools. Responsible AI wellness platforms prioritize privacy through stringent measures: end-to-end encryption ensuring only users can access their data, local processing minimizing cloud data transmission, clear policies prohibiting data sharing with third parties, and user control over data retention and deletion.
                </p>
                <p className="leading-relaxed mb-4">
                  The most trustworthy platforms embrace privacy-by-design principles, collecting only data essential for functionality and engineering systems to operate with minimal personal information. They provide transparency about exactly what data is collected, how it's used, and who has access. They obtain explicit consent before any data sharing and allow granular privacy controls. When evaluating wellness AI tools, prioritize platforms demonstrating genuine commitment to privacy protection through technical architecture and transparent policies, not just privacy statements.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">The Limitations of AI Wellness Tools</h3>
                <p className="leading-relaxed mb-4">
                  While AI wellness tools offer tremendous value, understanding their limitations remains crucial for appropriate use. They cannot diagnose mental health conditions, which requires professional clinical evaluation. They shouldn't replace professional mental health treatment for serious conditions like major depression, anxiety disorders, or trauma-related concerns. They work best as wellness maintenance and self-understanding tools for generally well individuals, not as mental health crisis intervention or treatment substitutes.
                </p>
                <p className="leading-relaxed mb-4">
                  Quality AI wellness platforms explicitly acknowledge these limitations and encourage professional consultation when appropriate. They include features for crisis resources and professional referrals. They avoid making clinical claims or suggesting they replace therapy. They frame insights as hypotheses for personal reflection rather than definitive diagnoses. Users should view AI wellness tools as complements to, not replacements for, professional healthcare, using them to enhance self-awareness and wellness practices while consulting professionals for clinical concerns.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">Building Sustainable Wellness Practices</h3>
                <p className="leading-relaxed mb-4">
                  The goal of wellness tools isn't creating dependency but developing sustainable practices that eventually become self-reinforcing. AI platforms support this by gradually building wellness literacy – teaching users to recognize their patterns independently, developing intrinsic motivation for wellness practices rather than relying on external prompts, building habits that persist without ongoing tracking, and transferring wellness management skills from tool-supported to self-directed.
                </p>
                <p className="leading-relaxed mb-4">
                  The most effective use of AI wellness tools involves intensive initial engagement to establish patterns and develop understanding, followed by gradual reduction as practices become habitual and self-awareness increases. Users might track mood daily while learning their patterns, then reduce to weekly tracking as they internalize their triggers and effective interventions. The ultimate success measure isn't permanent tool dependence but developing autonomous wellness management supported by occasional tool consultation for insight refinement or during challenging periods.
                </p>

                <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">The Future of AI Wellness Technology</h3>
                <p className="leading-relaxed mb-4">
                  The integration of AI in wellness continues evolving rapidly with emerging capabilities that promise even more sophisticated support. Wearable device integration enables physiological data analysis alongside subjective experiences, revealing connections between heart rate variability, sleep architecture, activity patterns, and emotional states. Predictive analytics may forecast mood declines or stress peaks days in advance, enabling proactive intervention. Virtual wellness coaching using natural language processing could provide conversational support and guidance.
                </p>
                <p className="leading-relaxed mb-4">
                  Future AI wellness platforms might integrate genetic and microbiome data to personalize nutrition and lifestyle recommendations with unprecedented precision. They could employ social connection analysis to optimize relationship health alongside individual wellness. Real-time stress detection through voice analysis or facial recognition could trigger just-in-time interventions during stressful moments. As capabilities advance, the boundary between wellness tools and comprehensive health management ecosystems will blur, offering integrated support across physical, mental, emotional, and social wellbeing dimensions.
                </p>
              </div>

              <div className="mt-10 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Transform Your Wellness Journey with AI</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 font-bold">•</span>
                      <span className="text-foreground">Discover hidden patterns in your mood and wellness factors</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 font-bold">•</span>
                      <span className="text-foreground">Receive personalized recommendations based on your unique biology</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 font-bold">•</span>
                      <span className="text-foreground">Track emotional trends and identify triggers proactively</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 font-bold">•</span>
                      <span className="text-foreground">Optimize sleep, stress, and energy through data insights</span>
                    </li>
                  </ul>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 font-bold">•</span>
                      <span className="text-foreground">Build sustainable wellness practices with intelligent support</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 font-bold">•</span>
                      <span className="text-foreground">Understand complex wellness connections across lifestyle factors</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 font-bold">•</span>
                      <span className="text-foreground">Maintain complete privacy with secure, encrypted tracking</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 font-bold">•</span>
                      <span className="text-foreground">Access evidence-based wellness strategies personalized to you</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <AutoAdSlot placement="in-article" className="mt-8" />

          <AutoAdSlot placement="bottom-sticky" className="mt-8" />

          <AffiliateBanner type="amazon-wellness" className="mt-12" />

          <AutoAdSlot placement="in-feed" className="mt-8" />
        </div>
      </div>
    </div>
  );
}
