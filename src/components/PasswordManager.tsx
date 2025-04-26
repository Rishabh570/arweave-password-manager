import React, { useState } from 'react';
import Arweave from 'arweave';
import { useGoogleLogin } from '@react-oauth/google';
import { encryptEntry, decryptEntry, deriveKey } from '../services/encryptionService';
import { PasswordEntry } from '../types';
import PasswordForm from './PasswordForm';
import PasswordList from './PasswordList';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

const PasswordManager: React.FC = () => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        setIsLoading(true);
        setError(null);
        
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${credentialResponse.access_token}` }
        }).then(res => res.json());
        
        const derivedKey = await deriveKey(userInfo.sub);
        setKey(derivedKey);
        setUserId(userInfo.sub);

        // Query Arweave for existing passwords
        const query = {
          op: 'and',
          expr1: { op: 'equals', expr1: 'App-Name', expr2: 'password-manager' },
          expr2: { op: 'equals', expr1: 'User-ID', expr2: userInfo.sub }
        };
        
        const txIds = await arweave.api.post('arql', query).then(res => res.data);
        
        if (txIds && txIds.length > 0) {
          const entries = await Promise.all(txIds.map(async (txId: string) => {
            const data = await arweave.transactions.getData(txId, { decode: true, string: true });
            return decryptEntry(data.toString(), derivedKey);
          }));
          
          setPasswords(entries);
        }
      } catch (err) {
        console.error("Error during login:", err);
        setError("Failed to login. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      setError("Google login failed. Please try again.");
    }
  });

  const handleSavePassword = async (service: string, username: string, password: string) => {
    if (!key || !userId) return;
    
    try {
      setIsLoading(true);
      
      const passwordEntry: PasswordEntry = {
        service,
        username,
        password,
        createdAt: new Date()
      };
      
      const encrypted = await encryptEntry(passwordEntry, key);
      const transaction = await arweave.createTransaction({ data: encrypted });
      
      transaction.addTag('App-Name', 'password-manager');
      transaction.addTag('User-ID', userId);
      transaction.addTag('Content-Type', 'application/json');
      
      await arweave.transactions.sign(transaction);
      await arweave.transactions.post(transaction);
      
      setPasswords([...passwords, passwordEntry]);
    } catch (err) {
      console.error("Error saving password:", err);
      setError("Failed to save password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Arweave Password Manager</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {!userId ? (
        <div className="login-section">
          <p>Please log in to manage your passwords</p>
          <button 
            onClick={() => handleGoogleLogin()} 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login with Google'}
          </button>
        </div>
      ) : (
        <div className="password-manager-content">
          <h2>Add New Password</h2>
          <PasswordForm onSave={handleSavePassword} />
          
          {passwords.length > 0 ? (
            <PasswordList passwords={passwords} />
          ) : (
            <p>No saved passwords yet. Add your first one above!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordManager;