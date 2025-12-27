import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { toast } from 'sonner';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  
  // Mock email from location state or default
  const email = location.state?.email || 'user@example.com';

  useEffect(() => {
    // Timer for resend OTP
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (otp === '123456') {
        toast.success('Email verified successfully!');
        navigate('/');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    }, 1500);
  };

  const handleResend = () => {
    setTimeLeft(30);
    toast.success('New OTP sent to your email');
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
          <h1 className="text-2xl font-semibold mb-2">Verify your email</h1>
          <p className="text-muted-foreground">
            We've sent a verification code to <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        {/* Verify Card */}
        <div className="enterprise-card p-8">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={otp.length !== 6 || isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground mb-2">Didn't receive the code?</p>
            {timeLeft > 0 ? (
              <span className="text-muted-foreground">Resend in {timeLeft}s</span>
            ) : (
              <button
                onClick={handleResend}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
                type="button"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
