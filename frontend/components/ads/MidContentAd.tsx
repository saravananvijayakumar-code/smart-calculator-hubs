import AutoAdSlot from './AutoAdSlot';
import { ADS_CONFIG } from '../../config/ads';

interface MidContentAdProps {
  className?: string;
}

export default function MidContentAd({ className = '' }: MidContentAdProps) {
  return (
    <div className={`w-full my-6 ${className}`}>
      <div className="text-center">
        <div className="text-xs text-muted-foreground mb-2 opacity-70">Advertisement</div>
        <div className="w-full flex justify-center min-w-[300px]">
          <AutoAdSlot
            placement="mid-content"
            style={{ minHeight: '200px', maxHeight: '250px' }}
            className="opacity-95"
          />
        </div>
      </div>
    </div>
  );
}

export { MidContentAd };