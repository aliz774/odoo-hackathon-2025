import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { OdooAPI } from '@/lib/odoo-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Shield, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p) => /\d/.test(p) },
  { label: 'One special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordStrength = useMemo(() => {
    const passedRequirements = passwordRequirements.filter(req => req.test(password)).length;
    if (passedRequirements === 0) return { level: 'none', percentage: 0, color: 'bg-muted' };
    if (passedRequirements <= 1) return { level: 'weak', percentage: 25, color: 'bg-destructive' };
    if (passedRequirements <= 2) return { level: 'medium', percentage: 50, color: 'bg-yellow-500' };
    if (passedRequirements <= 3) return { level: 'good', percentage: 75, color: 'bg-blue-500' };
    return { level: 'strong', percentage: 100, color: 'bg-green-500' };
  }, [password]);

  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  const isFormValid = 
    fullName.trim() !== '' && 
    email.trim() !== '' && 
    passwordStrength.level === 'strong' && 
    passwordsMatch;

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        toast.info("Registering Account...");
        const sessionUid = await OdooAPI.register(fullName, email, password);
        
        if (sessionUid) {
            toast.success("Account Created! Logging you in...");
            const DB = 'gearguard';
            localStorage.setItem('gearguard_session', JSON.stringify({ uid: sessionUid, email, db: DB, password }));
            navigate('/dashboard');
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Registration Failed. Check if email exists.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">GearGuard</span>
          </div>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        {/* Sign Up Card */}
        <div className="enterprise-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Password strength</span>
                      <span className={cn(
                        'font-medium capitalize',
                        passwordStrength.level === 'weak' && 'text-destructive',
                        passwordStrength.level === 'medium' && 'text-yellow-600',
                        passwordStrength.level === 'good' && 'text-blue-600',
                        passwordStrength.level === 'strong' && 'text-green-600'
                      )}>
                        {passwordStrength.level}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn('h-full transition-all duration-300', passwordStrength.color)}
                        style={{ width: `${passwordStrength.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="grid grid-cols-2 gap-2">
                    {passwordRequirements.map((req, index) => {
                      const passed = req.test(password);
                      return (
                        <div key={index} className="flex items-center gap-1.5 text-xs">
                          {passed ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                          <span className={cn(
                            passed ? 'text-green-600' : 'text-muted-foreground'
                          )}>
                            {req.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(
                    'h-11 pr-11',
                    confirmPassword && (passwordsMatch 
                      ? 'border-green-500 focus-visible:ring-green-500' 
                      : 'border-destructive focus-visible:ring-destructive')
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full h-11"
              disabled={!isFormValid}
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
