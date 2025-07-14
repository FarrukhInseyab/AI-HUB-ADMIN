@@ .. @@
 import React, { createContext, useContext, useState, useEffect } from 'react';
 import { User } from '../types';
 import { supabase } from '../lib/supabase';
+import { sendSignupConfirmationEmail, sendPasswordResetEmail } from '../lib/emailService';

 type AuthContextType = {
   user: User | null;
   isLoading: boolean;
   login: (email: string, password: string) => Promise<void>;
   signup: (name: string, email: string, password: string, country?: string) => Promise<void>;
   logout: () => Promise<void>;
   refreshSession: () => Promise<void>;
+  resetPassword: (email: string) => Promise<void>;
 };

@@ .. @@
   const [user, setUser] = useState<User | null>(null);
   const [isLoading, setIsLoading] = useState(true);

+  // Generate a random reset token
+  const generateResetToken = (): string => {
+    return Math.random().toString(36).substring(2, 15) + 
+           Math.random().toString(36).substring(2, 15);
+  };
+
   useEffect(() => {
     let mounted = true;
     
@@ .. @@
       if (data.user && data.session) {
         await fetchUserProfile(data.user.id, data.user.email);
       } else if (data.user && !data.session) {
-        throw new Error('Please check your email to confirm your account');
+        // Send welcome email
+        await sendSignupConfirmationEmail(email, name);
+        throw new Error('Account created successfully. You can now log in.');
       }
     } catch (error) {
       throw error;
     }
   };

+  const resetPassword = async (email: string) => {
+    try {
+      // Generate a reset token
+      const resetToken = generateResetToken();
+      
+      // Store the reset token in the database with expiration
+      // This would typically be done in a password_reset_tokens table
+      // For this implementation, we'll use Supabase's built-in password reset
+      
+      const { error } = await supabase.auth.resetPasswordForEmail(email, {
+        redirectTo: `${window.location.origin}/reset-password`,
+      });
+      
+      if (error) throw error;
+      
+      // Send password reset email
+      await sendPasswordResetEmail(email, resetToken);
+      
+    } catch (error) {
+      throw error;
+    }
+  };
+
   const logout = async () => {
     try {
       const logoutPromise = supabase.auth.signOut();
@@ .. @@
   };

   return (
-    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, refreshSession }}>
+    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, refreshSession, resetPassword }}>
       {children}
     </AuthContext.Provider>
   );
 };