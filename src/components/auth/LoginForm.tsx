@@ .. @@
 import React, { useState } from 'react';
-import { useNavigate, Link } from 'react-router-dom';
+import { useNavigate, Link, useLocation } from 'react-router-dom';
 import { useTranslation } from 'react-i18next';
 import { Mail, Lock, AlertCircle } from 'lucide-react';
 import { useAuth } from '../../context/AuthContext';
@@ .. @@
   const [isLoading, setIsLoading] = useState(false);
   const { t } = useTranslation();
   const navigate = useNavigate();
+  const location = useLocation();
+  
+  // Check if we have a success message from password reset
+  const searchParams = new URLSearchParams(location.search);
+  const successMessage = searchParams.get('success');

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
@@ .. @@
       <CardContent className="p-4 sm:p-6">
         {error && (
           <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-start">
             <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
             <span className="text-sm">{error}</span>
           </div>
         )}
+        
+        {successMessage && (
+          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg flex items-start">
+            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
+            <span className="text-sm">{successMessage}</span>
+          </div>
+        )}
         
         <form onSubmit={handleSubmit} className="space-y-4">
           <Input
@@ .. @@
             placeholder={t('auth.enterPassword')}
             required
             fullWidth
             leftIcon={<Lock className="h-4 w-4" />}
           />
           
+          <div className="flex justify-end">
+            <Link 
+              to="/forgot-password" 
+              className="text-sm text-primary-600 hover:text-primary-800 transition-colors duration-200"
+            >
+              Forgot password?
+            </Link>
+          </div>
+          
           <Button
             type="submit"
             variant="primary"