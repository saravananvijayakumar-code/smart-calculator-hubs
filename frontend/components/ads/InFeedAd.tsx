import { AdsterraSlot } from './AdsterraSlot';

interface InFeedAdProps {
  className?: string;
}

export function InFeedAd({ className = '' }: InFeedAdProps) {
  return <AdsterraSlot position="middle" className={className} />;
}

export default InFeedAd;
