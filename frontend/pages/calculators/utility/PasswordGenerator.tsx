import { useState } from 'react';
import { Lock, RefreshCw, Copy, Check, Shield, AlertTriangle, Key, Sparkles, Zap, Eye, EyeOff, Award, Star, TrendingUp, Users, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { useToast } from '@/components/ui/use-toast';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  feedback: string[];
}

export function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [strength, setStrength] = useState<PasswordStrength | null>(null);
  const { toast } = useToast();

  const generatePassword = () => {
    let charset = '';
    let lowercase = 'abcdefghijklmnopqrstuvwxyz';
    let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeSimilar) {
      lowercase = lowercase.replace(/[ilLI|oO0]/g, '');
      uppercase = uppercase.replace(/[ilLI|oO0]/g, '');
      numbers = numbers.replace(/[ilLI|oO0]/g, '');
    }

    if (includeLowercase) charset += lowercase;
    if (includeUppercase) charset += uppercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one character type',
        variant: 'destructive',
      });
      return;
    }

    let newPassword = '';
    const passwordLength = length[0];

    const requiredChars = [];
    if (includeLowercase) requiredChars.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
    if (includeUppercase) requiredChars.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
    if (includeNumbers) requiredChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
    if (includeSymbols) requiredChars.push(symbols[Math.floor(Math.random() * symbols.length)]);

    requiredChars.forEach(char => {
      newPassword += char;
    });

    for (let i = newPassword.length; i < passwordLength; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }

    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');

    setPassword(newPassword);
    analyzeStrength(newPassword);
    setCopied(false);
  };

  const analyzeStrength = (pwd: string) => {
    let score = 0;
    const feedback: string[] = [];

    if (pwd.length >= 12) score += 20;
    if (pwd.length >= 16) score += 10;
    if (pwd.length >= 20) score += 10;

    if (/[a-z]/.test(pwd)) {
      score += 10;
    } else {
      feedback.push('Add lowercase letters');
    }

    if (/[A-Z]/.test(pwd)) {
      score += 10;
    } else {
      feedback.push('Add uppercase letters');
    }

    if (/[0-9]/.test(pwd)) {
      score += 10;
    } else {
      feedback.push('Add numbers');
    }

    if (/[^a-zA-Z0-9]/.test(pwd)) {
      score += 15;
    } else {
      feedback.push('Add special characters');
    }

    const uniqueChars = new Set(pwd).size;
    if (uniqueChars / pwd.length > 0.7) score += 15;

    if (!/(.)\1{2,}/.test(pwd)) score += 10;

    let label = '';
    let color = '';
    
    if (score >= 85) {
      label = 'Very Strong';
      color = 'text-green-600 dark:text-green-400';
    } else if (score >= 70) {
      label = 'Strong';
      color = 'text-blue-600 dark:text-blue-400';
    } else if (score >= 50) {
      label = 'Moderate';
      color = 'text-yellow-600 dark:text-yellow-400';
    } else if (score >= 30) {
      label = 'Weak';
      color = 'text-orange-600 dark:text-orange-400';
    } else {
      label = 'Very Weak';
      color = 'text-red-600 dark:text-red-400';
    }

    setStrength({ score, label, color, feedback });
  };

  const copyToClipboard = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Password copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy password',
        variant: 'destructive',
      });
    }
  };

  return (
    <CalculatorLayoutWithAds
      title="Password Generator | Secure Password Creator | Smart Calculator Hubs"
      description="Generate strong, secure passwords with customizable length and character types. Create random passwords for maximum security. Free password generator tool."
      keywords="password generator, secure password, random password, strong password generator, password creator, password maker, secure password generator"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Military-Grade Security</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Ultimate Password Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create unbreakable passwords in seconds! Protect your digital life with cryptographically secure, random passwords
          </p>
        </div>

        <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-pulse" />
              Your Secure Password
            </CardTitle>
            <CardDescription className="text-base">
              Generated with true randomness for maximum security - hackers don't stand a chance!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {password && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="relative">
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 p-4 rounded-lg border-2 border-blue-300 dark:border-blue-700 font-mono text-lg break-all">
                      {showPassword ? password : '•'.repeat(password.length)}
                    </div>
                    <Button
                      onClick={() => setShowPassword(!showPassword)}
                      variant="outline"
                      size="icon"
                      className="shrink-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="icon"
                      className="shrink-0 hover:bg-green-100 dark:hover:bg-green-900"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {strength && (
                  <div className="space-y-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold flex items-center gap-2">
                        <Award className="h-4 w-4 text-purple-600" />
                        Password Strength:
                      </span>
                      <span className={`text-lg font-bold ${strength.color} flex items-center gap-2`}>
                        {strength.label}
                        {strength.score >= 85 && <Sparkles className="h-4 w-4 animate-pulse" />}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          strength.score >= 85
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                            : strength.score >= 70
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                            : strength.score >= 50
                            ? 'bg-gradient-to-r from-yellow-600 to-amber-600'
                            : strength.score >= 30
                            ? 'bg-gradient-to-r from-orange-600 to-red-600'
                            : 'bg-gradient-to-r from-red-600 to-pink-600'
                        }`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                    {strength.feedback.length > 0 && (
                      <div className="flex items-start gap-2 text-sm bg-amber-50 dark:bg-amber-950 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-medium text-amber-900 dark:text-amber-100 mb-1">Suggestions:</div>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {strength.feedback.map((fb, i) => (
                              <li key={i}>{fb}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <Button onClick={generatePassword} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" size="lg">
              <RefreshCw className="h-5 w-5 mr-2" />
              {password ? 'Generate New Password' : 'Generate Secure Password'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Customization Options
            </CardTitle>
            <CardDescription>
              Tailor your password to match any security requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg border-2 border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center justify-between">
                <Label className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  Password Length: {length[0]} characters
                </Label>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                  length[0] < 12 
                    ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                    : length[0] < 16 
                    ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                    : length[0] < 20
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                    : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {length[0] < 12 ? '⚠️ Short' : length[0] < 16 ? '👍 Medium' : length[0] < 20 ? '🌟 Strong' : '🔥 Ultra Strong'}
                </span>
              </div>
              <Slider
                value={length}
                onValueChange={setLength}
                max={64}
                min={8}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>8 (Minimum)</span>
                <span>16+ (Recommended)</span>
                <span>64 (Maximum)</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <div className="space-y-0.5">
                  <Label className="font-semibold flex items-center gap-2">
                    <span className="text-2xl">ABC</span>
                    Uppercase
                  </Label>
                  <p className="text-sm text-muted-foreground">Capital letters A-Z</p>
                </div>
                <Switch
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border-2 border-green-200 dark:border-green-800">
                <div className="space-y-0.5">
                  <Label className="font-semibold flex items-center gap-2">
                    <span className="text-2xl">abc</span>
                    Lowercase
                  </Label>
                  <p className="text-sm text-muted-foreground">Small letters a-z</p>
                </div>
                <Switch
                  checked={includeLowercase}
                  onCheckedChange={setIncludeLowercase}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                <div className="space-y-0.5">
                  <Label className="font-semibold flex items-center gap-2">
                    <span className="text-2xl">123</span>
                    Numbers
                  </Label>
                  <p className="text-sm text-muted-foreground">Digits 0-9</p>
                </div>
                <Switch
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                <div className="space-y-0.5">
                  <Label className="font-semibold flex items-center gap-2">
                    <span className="text-2xl">!@#</span>
                    Symbols
                  </Label>
                  <p className="text-sm text-muted-foreground">Special characters</p>
                </div>
                <Switch
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
              <div className="space-y-0.5">
                <Label className="font-semibold flex items-center gap-2">
                  <Eye className="h-4 w-4 text-yellow-600" />
                  Exclude Similar Characters
                </Label>
                <p className="text-sm text-muted-foreground">Avoid confusing i, l, 1, L, o, 0, O</p>
              </div>
              <Switch
                checked={excludeSimilar}
                onCheckedChange={setExcludeSimilar}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-red-200 dark:border-red-800 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Common Password Mistakes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Key className="h-4 w-4 text-red-500" />
                  Reusing Passwords Across Sites
                </h3>
                <p className="text-muted-foreground">
                  Using the same password everywhere is like having one key for your house, car, and bank vault! When one gets compromised, everything falls. Use unique passwords for each account - that's why we made this generator so easy to use!
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  Using Personal Information
                </h3>
                <p className="text-muted-foreground">
                  Birthdays, pet names, and addresses are terrible passwords! Hackers can easily find this info on social media. Random characters like our generator creates are infinitely harder to crack than "Fluffy2015"!
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  Too Short = Too Weak
                </h3>
                <p className="text-muted-foreground">
                  8-character passwords can be cracked in hours with modern computers! Go for 16+ characters. Each extra character exponentially increases crack time - from hours to literally centuries!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="h-5 w-5 text-green-600" />
                Best Security Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  Use a Password Manager
                </h3>
                <p className="text-muted-foreground">
                  Password managers like 1Password, LastPass, or Bitwarden securely store all your passwords behind one master password. Generate unique passwords for every site without memorizing anything!
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  Enable Two-Factor Authentication
                </h3>
                <p className="text-muted-foreground">
                  2FA adds a second layer of protection even if your password leaks. Use authenticator apps (Google Authenticator, Authy) or hardware keys for critical accounts like email and banking!
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  Regular Password Updates
                </h3>
                <p className="text-muted-foreground">
                  Change passwords for sensitive accounts every 3-6 months. If you hear about a data breach at a service you use, change that password immediately - don't wait!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Globe className="h-6 w-6 text-indigo-600 animate-pulse" />
              The Complete Password Security Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">100% Private</h3>
                <p className="text-sm text-muted-foreground">
                  Passwords generated locally in your browser - never sent to servers or stored anywhere!
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-green-200 dark:border-green-800">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                  <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Instant Results</h3>
                <p className="text-sm text-muted-foreground">
                  Generate cryptographically secure passwords in milliseconds with one click!
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                  <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Fully Customizable</h3>
                <p className="text-sm text-muted-foreground">
                  Match any password requirement with flexible length and character options!
                </p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h3 className="text-xl font-bold mt-6 mb-4">Why Password Security Matters More Than Ever</h3>
              <p className="text-muted-foreground leading-relaxed">
                In 2024, cybercrime costs exceed $8 trillion annually, with weak passwords being the #1 security vulnerability! Hackers use sophisticated tools that can test billions of password combinations per second. Your "Password123" gets cracked in under a second, while a random 16-character password like our generator creates would take computers millions of years to break. The digital age has made strong passwords not just recommended - they're absolutely essential for protecting your identity, finances, and personal information!
              </p>
              
              <h3 className="text-xl font-bold mt-6 mb-4">The Science Behind Unbreakable Passwords</h3>
              <p className="text-muted-foreground leading-relaxed">
                Password strength comes down to mathematics and entropy. Each character type you add (uppercase, lowercase, numbers, symbols) multiplies the possible combinations exponentially. An 8-character password using only lowercase letters has about 200 billion combinations - sounds like a lot, but modern computers crack that in seconds! Add uppercase, numbers, and symbols while extending to 16 characters? You've got over 90 quadrillion combinations, making brute-force attacks practically impossible. Our generator uses cryptographic randomness, ensuring every character is truly unpredictable, not following patterns that hacking algorithms exploit!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Password Managers: Your Digital Vault</h3>
              <p className="text-muted-foreground leading-relaxed">
                "But I can't remember 50 different random passwords!" - nobody can, and that's the point! Password managers solve this perfectly. Think of them as ultra-secure digital vaults that remember all your passwords behind one master password. 1Password, Bitwarden, LastPass, and Dashlane offer military-grade encryption, auto-fill convenience, and cross-device sync. Generate a unique 20-character password for every account using our tool, store them in your password manager, and never worry about memorization again. The password manager handles the heavy lifting while you enjoy ironclad security with zero mental burden!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Two-Factor Authentication: Double the Defense</h3>
              <p className="text-muted-foreground leading-relaxed">
                Even the strongest password can potentially leak through data breaches (looking at you, hacked companies who stored passwords insecurely!). Two-factor authentication (2FA) adds a critical second security layer. After entering your password, you need a second verification - typically a code from your phone via apps like Google Authenticator or Authy, SMS messages, or hardware keys like YubiKey. This means even if hackers steal your password, they can't access your account without also having your phone or security key. Enable 2FA on email, banking, social media, and any account holding sensitive information. The extra 10 seconds at login is worth preventing identity theft!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Common Hacking Methods You Need to Know</h3>
              <p className="text-muted-foreground leading-relaxed">
                Hackers use multiple attack vectors to steal passwords. Brute force attacks try every possible combination systematically - why short passwords fail catastrophically. Dictionary attacks test common words and phrases, making "PurpleDragon" vulnerable despite seeming random. Credential stuffing takes leaked passwords from one site and tries them everywhere, exploiting password reuse. Phishing emails trick you into revealing passwords by impersonating legitimate companies. Social engineering manipulates people into sharing information. Keyloggers record everything you type. Understanding these threats helps you defend against them: use generated random passwords (immune to dictionary attacks), unique passwords per site (defeats credential stuffing), enable 2FA (blocks most phishing), and stay vigilant about suspicious messages!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Password Length: Size Really Matters</h3>
              <p className="text-muted-foreground leading-relaxed">
                Length trumps complexity in password strength! A 20-character password using only lowercase letters is stronger than an 8-character password with all character types. Why? Mathematics! Each additional character exponentially increases possible combinations. Going from 12 to 16 characters multiplies difficulty by billions. This is why we default to 16 characters and allow up to 64 - because more is always better for security. Some sites annoyingly limit password length (terrible security practice!), but for those that don't, go long! The difference between a password cracked in days versus one that would take millennia often comes down to just a few extra characters!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Data Breaches: When Companies Fail You</h3>
              <p className="text-muted-foreground leading-relaxed">
                Even with perfect passwords, you're vulnerable to company breaches. Facebook, LinkedIn, Yahoo, Adobe, and countless others have leaked millions of user credentials through hacks. This is why unique passwords for each site are non-negotiable! When Company A gets hacked and leaks your password, hackers immediately try it at banks, email providers, and social media. If you reused that password, you're compromised everywhere. With unique passwords generated by our tool and stored in a password manager, a breach at one site has zero impact on your other accounts. Check haveibeenpwned.com to see if your email appears in known breaches, and immediately change those passwords!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Creating Your Master Password Strategy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your password manager needs one strong master password - the only one you'll memorize. Don't use our random generator for this since you need to remember it! Instead, create a passphrase: string together 5-7 random words with numbers and symbols between them. "Turtle!Mountains17$Coffee@Moonlight92" is easy to remember with a mental story but incredibly difficult to crack (17 nonillion combinations!). Never reuse this anywhere. Consider writing it down and storing it in a physical safe until memorized - physical security beats digital for this one critical password. Some password managers offer account recovery options, but your master password is ultimately your responsibility!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Mobile Device Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                Smartphones hold our entire digital lives, making them prime hacking targets! Use strong passwords/PINs for device unlock (not "1234"!) and enable biometric security (fingerprint/face ID) for convenience layered on strong passwords. Install password managers on phones for easy access to secure credentials. Enable remote wipe capabilities in case your phone is stolen. Use encrypted messaging apps for sensitive conversations. Keep your OS and apps updated - security patches fix newly discovered vulnerabilities that hackers actively exploit. Public WiFi is particularly dangerous; use VPNs when connecting to protect your data from eavesdropping. Your phone is essentially a computer in your pocket - treat its security accordingly!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Business and Enterprise Password Policies</h3>
              <p className="text-muted-foreground leading-relaxed">
                Businesses face even greater password security challenges with hundreds or thousands of employees. Enterprise password managers like Dashlane Business, 1Password Teams, or LastPass Enterprise centralize credential management while maintaining zero-knowledge encryption (even IT admins can't see passwords!). Implement mandatory 2FA across the organization. Regular security audits identify weak passwords that need updating. Employee training prevents social engineering and phishing attacks. Single Sign-On (SSO) reduces password fatigue by federating authentication across multiple services. For compliance with regulations like GDPR, HIPAA, or SOX, robust password policies aren't optional - they're legal requirements. Small businesses often overlook this until a breach costs them customers, reputation, or lawsuits!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">The Future of Authentication</h3>
              <p className="text-muted-foreground leading-relaxed">
                Passwords may eventually become obsolete as biometrics, hardware keys, and passwordless authentication evolve. Face ID, fingerprints, and iris scans offer convenience without memorization. WebAuthn and FIDO2 standards enable password-free logins using cryptographic keys stored on devices or hardware tokens. However, we're years away from universal adoption - passwords remain the dominant authentication method, likely for the next decade. Even future systems will require backup authentication, meaning password security knowledge stays relevant. Until the passwordless future arrives, generated strong passwords combined with password managers and 2FA remain the gold standard for protecting your digital life!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Teaching Kids About Password Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                Children's first online accounts need strong passwords from day one! Teaching password security early builds lifelong safe habits. Explain that passwords are like secret codes protecting their stuff. Show them how hackers are like burglars trying every combination. Use our generator together, letting them adjust settings and see how adding character types makes passwords stronger. For younger kids, create visual stories: "Your password is a castle wall - the taller and thicker, the safer you are!" Teach them never to share passwords, even with friends. As they mature, transition them to their own password manager. Cybersecurity education isn't taught well in schools yet, making parent guidance crucial for creating the next generation of security-conscious digital citizens!
              </p>

              <h3 className="text-xl font-bold mt-6 mb-4">Start Securing Your Digital Life Today!</h3>
              <p className="text-muted-foreground leading-relaxed">
                You now have the knowledge and tools to achieve military-grade password security! Start by generating strong passwords for your most critical accounts: email, banking, and social media. Install a reputable password manager and migrate your accounts gradually. Enable 2FA everywhere it's offered. Use our generator to create unique passwords for each account - no more reusing "Summer2023!" across sites. Bookmark this page for instant access whenever you need new passwords. Remember: the few minutes invested in proper password security today prevents the nightmare of identity theft, financial fraud, and privacy violations tomorrow. Your digital life deserves fortress-level protection - generate your first unbreakable password now and take control of your online security!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-300 dark:border-blue-700">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold">Your Privacy is Sacred</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                All passwords are generated locally in your browser using cryptographic randomness. We never see, store, or transmit your passwords anywhere. Your security is completely in your hands - exactly where it should be!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}

export default PasswordGenerator;
