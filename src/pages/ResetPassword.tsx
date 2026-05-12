import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { USBanglaLogo } from '@/components/USBanglaLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Plane, CheckCircle2 } from 'lucide-react';
import foodiLogo from '@/assets/foodi-logo.png';

type ResetStep = 'reset-form' | 'success';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [step, setStep] = useState<ResetStep>('reset-form');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return { minLength, hasUppercase, hasLowercase, hasNumber, hasSpecial };
  };

  const passwordChecks = validatePassword(newPassword);
  const allChecksPass = Object.values(passwordChecks).every(Boolean);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!allChecksPass) {
      setError('Password does not meet requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Simulate password reset
    setStep('success');
  };

  const handleGoToLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Reset Password form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12">
        <div className="max-w-md w-full mx-auto">
          <USBanglaLogo size="lg" className="mb-10" />
          
          {step === 'reset-form' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Reset Password</h1>
                <p className="text-muted-foreground">Create a new password for your account.</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-12 border-primary/30 focus:border-primary pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 border-primary/30 focus:border-primary pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Password requirements */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-foreground mb-2">Password must contain:</p>
                  <div className="grid grid-cols-1 gap-1.5 text-sm">
                    <PasswordCheck passed={passwordChecks.minLength} text="At least 8 characters" />
                    <PasswordCheck passed={passwordChecks.hasUppercase} text="One uppercase letter" />
                    <PasswordCheck passed={passwordChecks.hasLowercase} text="One lowercase letter" />
                    <PasswordCheck passed={passwordChecks.hasNumber} text="One number" />
                    <PasswordCheck passed={passwordChecks.hasSpecial} text="One special character" />
                  </div>
                </div>

                {error && (
                  <p className="text-destructive text-sm">{error}</p>
                )}

                <Button type="submit" className="h-11 w-full" disabled={!allChecksPass}>
                  Reset Password
                </Button>

                <button
                  type="button"
                  onClick={handleGoToLogin}
                  className="text-sm text-primary hover:text-primary/80 underline block text-center w-full"
                >
                  Back to Login
                </button>
              </form>
            </>
          )}

          {step === 'success' && (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-foreground mb-2">Password Reset Successful!</h1>
              <p className="text-muted-foreground mb-8">
                Your password has been reset successfully. You can now login with your new password.
              </p>

              <Button onClick={handleGoToLogin} className="h-11 px-8">
                Go to Login
              </Button>
            </div>
          )}

          <div className="mt-auto pt-16">
            <p className="text-sm text-muted-foreground">
              © Copyright by <span className="text-primary font-medium">Foodi 2026</span>. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Foodi branded panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-b from-[#1e3a8a] via-[#2563eb] to-[#60a5fa]">
        {/* Animated clouds */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 blur-2xl animate-pulse"
              style={{
                width: `${150 + i * 50}px`,
                height: `${80 + i * 30}px`,
                left: `${(i * 20) % 100}%`,
                top: `${60 + (i * 10) % 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`,
              }}
            />
          ))}
        </div>

        {/* Flying planes animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute"
            style={{
              top: '20%',
              animation: 'flyAcross 12s linear infinite',
            }}
          >
            <Plane className="w-8 h-8 text-white/40 rotate-45" />
          </div>
          <div
            className="absolute"
            style={{
              top: '45%',
              animation: 'flyAcross 18s linear infinite',
              animationDelay: '4s',
            }}
          >
            <Plane className="w-6 h-6 text-white/30 rotate-45" />
          </div>
          <div
            className="absolute"
            style={{
              top: '75%',
              animation: 'flyAcross 15s linear infinite',
              animationDelay: '8s',
            }}
          >
            <Plane className="w-10 h-10 text-white/25 rotate-45" />
          </div>
        </div>

        <style>{`
          @keyframes flyAcross {
            0% { left: -50px; }
            100% { left: calc(100% + 50px); }
          }
        `}</style>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-center">
          <div className="mb-8">
            <img 
              src={foodiLogo} 
              alt="Foodi" 
              className="w-48 h-auto drop-shadow-2xl"
            />
          </div>

          <h2 className="text-4xl font-bold text-white tracking-wide drop-shadow-lg mb-4">
            FOODI
          </h2>

          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent mb-6" />

          <p className="text-2xl text-white/90 font-semibold italic drop-shadow-md mb-8">
            "Fly Fast, Fly Safe"
          </p>

          <div className="flex items-center gap-4 text-white/60">
            <div className="w-12 h-px bg-white/40" />
            <Plane className="w-5 h-5" />
            <div className="w-12 h-px bg-white/40" />
          </div>

          <p className="mt-8 text-white/70 text-sm tracking-widest uppercase">
            Enterprise Resource Planning System
          </p>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-24 fill-white/10">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

function PasswordCheck({ passed, text }: { passed: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 ${passed ? 'text-green-600' : 'text-muted-foreground'}`}>
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passed ? 'bg-green-600' : 'bg-muted'}`}>
        {passed && <CheckCircle2 className="w-3 h-3 text-white" />}
      </div>
      <span>{text}</span>
    </div>
  );
}
