import { useEffect } from 'react';

export default function AmazonAutoAds() {
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = '//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US';
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      amzn_assoc_placement = "adunit0";
      amzn_assoc_tracking_id = "smartcalculat-20";
      amzn_assoc_ad_mode = "auto";
      amzn_assoc_ad_type = "smart";
      amzn_assoc_marketplace = "amazon";
      amzn_assoc_region = "US";
      amzn_assoc_linkid = "auto";
      amzn_assoc_search_bar = "false";
      amzn_assoc_default_category = "All";
    `;
    document.body.appendChild(script2);

    const script3 = document.createElement('script');
    script3.src = '//z-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&Operation=GetScript&ID=OneJS&WS=1';
    script3.async = true;
    document.body.appendChild(script3);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
      document.body.removeChild(script3);
    };
  }, []);

  return null;
}
