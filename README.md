# Arweave Password Manager

## Overview
The Arweave Password Manager is a web application that allows users to securely store and manage their passwords using the Arweave blockchain. It leverages Google OAuth for authentication and employs encryption to protect sensitive data.

## Features
- **Secure Password Storage**: Encrypts passwords before storing them on the Arweave blockchain.
- **Google Login**: Users can log in using their Google accounts for easy access.
- **Password Management**: Users can add, view, and manage their saved passwords.

## Project Structure
```
arweave-password-manager
├── public
│   ├── index.html          # Main HTML file
│   ├── favicon.svg         # Favicon for the application
│   └── robots.txt          # Instructions for web crawlers
├── src
│   ├── components          # React components
│   │   ├── PasswordForm.tsx
│   │   ├── PasswordList.tsx
│   │   └── PasswordManager.tsx
│   ├── services            # Services for interacting with Arweave and encryption
│   │   ├── arweaveService.ts
│   │   └── encryptionService.ts
│   ├── types               # TypeScript types and interfaces
│   │   └── index.ts
│   ├── App.tsx             # Main application component
│   ├── index.tsx           # Entry point for the React application
│   └── main.css            # Global styles
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # NPM configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Setup Instructions
1. **Clone the Repository**:
   ```
   git clone <repository-url>
   cd arweave-password-manager
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your API keys and other necessary configurations.

4. **Run the Application**:
   ```
   npm run dev
   ```

5. **Open in Browser**:
   Navigate to `http://localhost:3000` (or the port specified in your Vite configuration) to view the application.

## Usage
- **Login**: Click on "Login with Google" to authenticate.
- **Manage Passwords**: Use the provided forms to add and view your passwords.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.