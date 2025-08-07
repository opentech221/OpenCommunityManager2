import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';

// Lazy loading pour l'optimisation du bundle
const GuidancePage = lazy(() => import('./pages/GuidancePage'));
const DiagnosticPage = lazy(() => import('./pages/DiagnosticPage'));
const RecommendationsPage = lazy(() => import('./pages/RecommendationsPage'));
const CompliancePage = lazy(() => import('./pages/CompliancePage'));
const ActionPlanPage = lazy(() => import('./pages/ActionPlanPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const MembersPage = lazy(() => import('./pages/MembersPage'));
const CotisationsPageResponsive = lazy(() => import('./pages/CotisationsPageResponsive'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const FinancesPage = lazy(() => import('./pages/FinancesPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const MessagesDemo = lazy(() => import('./pages/MessagesDemo').then(module => ({ default: module.MessagesDemo })));
const WhatsAppMessagesPageAdvanced = lazy(() => import('./pages/WhatsAppMessagesPageAdvanced').then(module => ({ default: module.WhatsAppMessagesPageAdvanced })));
const PublicProfilePage = lazy(() => import('./pages/PublicProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const SecurityPage = lazy(() => import('./pages/SecurityPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const LegalPage = lazy(() => import('./pages/LegalPage').then(module => ({ default: module.LegalPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(module => ({ default: module.TermsPage })));
const HelpPage = lazy(() => import('./pages/HelpPage').then(module => ({ default: module.HelpPage })));
const DocumentationPage = lazy(() => import('./pages/DocumentationPage').then(module => ({ default: module.DocumentationPage })));
import { ContactPage } from './pages/ContactPage';
import { TrainingPage } from './pages/TrainingPage';
import { DemoPage } from './pages/DemoPage';
import { PublicLayout } from './components/PublicLayout';
import { AppLayout } from './components/AppLayout';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement...</p>
            </div>
          </div>
        }>
          <Routes>
          {/* Pages publiques avec PublicLayout */}
          <Route path="/" element={
            <PublicLayout>
              <LandingPage />
            </PublicLayout>
          } />
          
          <Route path="/login" element={
            <PublicLayout showBreadcrumb={true} currentPage="Connexion" backTo="/">
              <LoginPage />
            </PublicLayout>
          } />
          
          <Route path="/register" element={
            <PublicLayout showBreadcrumb={true} currentPage="Inscription" backTo="/">
              <RegisterPage />
            </PublicLayout>
          } />
          
          {/* Pages légales et support avec PublicLayout */}
          <Route path="/legal" element={
            <PublicLayout showBreadcrumb={true} currentPage="Mentions légales" backTo="/">
              <LegalPage />
            </PublicLayout>
          } />
          
          <Route path="/privacy" element={
            <PublicLayout showBreadcrumb={true} currentPage="Politique de confidentialité" backTo="/">
              <PrivacyPage />
            </PublicLayout>
          } />
          
          <Route path="/terms" element={
            <PublicLayout showBreadcrumb={true} currentPage="Conditions d'utilisation" backTo="/">
              <TermsPage />
            </PublicLayout>
          } />
          
          <Route path="/help" element={
            <PublicLayout showBreadcrumb={true} currentPage="Aide" backTo="/">
              <HelpPage />
            </PublicLayout>
          } />
          
          <Route path="/documentation" element={
            <PublicLayout showBreadcrumb={true} currentPage="Documentation" backTo="/">
              <DocumentationPage />
            </PublicLayout>
          } />
          
          <Route path="/contact" element={
            <PublicLayout showBreadcrumb={true} currentPage="Contact" backTo="/">
              <ContactPage />
            </PublicLayout>
          } />
          
          <Route path="/training" element={
            <PublicLayout showBreadcrumb={true} currentPage="Formation" backTo="/">
              <TrainingPage />
            </PublicLayout>
          } />
          
          <Route path="/demo" element={
            <PublicLayout showBreadcrumb={true} currentPage="Démo" backTo="/">
              <DemoPage />
            </PublicLayout>
          } />

          {/* Pages protégées avec AppLayout */}
          <Route path="/dashboard" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <DashboardPage />
            </AppLayout>
          } />

          <Route path="/guidance" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <GuidancePage />
            </AppLayout>
          } />

          <Route path="/guidance/diagnostic" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <DiagnosticPage />
            </AppLayout>
          } />

          <Route path="/guidance/recommendations" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <RecommendationsPage />
            </AppLayout>
          } />

          <Route path="/guidance/compliance" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <CompliancePage />
            </AppLayout>
          } />

          <Route path="/guidance/action-plan" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <ActionPlanPage />
            </AppLayout>
          } />

          <Route path="/guidance/analytics" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <AnalyticsPage />
            </AppLayout>
          } />

          <Route path="/members" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <MembersPage />
            </AppLayout>
          } />

          <Route path="/cotisations" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <CotisationsPageResponsive />
            </AppLayout>
          } />

          <Route path="/events" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <EventsPage />
            </AppLayout>
          } />

          <Route path="/finances" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <FinancesPage />
            </AppLayout>
          } />

          <Route path="/documents" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <DocumentsPage />
            </AppLayout>
          } />

          <Route path="/resources" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <ResourcesPage />
            </AppLayout>
          } />

          <Route path="/messages" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <MessagesPage />
            </AppLayout>
          } />

          <Route path="/messages-demo" element={
            <MessagesDemo />
          } />

          <Route path="/whatsapp-messages" element={
            <WhatsAppMessagesPageAdvanced />
          } />

          <Route path="/public-profile" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <PublicProfilePage />
            </AppLayout>
          } />

          <Route path="/settings" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <SettingsPage />
            </AppLayout>
          } />

          <Route path="/notifications" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <NotificationsPage />
            </AppLayout>
          } />

          <Route path="/billing" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <BillingPage />
            </AppLayout>
          } />

          <Route path="/security" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <SecurityPage />
            </AppLayout>
          } />

          <Route path="/history" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <HistoryPage />
            </AppLayout>
          } />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
