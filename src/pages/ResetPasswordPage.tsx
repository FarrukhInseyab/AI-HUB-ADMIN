import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LanguageToggle from '../components/ui/LanguageToggle';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Get token from URL
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (password) {
      validatePassword(password);
    } else {
      setPasswordErrors([]);
    }
  }, [password]);

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('At least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('One lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('One number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('One special character');
    }
    
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!validatePassword(password)) {
      setError('Please fix the password requirements below');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // For this implementation, we'll use Supabase's built-in password reset
      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) throw error;
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 safe-area-inset-top safe-area-inset-bottom">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <p className="text-center text-base sm:text-lg text-white font-medium">
          Admin Portal
        </p>
      </div>
      
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-500 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold text-center text-white flex-1">
                Reset Your Password
              </h2>
              <LanguageToggle />
            </div>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            {success ? (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Password reset successful!</p>
                  <p className="text-sm mt-1">You will be redirected to the login page shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-teal-700">
                    Please enter your new password below.
                  </p>
                </div>
                
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                    fullWidth
                    leftIcon={<Lock className="h-4 w-4" />}
                    error={passwordErrors.length > 0 ? 'Password requirements not met' : undefined}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {password && passwordErrors.length > 0 && (
                  <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm font-medium text-amber-800 mb-2">Password must include:</p>
                    <ul className="text-sm text-amber-700 space-y-1">
                      {passwordErrors.map((error, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 flex-shrink-0"></span>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    required
                    fullWidth
                    leftIcon={<Lock className="h-4 w-4" />}
                    error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                  className="mt-6"
                  disabled={!password || !confirmPassword || password !== confirmPassword || passwordErrors.length > 0}
                >
                  Reset Password
                </Button>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center bg-gray-50 p-4 sm:p-6">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link 
                to="/login" 
                className="text-primary-600 hover:text-primary-800 font-medium transition-colors duration-200"
              >
                Back to Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;