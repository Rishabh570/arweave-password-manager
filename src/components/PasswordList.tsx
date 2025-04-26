import React from 'react';

interface PasswordEntry {
  service: string;
  username: string;
  password: string;
}

interface PasswordListProps {
  passwords: PasswordEntry[];
}

const PasswordList: React.FC<PasswordListProps> = ({ passwords }) => {
  return (
    <div>
      <h2>Saved Passwords</h2>
      <ul>
        {passwords.map((entry, index) => (
          <li key={index}>
            <strong>{entry.service}</strong>: {entry.username} - {entry.password}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordList;