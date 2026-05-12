import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { USBanglaLogo } from '@/components/USBanglaLogo';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail } from 'lucide-react';
import loginHero from '@/assets/foodi-banner.png';

type LoginStep = 'credentials' | 'otp' | 'forgot-password' | 'email-sent';

export default function Login() {
  const navigate = useNavigate();
  const { setIsLoggedIn, setCurrentUser, setSelectedBranch, branches } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [step, setStep] = useState<LoginStep>('credentials');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  
  // Resend OTP timer
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    let hasError = false;
    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    }
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (hasError) return;

    // Auto-select the default company context and move to OTP step
    if (branches.length > 0) {
      setSelectedBranch(branches[0]);
    }
    setStep('otp');
    setResendTimer(60);
    setCanResend(false);
  };

  const handleResendOtp = () => {
    if (canResend) {
      setResendTimer(60);
      setCanResend(false);
      console.log('OTP resent to', email);
    }
  };

  const handleVerifyAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    // Auto-select the default company context silently
    if (branches.length > 0) {
      setSelectedBranch(branches[0]);
    }

    setIsLoggedIn(true);
    setCurrentUser({ email, name: email.split('@')[0] });
    navigate('/management/homepage');
  };

  const handleLoginWithAnotherAccount = () => {
    setStep('credentials');
    setOtp('');
    setPassword('');
    setError('');
    setEmailError('');
    setPasswordError('');
  };

  const handleForgotPassword = () => {
    setStep('forgot-password');
    setError('');
  };

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setStep('email-sent');
  };

  const handleBackToLogin = () => {
    setStep('credentials');
    setError('');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Login form */}
      <div className="w-full lg:w-[520px] lg:flex-none flex flex-col bg-background px-8 lg:px-10 py-12">
        <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="mb-12">
            <USBanglaLogo size="lg" />
          </div>
          
          {step === 'credentials' && (
            <div className="flex-1">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Login Information</h1>
                <p className="text-muted-foreground">Enter your e-mail address and password.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    className="h-12 border-border focus:border-primary"
                  />
                  {emailError && (
                    <p className="text-destructive text-sm">{emailError}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError('');
                      }}
                      className="h-12 border-border focus:border-primary pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-destructive text-sm">{passwordError}</p>
                  )}
                </div>

                <div className="pt-2">
                  <Button type="submit" className="h-11 px-8">
                    Login
                  </Button>
                </div>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:text-primary/80 underline"
                >
                  Forgot Password?
                </button>
              </form>
            </div>
          )}

          {step === 'otp' && (
            <div className="flex-1">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">OTP Verification</h1>
                <p className="text-muted-foreground">Enter your OTP to continue.</p>
              </div>

              <form onSubmit={handleVerifyAndLogin} className="space-y-5">

                <div className="space-y-2">
                  <Label htmlFor="otp">OTP Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(value);
                    }}
                    className="h-12 border-border focus:border-primary"
                    maxLength={6}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {canResend ? 'You can resend OTP now' : `Resend OTP in ${resendTimer}s`}
                    </span>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={!canResend}
                      className={`${canResend ? 'text-primary hover:text-primary/80 underline' : 'text-muted-foreground cursor-not-allowed'}`}
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-destructive text-sm">{error}</p>
                )}

                <Button type="submit" className="h-12 w-full">
                  Verify & Login
                </Button>

                <Button 
                  type="button" 
                  variant="secondary"
                  className="w-full h-12 bg-foreground text-background hover:bg-foreground/90"
                  onClick={handleLoginWithAnotherAccount}
                >
                  Login with Another Account
                </Button>
              </form>
            </div>
          )}

          {step === 'forgot-password' && (
            <div className="flex-1">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Forgot Password</h1>
                <p className="text-muted-foreground">Enter your email to receive a password reset link.</p>
              </div>

              <form onSubmit={handleSendResetLink} className="space-y-5">
                <div className="space-y-2">
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border-border focus:border-primary"
                  />
                </div>

                {error && (
                  <p className="text-destructive text-sm">{error}</p>
                )}

                <Button type="submit" className="h-11 px-8">
                  Send Reset Link
                </Button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-sm text-primary hover:text-primary/80 underline block"
                >
                  Back to Login
                </button>
              </form>
            </div>
          )}

          {step === 'email-sent' && (
            <div className="flex-1">
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-10 h-10 text-primary" />
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
                <p className="text-muted-foreground mb-2">
                  We've sent a password reset link to:
                </p>
                <p className="font-medium text-foreground mb-6">{email}</p>
                
                <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Note:</span> Click the link in your email to reset your password. 
                    If you don't see the email, check your spam folder.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate('/reset-password')}
                    className="h-11 w-full"
                  >
                    Open Reset Password (Demo)
                  </Button>

                  <Button 
                    onClick={() => setStep('forgot-password')}
                    variant="outline"
                    className="h-11 w-full"
                  >
                    Send Another Link
                  </Button>
                  
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-sm text-primary hover:text-primary/80 underline block text-center w-full"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Copyright */}
          <div className="mt-auto pt-8">
            <p className="text-sm text-muted-foreground">
              © Copyright by <span className="text-primary font-medium">Foodi 2026</span>. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Hero image */}
      <div className="hidden lg:block flex-1 relative bg-[#fdf5f3]">
        <img 
          src={loginHero} 
          alt="Foodi - Fast, Fresh & Right To Your Door" 
          className="absolute inset-0 w-full h-full object-contain object-center"
        />
      </div>
    </div>
  );
}
