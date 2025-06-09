import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs"
import PostJob from './components/admin/PostJob'
import ProtectedRoute from './components/admin/ProtectedRoute'
import { ThemeProvider } from "./components/ThemeProvider"
import SavedJobs from './components/SavedJobs'
import Analytics from './components/admin/Analytics'
import ErrorBoundary from './components/ErrorBoundary'
import PrivacyPolicy from './components/legal/PrivacyPolicy'
import TermsOfService from './components/legal/TermsOfService'
import HelpCenter from './components/help/HelpCenter'
import AITools from './components/ai/AITools'
import AIResumeAnalyzer from './components/ai/AIResumeAnalyzer'
import AdminSettings from './components/admin/AdminSettings'
import { AIChatProvider } from './contexts/AIChatProvider'
import LiveChatBox from './components/help/LiveChatBox'
import AIErrorBoundary from './components/ai/AIErrorBoundary'
import Applicants from './components/admin/Applicants'
import NextChat from './pages/NextChat'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/signup',
    element: <Signup />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/jobs',
    element: <Jobs />
  },
  {
    path: '/description/:id',
    element: <JobDescription />
  },
  {
    path: '/browse',
    element: <Browse />
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/saved-jobs',
    element: <SavedJobs />
  },
  // Admin routes without layout wrapping
  {
    path: '/admin/analytics',
    element: <ProtectedRoute><Analytics /></ProtectedRoute>,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/admin/companies',
    element: <ProtectedRoute><Companies /></ProtectedRoute>,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/admin/companies/create',
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: '/admin/companies/:id',
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: '/admin/jobs',
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
  },
  {
    path: '/admin/jobs/create',
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: '/admin/jobs/:id/applicants',
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },
  {
    path: '/admin/settings',
    element: <ProtectedRoute><AdminSettings /></ProtectedRoute>
  },
  {
    path: '/admin/nextchat',
    element: <ProtectedRoute><NextChat /></ProtectedRoute>,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/ai-tools',
    element: <ProtectedRoute><AITools /></ProtectedRoute>,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'resume-analyzer',
        element: <AIResumeAnalyzer />,
      }
    ]
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/terms-of-service',
    element: <TermsOfService />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/help',
    element: <HelpCenter />,
    errorElement: <ErrorBoundary />
  }
]);

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="job-portal-theme">
      <AIChatProvider>
        <RouterProvider router={router} />
      </AIChatProvider>
    </ThemeProvider>
  );
}

export default App;