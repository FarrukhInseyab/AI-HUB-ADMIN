import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LanguageToggle from '../components/ui/LanguageToggle';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setIsLoading(true);
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send password reset email');
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
                Reset Password
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
                  <p className="text-sm font-medium">Password reset email sent!</p>
                  <p className="text-sm mt-1">Please check your email for instructions to reset your password.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-teal-700">
                    Enter your email address below and we'll send you instructions to reset your password.
                  </p>
                </div>
                
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  fullWidth
                  leftIcon={<Mail className="h-4 w-4" />}
                />
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                  className="mt-6"
                  disabled={!email.trim()}
                >
                  Send Reset Instructions
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

export default ForgotPasswordPage;