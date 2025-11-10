import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Baby, Sparkles, Heart, Share2, Copy, RefreshCw, Twitter, Facebook, MessageCircle } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';

const boyNames = [
  { name: 'Oliver', meaning: 'Olive tree, symbolizing peace', origin: 'Latin' },
  { name: 'Liam', meaning: 'Strong-willed warrior', origin: 'Irish' },
  { name: 'Noah', meaning: 'Rest, comfort', origin: 'Hebrew' },
  { name: 'Ethan', meaning: 'Strong, firm', origin: 'Hebrew' },
  { name: 'Leo', meaning: 'Lion, brave', origin: 'Latin' }
];

const girlNames = [
  { name: 'Emma', meaning: 'Universal, whole', origin: 'German' },
  { name: 'Olivia', meaning: 'Olive tree', origin: 'Latin' },
  { name: 'Ava', meaning: 'Life, bird', origin: 'Latin' },
  { name: 'Sophia', meaning: 'Wisdom', origin: 'Greek' },
  { name: 'Luna', meaning: 'Moon', origin: 'Latin' }
];

const unisexNames = [
  { name: 'Riley', meaning: 'Courageous', origin: 'Irish' },
  { name: 'Avery', meaning: 'Ruler of elves', origin: 'English' },
  { name: 'Jordan', meaning: 'Flowing down', origin: 'Hebrew' },
  { name: 'Quinn', meaning: 'Wise, intelligent', origin: 'Irish' },
  { name: 'Rowan', meaning: 'Little red one', origin: 'Irish' }
];

interface NameSuggestion {
  name: string;
  meaning: string;
  origin: string;
}

