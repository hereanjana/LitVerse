import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const clerkAppearance = {
  layout: {
    socialButtonsVariant: "button", 
    termsPageUrl: "/terms-of-service",
    privacyPageUrl: "/privacy-policy",
  },
  variables: {
    colorPrimary: "#482fb5", 
    colorBackground: "#3E3F5B", 
    colorText: "#fff", 
    fontFamily: "'Inter', sans-serif",
  },
  elements: {
    card: "shadow-lg rounded-xl p-6 bg-gray-900 border border-gray-700",
    headerTitle: "text-xl font-bold text-white",
    socialButtons: "cl-socialButtons",
    formFieldInput: "bg-blue-800 text-white rounded-lg px-4 py-2 border border-gray-600",
    submitButton: "bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg w-full",
  },
  hideDevelopmentMode: true,
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={clerkAppearance} afterSignOutUrl="/">
    <App /> 
    </ClerkProvider>
  </React.StrictMode>,
)