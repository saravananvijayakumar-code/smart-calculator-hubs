
import { ExternalLink, Award, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AffiliateBannerProps {
  type: 'canva-resume' | 'canva-design' | 'amazon-ai' | 'amazon-writing' | 'amazon-productivity' | 'amazon-networking' | 'amazon-tools' | 'amazon-parenting' | 'amazon-wellness' | 'amazon-shopping';
  className?: string;
}

export function AffiliateBanner({ type, className = '' }: AffiliateBannerProps) {
  const banners = {
    'canva-resume': {
      title: 'Create Stunning Resumes with Canva Pro',
      description: 'Access 1000+ professional resume templates, customize with ease, and stand out from the crowd.',
      cta: 'Try Canva Pro Free',
      link: 'https://www.canva.com/templates/resumes/',
      gradient: 'from-purple-600 to-pink-600',
      icon: Award
    },
    'canva-design': {
      title: 'Design Professional Documents',
      description: 'Create beautiful cover letters, portfolios, and presentations with Canva Pro.',
      cta: 'Start Designing Free',
      link: 'https://www.canva.com/',
      gradient: 'from-blue-600 to-purple-600',
      icon: Zap
    },
    'amazon-career': {
      title: 'Top Career Development Books',
      description: 'Bestselling books on interviewing, resume writing, and career advancement from Amazon.',
      cta: 'Browse Books',
      link: 'https://www.amazon.com/s?k=career+development+books&tag=smartcalcul00-20',
      gradient: 'from-orange-600 to-yellow-600',
      icon: Award
    },
    'amazon-ai': {
      title: 'AI & Machine Learning Books',
      description: 'Master artificial intelligence with top-rated books on AI, ML, and deep learning.',
      cta: 'Explore AI Books',
      link: 'https://www.amazon.com/s?k=artificial+intelligence+books&tag=smartcalcul00-20',
      gradient: 'from-blue-600 to-indigo-600',
      icon: Zap
    },
    'amazon-writing': {
      title: 'Professional Writing & Communication',
      description: 'Improve your writing skills with bestselling books on business communication and copywriting.',
      cta: 'View Writing Books',
      link: 'https://www.amazon.com/s?k=professional+writing+books&tag=smartcalcul00-20',
      gradient: 'from-purple-600 to-pink-600',
      icon: Award
    },
    'amazon-productivity': {
      title: 'Productivity & Time Management',
      description: 'Boost your efficiency with top books on productivity, focus, and time management.',
      cta: 'Browse Productivity',
      link: 'https://www.amazon.com/s?k=productivity+books&tag=smartcalcul00-20',
      gradient: 'from-green-600 to-teal-600',
      icon: Zap
    },
    'amazon-networking': {
      title: 'Networking & Professional Skills',
      description: 'Build powerful connections with bestselling books on networking and relationship building.',
      cta: 'Explore Networking',
      link: 'https://www.amazon.com/s?k=networking+professional+skills&tag=smartcalcul00-20',
      gradient: 'from-indigo-600 to-blue-600',
      icon: Award
    },
    'amazon-tools': {
      title: 'Tech Tools & Gadgets',
      description: 'Discover essential tools and tech gadgets to enhance your productivity and workflow.',
      cta: 'Shop Tech Tools',
      link: 'https://www.amazon.com/s?k=productivity+tech+tools&tag=smartcalcul00-20',
      gradient: 'from-gray-700 to-gray-900',
      icon: Zap
    },
    'amazon-parenting': {
      title: 'Parenting & Child Development',
      description: 'Expert advice and bestselling books on parenting, child psychology, and family life.',
      cta: 'Browse Parenting',
      link: 'https://www.amazon.com/s?k=parenting+books&tag=smartcalcul00-20',
      gradient: 'from-pink-600 to-rose-600',
      icon: Award
    },
    'amazon-wellness': {
      title: 'Health & Wellness Essentials',
      description: 'Top-rated books and products for fitness, nutrition, mental health, and overall wellness.',
      cta: 'Explore Wellness',
      link: 'https://www.amazon.com/s?k=health+wellness+books&tag=smartcalcul00-20',
      gradient: 'from-emerald-600 to-green-600',
      icon: Zap
    },
    'amazon-shopping': {
      title: 'Smart Shopping Recommendations',
      description: 'Find the best deals on highly-rated products across all categories on Amazon.',
      cta: 'Start Shopping',
      link: 'https://www.amazon.com/gp/bestsellers/?tag=smartcalcul00-20',
      gradient: 'from-amber-600 to-orange-600',
      icon: Award
    },
    'udemy-career': {
      title: 'Master Your Career Skills',
      description: 'Learn interview techniques, resume writing, and professional development from expert instructors.',
      cta: 'Explore Courses',
      link: 'https://www.udemy.com/topic/career-development/',
      gradient: 'from-indigo-600 to-purple-600',
      icon: Zap
    }
  };

  const banner = banners[type];
  const Icon = banner.icon;

  return (
    <div className={className}>
      <Card className="overflow-hidden shadow-xl border-2 border-purple-200 dark:border-purple-800 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
        <div className={`bg-gradient-to-r ${banner.gradient} p-6`}>
          <CardContent className="p-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5 text-white" />
                  <span className="text-xs font-semibold text-white bg-white/20 px-2 py-1 rounded-full">
                    RECOMMENDED
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {banner.title}
                </h3>
                <p className="text-white/90 text-sm mb-4">
                  {banner.description}
                </p>
                <a
                  href={banner.link}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-block"
                >
                  <Button
                    variant="secondary"
                    className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                  >
                    {banner.cta}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Disclosure:</span> This is an affiliate link. We may earn a commission at no extra cost to you.
          </p>
        </div>
      </Card>
    </div>
  );
}