export default function BabyNameGenerator() {
  const [gender, setGender] = useState('boy');
  const [style, setStyle] = useState('modern');
  const [includeUnique, setIncludeUnique] = useState(false);
  const [suggestions, setSuggestions] = useState<NameSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let namePool: NameSuggestion[] = [];
      
      if (gender === 'boy') {
        namePool = boyNames;
      } else if (gender === 'girl') {
        namePool = girlNames;
      } else {
        namePool = unisexNames;
      }

      const shuffled = [...namePool].sort(() => Math.random() - 0.5);
      setSuggestions(shuffled.slice(0, 5));
      setIsGenerating(false);
    }, 1500);
  };

  const shareToSocial = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    if (suggestions.length === 0) return;
    
    const topNames = suggestions.slice(0, 3).map(s => s.name).join(', ');
    const shareText = `🍼 Beautiful baby name ideas: ${topNames}\n\n✨ Find your perfect baby name at www.smartcalculatorhubs.com #BabyNames #ParentingJourney #BabyNaming`;
    const shareUrl = 'https://www.smartcalculatorhubs.com';
    
    if (platform === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, '_blank');
    } else if (platform === 'facebook') {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
      window.open(facebookUrl, '_blank');
    } else if (platform === 'whatsapp') {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-pink-900/20">
      <SEOHead
        title="AI Baby Name Generator - Smart Calculator Hubs"
        description="Discover the perfect name for your baby with AI-powered suggestions. Get unique names with meanings from diverse cultures."
        keywords="AI baby name generator, baby names, name meanings, unique baby names"
      />



      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">AI-Powered Names</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              AI Baby Name Generator
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover the perfect name for your little one with AI assistance
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-6 w-6 text-orange-600" />
                Name Preferences
              </CardTitle>
              <CardDescription>
                Tell us your preferences and we'll suggest perfect names
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boy">Boy</SelectItem>
                    <SelectItem value="girl">Girl</SelectItem>
                    <SelectItem value="unisex">Unisex / Gender Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="style">Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger id="style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern & Trendy</SelectItem>
                    <SelectItem value="classic">Classic & Timeless</SelectItem>
                    <SelectItem value="unique">Unique & Rare</SelectItem>
                    <SelectItem value="cultural">Cultural & Traditional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="unique"
                  checked={includeUnique}
                  onCheckedChange={(checked) => setIncludeUnique(checked as boolean)}
                />
                <Label htmlFor="unique" className="cursor-pointer">
                  Include unique spellings
                </Label>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Generating Names...
                  </>
                ) : (
                  <>
                    <Baby className="mr-2 h-5 w-5" />
                    Generate Name Suggestions
                  </>
                )}
              </Button>
            </CardContent>
          </Card>



          {suggestions.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Your Name Suggestions</h2>
                <div className="flex gap-2">
                  <Button onClick={handleGenerate} variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    New Names
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 mb-8">
                {suggestions.map((suggestion, idx) => (
                  <Card key={idx} className="border-2 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl text-orange-600">{suggestion.name}</CardTitle>
                        <Heart className="h-6 w-6 text-pink-500" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{suggestion.origin}</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        <strong>Meaning:</strong> {suggestion.meaning}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-2 border-orange-200 dark:border-orange-800">
                <CardContent className="pt-6">
                  <Separator className="mb-4" />
                  <div className="space-y-3">
                    <h4 className="font-semibold">Share Your Favorite Names</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <Button 
                        onClick={() => shareToSocial('twitter')} 
                        variant="outline"
                        className="w-full"
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        X
                      </Button>
                      <Button 
                        onClick={() => shareToSocial('facebook')} 
                        variant="outline"
                        className="w-full"
                      >
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </Button>
                      <Button 
                        onClick={() => shareToSocial('whatsapp')} 
                        variant="outline"
                        className="w-full"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">The Beautiful Journey of Naming: A Complete Guide</CardTitle>
            </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert space-y-6 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🍼 The Power and Poetry of Names</h3>
                  <p>
                    A name is perhaps the most enduring gift you'll give your child—more lasting than any toy, more personal than any inheritance, and more formative than you might imagine. Research in psychology shows that names genuinely influence life experiences through what's called the "name-letter effect" (people prefer things associated with their names) and implicit egotism (we gravitate toward careers, places, and partners that share letters with our names). Your child's name will be spoken thousands of times before they turn one, and millions of times throughout their life. It's simultaneously mundane and magnificent!
                  </p>
                  <p>
                    But here's the beautiful truth that should relieve some pressure: there's no objectively "perfect" name. What makes a name perfect is the meaning, intention, and love behind it. Some parents agonize for months, creating spreadsheets and polling friends. Others know instantly when they hear "the one." Both approaches are valid! Your journey to finding the right name is uniquely yours, and our AI is here to spark inspiration, not dictate choices. Think of these suggestions as creative prompts in your naming adventure!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">📚 The Etymology and History of Names</h3>
                  <p>
                    Every name carries a story—sometimes ancient, sometimes modern, always meaningful. Names like "Sophia" (wisdom in Greek) and "Emma" (universal in German) connect your child to millennia of linguistic and cultural history. These aren't just labels; they're vessels of meaning that cultures have treasured and transmitted across generations. Understanding a name's etymology adds depth to your choice. When you tell your daughter that "Luna" means moon in Latin and has been used since ancient Roman times to signify beauty and mystery, her name becomes a story she can carry with pride!
                  </p>
                  <p>
                    Naming traditions vary beautifully across cultures. Many Asian cultures consider numerology and the number of strokes in written characters. Jewish tradition often names children after deceased relatives to honor their memory. Some African cultures choose names based on circumstances of birth or desired qualities. Latin American countries frequently use multiple names honoring various family members. Understanding these rich traditions—whether you're following your own cultural practices or drawing inspiration from others—adds significance to your naming decision!
                  </p>
                  <p>
                    Modern naming reflects fascinating social trends. Classic names cycle back into popularity (hello, Eleanor and Theodore!), celebrity culture influences choices (surge in "Arya" after Game of Thrones), and parents increasingly value uniqueness while still wanting their child's name to be pronounceable and spell-able. There's also a beautiful trend toward gender-neutral names like "Riley" and "Avery," reflecting evolving understanding of gender identity. Our AI suggestions span traditional, modern, and timeless options because diversity in naming is part of its beauty!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🎨 The Psychology of Sound and Style</h3>
                  <p>
                    Phonaesthetics—the study of how names sound—reveals fascinating patterns in why certain names feel right. Names ending in "a" sounds (Emma, Sophia, Luna) often feel feminine and soft, while names with hard consonants (Jack, Blake) sound strong and masculine. Names with repeated sounds (Lily, Coco) feel playful and memorable. Long, flowing names (Alexandria, Sebastian) sound formal and sophisticated, while short names (Max, Zoe) feel modern and punchy. Pay attention to how a name feels when you say it—your instincts about phonaesthetics are valid!
                  </p>
                  <p>
                    Consider the full name rhythm and flow. Three-syllable first names often pair beautifully with one-syllable last names (Oliver Smith, Isabella Chen). One-syllable first names balance multi-syllable last names (Grace Rodriguez, James Patterson). Try saying the full name out loud repeatedly—does it flow smoothly or feel awkward? Does the first name end with the same sound the last name starts with (Anna Anderson) creating potential tongue-twisters? These practical sound considerations matter for a name your child will hear and say constantly!
                  </p>
                  <p>
                    Cultural and regional pronunciation variations are worth considering if you have family in different areas or languages. A name like "Theo" is pronounced differently in English versus Greek. "Maria" has beautiful variations across Spanish, Italian, and English. If international accessibility matters to you, consider how the name translates and pronounces across the languages in your family's world. Our AI provides origin information to help you understand these nuances!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">👥 The Sibling Set and Family Harmony</h3>
                  <p>
                    If you're naming a second (or third, or fourth!) child, sibling name coordination becomes a delightful puzzle. Some parents prefer similar styles (matching themes like nature names: River and Willow, or classic names: Elizabeth and William). Others intentionally vary styles so each child has their own distinct name identity. There's no right answer, but consistency in formality level helps—if one child has a very formal name, an extremely casual name for the sibling might feel mismatched.
                  </p>
                  <p>
                    Watch for unintentional rhyming or alliteration that might feel cute initially but could become tiresome (Mary and Gary, or Tim and Jim). Also consider initial combinations—you probably don't want siblings whose initials spell unfortunate words! If you have a themed pattern (all names starting with the same letter, all virtue names, all places), embrace it or break it intentionally. The "accidental pattern" where third-child you realizes you've committed to all names starting with "A" without planning it can feel constraining!
                  </p>
                  <p>
                    Length harmony matters too. If your first child is "Elizabeth Alexandra" and you name your second child "Max," the formal imbalance might create questions. Similarly, if you give one child an extremely unique name ("Azariah Moonbeam") and another a common name ("Sarah"), they might wonder about the different approaches. These aren't dealbreakers—plenty of families have wonderfully eclectic sibling sets—but they're worth considering in your decision-making!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🌍 Cultural Appreciation vs. Appropriation</h3>
                  <p>
                    In our beautifully diverse, interconnected world, parents often fall in love with names from cultures beyond their own heritage. This is generally wonderful—cultural exchange enriches us all! However, thoughtful consideration helps distinguish appreciation from appropriation. Appreciation involves understanding and honoring a name's cultural significance. Appropriation happens when a culturally significant name is used without understanding or respecting its meaning, particularly from marginalized cultures.
                  </p>
                  <p>
                    Questions to ask: Do you have genuine connection to this culture through family, lived experience, or deep engagement? Does this name have sacred or ceremonial significance in its origin culture that makes use by outsiders inappropriate? Can you pronounce it correctly and teach your child about its cultural context? If you're drawn to a name from another culture, do your research, consult people from that culture if possible, and be prepared to explain and honor the name's origins as your child grows.
                  </p>
                  <p>
                    Some names have successfully crossed cultural boundaries and become international (Sofia, Alexander, Isabella). Others remain distinctly tied to specific cultural contexts where usage by outsiders might feel uncomfortable. Trust your instincts, do your research, and choose thoughtfully. Our AI provides cultural origin information to help you make informed, respectful choices that honor the rich traditions names carry!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">💼 The Name Resume: Long-term Professional Considerations</h3>
                  <p>
                    Here's an uncomfortable truth: research shows that names influence how we're perceived professionally. Studies have found resume bias where identical resumes with different names receive different callback rates. Names perceived as unusual or difficult to pronounce sometimes face discrimination. This isn't fair or right—we should actively work against such bias—but it's a current reality some parents consider when naming children.
                  </p>
                  <p>
                    This doesn't mean you should only choose traditional "resume-friendly" names! It means being aware that more unique or culturally specific names might require your child to navigate occasional mispronunciations or biases, and preparing them with pride in their name's uniqueness and meaning. Many successful people have distinctive names that become their brand. The actress Lupita Nyong'o, for instance, turned her beautiful Kenyan name into an asset, not despite its uniqueness but because of it!
                  </p>
                  <p>
                    Consider nicknames and shortened versions that offer your child flexibility. "Alexander" can be Alex in professional settings and Xander with friends. "Anastasia" can adapt to Ana, Annie, or Stasia depending on context. This flexibility allows your child to control how they present themselves in different settings while still having the full beautiful name you chose. Our AI suggestions include names with natural nickname options for this built-in versatility!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🎭 The Nickname Factor: Planned and Unplanned</h3>
                  <p>
                    Even if you plan to always use the full name, reality often has other ideas! Children create their own nicknames, friends invent variations, and family members develop pet names. "Elizabeth" might become Liz, Lizzy, Beth, Eliza, or Betsy regardless of your preferences. Some parents embrace this flexibility; others strongly prefer the full name. Understanding your feelings about potential nicknames helps you choose names aligned with your preferences.
                  </p>
                  <p>
                    Consider both the obvious nicknames and the less obvious ones. "Richard" obviously shortens to Rick or Rich, but also to Dick (which modern parents often find less appealing!). "Penelope" might become Penny, Poppy, or Nell. "Theodore" could be Theo, Teddy, or just T. If there's a nickname variation you strongly dislike, that might influence whether you choose that full name. Conversely, if you love multiple nickname options, a longer formal name provides built-in variety!
                  </p>
                  <p>
                    Some parents choose to use nicknames as the legal name—Max instead of Maximilian, Ellie instead of Eleanor. This is perfectly valid, though it removes the option to "grow into" a more formal version for professional contexts later. There's no wrong choice, just different philosophies about naming flexibility. Our AI provides both traditional long names with nickname potential and standalone names that need no shortening!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">✨ The Uniqueness Spectrum: Finding Your Sweet Spot</h3>
                  <p>
                    Names exist on a spectrum from extremely common (the year's #1 name) to absolutely unique (created combinations). Where you fall on this spectrum is personal preference, but understanding the trade-offs helps. Very common names mean your child might share their name with classmates (offering anonymity and ease) but less distinction. Very unique names mean your child will likely be the only one (offering distinctiveness) but possibly facing frequent spelling/pronunciation clarification.
                  </p>
                  <p>
                    The "Goldilocks zone" many parents seek is uncommon but not weird—names that people recognize and can spell, but aren't currently trending in the top 10. Names like "Eleanor" or "Felix" hit this sweet spot: classic enough to feel familiar, uncommon enough to feel distinctive. However, predicting popularity is tricky! Names surge unexpectedly due to pop culture, celebrity babies, or viral trends. The name you think is unique might become next year's trendy choice!
                  </p>
                  <p>
                    If uniqueness matters greatly to you, consider less common variations of popular names (Sophia → Sonia, Jackson → Jax), international variations (James → Jaime → Seamus), or creative spellings (though be cautious—"Aydyn" for Aiden creates lifetime spelling corrections). Our AI offers a range from trending popular to timelessly uncommon, letting you explore different positions on the uniqueness spectrum!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">👨‍👩‍👧‍👦 Honoring Family Legacy</h3>
                  <p>
                    Many families have naming traditions: firstborn sons named after fathers, children named after grandparents, passing down culturally significant names through generations. These traditions create beautiful intergenerational connections—your child carries forward family history in their very identity. The name "Junior" or "III" creates a direct lineage link. Using a beloved grandmother's name keeps her memory alive in daily life.
                  </p>
                  <p>
                    However, family name pressure can also create challenges. What if you don't love the traditional family name? What if partner families have conflicting traditions? What if the family name feels dated or doesn't fit your child's generation? Remember: this is YOUR child, and ultimately you're the one making the naming decision. You can honor family in the middle name, use variations of family names, or create new traditions. The expectation of continuing family naming doesn't override your parental autonomy!
                  </p>
                  <p>
                    Creative ways to honor family without using names directly: incorporate surname as first name, use initials that spell an honored family member's name, choose names with similar meanings (if honoring "Grace," you might choose "Anna" which also means gracious), or use family birth months to inspire choices. The spirit of honoring family can be achieved through many paths—literal name repetition is just one option!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🌈 Gender and Names: The Evolving Landscape</h3>
                  <p>
                    Traditional gender associations with names are beautifully evolving. Historically masculine names are increasingly used for all genders (Ryan, Parker, Jordan). Gender-neutral names are surging in popularity (Riley, Quinn, Sage). Some parents intentionally choose gender-neutral names to allow their child maximum flexibility in gender expression. Others prefer traditionally gendered names that clearly signal gender identity. Both approaches are equally valid—it's about what feels right for your family!
                  </p>
                  <p>
                    Interestingly, names shift gender associations over time. "Ashley" and "Leslie" were originally masculine names. "Avery" and "Aubrey" have transitioned from primarily masculine to primarily feminine in recent decades. If this matters to you—wanting a name that stays clearly associated with one gender—consider how recently it's gained popularity for other genders. Conversely, if you love the fluidity, enjoy being part of a name's evolution!
                  </p>
                  <p>
                    For families who know their child's biological sex but want to keep options open for their gender identity journey, gender-neutral middle names offer a built-in alternative. "Michael Sage Smith" provides both traditionally masculine and neutral options. This thoughtful approach signals support for your child's self-discovery while still giving them a name at birth. Our AI offers options across the gender spectrum, respecting diverse approaches to this personal decision!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🎪 The Pop Culture Effect</h3>
                  <p>
                    Pop culture's influence on names is powerful and sometimes unpredictable! The name "Arya" skyrocketed after Game of Thrones. "Bella" surged with Twilight. "Elsa" exploded (and then declined) with Frozen. While there's nothing wrong with being inspired by beloved characters, consider: will this association date your child's name to a specific era? Will it be obvious they were named after a character? How do you feel about that?
                  </p>
                  <p>
                    Some pop culture names transcend their origins and become classics—"Jessica" was popularized by Shakespeare, "Madison" became common after the movie Splash, yet both feel timeless now. Others remain strongly tied to their source. "Khaleesi" (a Game of Thrones title, not even a name!) clearly signals when those children were born and what their parents were watching. If you love a pop culture name, ask: would I still love this name without the association? Is the character aligned with values I want to inspire?
                  </p>
                  <p>
                    On the flip side, pop culture can rescue beautiful forgotten names from obscurity! "Charlotte" wasn't particularly popular until Princess Charlotte. "Atticus" was rare until To Kill a Mockingbird gained cultural prominence. If pop culture introduces you to a genuinely beautiful name you wouldn't have otherwise discovered, that's a lovely source of inspiration. Just be intentional about whether you're choosing the name because you love it intrinsically or only because of the association!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🔤 The Spelling Conundrum</h3>
                  <p>
                    Creative spellings ("Jaxxon" for Jackson, "Madyson" for Madison") divide parents into passionate camps. Supporters argue they make common names unique and allow personalization. Critics argue they create lifetime spelling corrections and look "try-hard" on professional documents. Both perspectives have merit! If you're considering alternative spelling, ask: does this spelling have cultural/linguistic legitimacy (like "Kathryn" vs "Catherine"), or is it purely for uniqueness?
                  </p>
                  <p>
                    Consider the "Starbucks test"—will your child spend their entire life spelling their name for baristas, teachers, doctors, and colleagues? Some people find this affirming (their unique spelling makes them special); others find it tedious. There's also the autocorrect factor—will every digital system try to "fix" the spelling? Will people assume it's a typo on official documents? These aren't dealbreakers, but they're quality-of-life considerations for your child!
                  </p>
                  <p>
                    If you love a name's sound but want uniqueness, consider maintaining traditional spelling while choosing a less common name entirely. "Eleanor" spelled traditionally is more distinctive than "Aydyn" (alternate spelling of popular Aiden). Our AI focuses on traditional spellings of both common and uncommon names, letting you decide whether creative spelling adds value for your specific situation!
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">🎯 Making the Final Decision</h3>
                  <p>
                    After all the research, discussions, and consideration, how do you actually decide? Many parents create a shortlist and live with the names for a while—saying them out loud, imagining calling them across a playground, picturing them on a graduation announcement. Some wait until meeting their baby to see which name "fits" their tiny personality. Others commit early and never waver. Trust your process!
                  </p>
                  <p>
                    If you and a partner are naming together, the negotiation requires communication and sometimes compromise. Some couples give each partner "veto power" (both must agree). Others take turns choosing first and middle names. Some create a shortlist together and let one partner make the final call. Whatever your process, remember you're on the same team, both wanting what's best for your child. The name you both love exists—keep communicating until you find it!
                  </p>
                  <p>
                    Here's permission you might need: it's okay to change your mind! If you name your baby and realize within days or weeks it doesn't feel right, most places allow name changes in the early months. It's also okay to use a different name than appears on the birth certificate—you might legally name them "Elizabeth" but call them "Eliza" exclusively. The birth certificate is a legal document; the name you call your child is a living choice. Give yourself grace in this important but ultimately loving decision!
                  </p>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/10 dark:to-pink-900/10 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                  <p className="text-sm italic text-foreground font-medium">
                    <strong>A Final Blessing:</strong> Whatever name you choose will become beloved because it's attached to your beloved child. The "perfect" name isn't perfect because of its sounds or meaning—it's perfect because you chose it with love, intention, and hope for the tiny human who will grow into it. Trust yourself. You're already doing this parenting thing beautifully by caring so deeply about this choice. Your baby is lucky to have such thoughtful parents! 💕👶
                  </p>
                </div>
              </CardContent>
            </Card>

          <Card>
            <CardHeader>
              <CardTitle>Choosing the Perfect Name</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>Here are some tips for selecting your baby's name:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Say it out loud:</strong> Make sure it sounds good with your last name</li>
                <li><strong>Consider nicknames:</strong> Think about potential shortened versions</li>
                <li><strong>Check initials:</strong> Ensure they don't spell something awkward</li>
                <li><strong>Think long-term:</strong> Will the name work for an adult too?</li>
                <li><strong>Cultural significance:</strong> Research the meaning and cultural background</li>
                <li><strong>Family input:</strong> Share favorites with loved ones</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  );
}
