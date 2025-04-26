import React, { useState } from 'react';
import Arweave from 'arweave';
import { useGoogleLogin } from '@react-oauth/google';
import { encryptEntry, decryptEntry, deriveKey } from '../services/encryptionService';
import { PasswordEntry } from '../types';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

const PasswordManager: React.FC = () => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [key, setKey] = useState<CryptoKey>();
  const [userId, setUserId] = useState<string>();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
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
      const entries = await Promise.all(txIds.map(async txId => {
        const data = await arweave.transactions.getData(txId, { decode: true, string: true });
        return decryptEntry(data.toString(), derivedKey);
      }));
      
      setPasswords(entries);
    }
  });

  async function savePassword(service: string, username: string, password: string) {
    if (!key || !userId) return;
    
    const encrypted = await encryptEntry({ service, username, password }, key);
    const transaction = await arweave.createTransaction({ data: encrypted });
    
    transaction.addTag('App-Name', 'password-manager');
    transaction.addTag('User-ID', userId);
    transaction.addTag('Content-Type', 'application/json');
    
    await arweave.transactions.sign(transaction);
    await arweave.transactions.post(transaction);
    
    setPasswords([...passwords, { service, username, password }]);
  }

  return (
    <div>
      <button onClick={() => handleGoogleLogin()}>Login with Google</button>
      {/* Add password form and display logic */}
    </div>
  );
}

export default PasswordManager;