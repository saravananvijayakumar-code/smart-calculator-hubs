import type { IPLookupAnalysisData } from '../types';
import type { AnalysisResponse } from '../types';

export function generateIPLookupRecommendations(data: IPLookupAnalysisData): AnalysisResponse {
  const isIPv6 = data.ipVersion === 'IPv6';
  const recommendations: AnalysisResponse['recommendations'] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  keyInsights.push(
    `You are using ${data.ipVersion} with ${data.isp || 'your ISP'}${data.location ? ` in ${data.location}` : ''}`
  );

  if (!isIPv6) {
    keyInsights.push(
      'IPv4 addresses are becoming scarce. Your ISP likely rotates your IP periodically for efficient allocation'
    );
    
    recommendations.push({
      type: 'opportunity',
      priority: 'medium',
      title: 'Consider Enabling IPv6',
      description: 'IPv6 offers better performance, improved security features, and future-proof connectivity. Check if your ISP and router support IPv6.',
      actionItems: [
        'Contact your ISP to confirm IPv6 availability',
        'Check your router settings for IPv6 configuration',
        'Test IPv6 connectivity at test-ipv6.com',
        'Enable IPv6 in your device network settings'
      ],
      estimatedImpact: 'Improved connection stability and faster routing'
    });
  } else {
    keyInsights.push(
      'IPv6 provides enhanced security with built-in IPsec and a virtually unlimited address space'
    );
    
    recommendations.push({
      type: 'optimization',
      priority: 'low',
      title: 'IPv6 Enabled - Great Choice!',
      description: 'You\'re using the latest internet protocol standard. Ensure all your devices and services support IPv6 for optimal performance.',
      actionItems: [
        'Verify all network devices support IPv6',
        'Configure firewall rules for IPv6 traffic',
        'Monitor IPv6 connectivity regularly',
        'Use IPv6-compatible DNS servers (e.g., Google: 2001:4860:4860::8888)'
      ],
      estimatedImpact: 'Maximum network efficiency and future readiness'
    });
  }

  riskFactors.push(
    'Your IP address reveals your approximate location and ISP to every website you visit'
  );

  riskFactors.push(
    'Public Wi-Fi networks can expose your IP to potential attackers on the same network'
  );

  recommendations.push({
    type: 'warning',
    priority: 'high',
    title: 'Use a VPN for Privacy Protection',
    description: 'Your IP address can be used to track your online activity, approximate location, and potentially target you for attacks. A VPN encrypts your traffic and masks your real IP.',
    actionItems: [
      'Choose a reputable VPN provider (NordVPN, ExpressVPN, ProtonVPN, Surfshark)',
      'Enable VPN on all devices, especially on public Wi-Fi',
      'Configure VPN to auto-connect on untrusted networks',
      'Verify no DNS leaks using dnsleaktest.com',
      'Consider a VPN with kill switch feature for maximum protection'
    ],
    estimatedImpact: 'Significant improvement in privacy and security'
  });

  recommendations.push({
    type: 'optimization',
    priority: 'medium',
    title: 'Enable Firewall Protection',
    description: 'A properly configured firewall blocks unauthorized access attempts to your IP address and protects against common attacks.',
    actionItems: [
      'Enable built-in firewall on your router',
      'Activate Windows Defender Firewall or macOS Firewall',
      'Configure strict inbound rules (block all unsolicited connections)',
      'Allow only necessary applications through the firewall',
      'Regularly review firewall logs for suspicious activity'
    ],
    estimatedImpact: 'Enhanced protection against network attacks'
  });

  if (data.isp && data.isp.toLowerCase().includes('comcast')) {
    recommendations.push({
      type: 'opportunity',
      priority: 'low',
      title: 'Consider Alternative DNS Servers',
      description: 'Many ISPs log DNS queries. Using third-party DNS servers like Cloudflare (1.1.1.1) or Google (8.8.8.8) can improve privacy and potentially speed up web browsing.',
      actionItems: [
        'Change DNS to Cloudflare 1.1.1.1 for privacy',
        'Or use Google DNS 8.8.8.8 for reliability',
        'Configure DNS-over-HTTPS (DoH) for encrypted DNS queries',
        'Test DNS speed at dnsperf.com',
        'Set custom DNS on router for network-wide protection'
      ],
      estimatedImpact: 'Better privacy and potentially faster DNS resolution'
    });
  }

  keyInsights.push(
    'Your ISP can see all unencrypted traffic. Use HTTPS websites and consider a VPN for sensitive activities'
  );

  nextSteps.push(
    'Research and subscribe to a trusted VPN service for daily use'
  );

  nextSteps.push(
    'Enable your router and device firewalls with strict security rules'
  );

  nextSteps.push(
    'Check your IP regularly to ensure your VPN is working correctly'
  );

  if (!isIPv6) {
    nextSteps.push(
      'Contact your ISP about IPv6 availability and request activation'
    );
  }

  nextSteps.push(
    'Configure custom DNS servers (Cloudflare, Google, or Quad9) for better privacy'
  );

  const summary = isIPv6
    ? `You're connected via ${data.ipVersion} with ${data.isp || 'your ISP'}${data.location ? ` from ${data.location}` : ''}. You're using the modern internet protocol standard, which provides better security and performance. However, your IP still reveals your location and ISP to websites. We recommend using a VPN for enhanced privacy, especially on public networks, and ensuring your firewall is properly configured. ${data.isp ? 'Consider switching to privacy-focused DNS servers to prevent your ISP from logging all your web visits.' : ''}`
    : `You're connected via ${data.ipVersion} with ${data.isp || 'your ISP'}${data.location ? ` from ${data.location}` : ''}. While IPv4 is still widely used, upgrading to IPv6 offers better security and performance. Your IP address exposes your approximate location to every website you visit. We strongly recommend using a VPN to protect your privacy, especially on public Wi-Fi. Enable firewalls on all devices and consider privacy-focused DNS servers like Cloudflare (1.1.1.1) to prevent your ISP from tracking your browsing.`;

  return {
    summary,
    recommendations,
    keyInsights,
    riskFactors,
    nextSteps
  };
}
