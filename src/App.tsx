import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import GuidancePage from './pages/GuidancePage';
import DiagnosticPage from './pages/DiagnosticPage';
import RecommendationsPage from './pages/RecommendationsPage';
import CompliancePage from './pages/CompliancePage';
import ActionPlanPage from './pages/ActionPlanPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MembersPage from './pages/MembersPage';
import CotisationsPageResponsive from './pages/CotisationsPageResponsive';
import EventsPage from './pages/EventsPage';
import FinancesPage from './pages/FinancesPage';
import DocumentsPage from './pages/DocumentsPage';
import MessagesPage from './pages/MessagesPage';
import PublicProfilePage from './pages/PublicProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import BillingPage from './pages/BillingPage';
import SecurityPage from './pages/SecurityPage';
import HistoryPage from './pages/HistoryPage';
import { LegalPage } from './pages/LegalPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { HelpPage } from './pages/HelpPage';
import { DocumentationPage } from './pages/DocumentationPage';
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

          <Route path="/messages" element={
            <AppLayout
              sidebarOpen={sidebarOpen}
              onToggleSidebar={toggleSidebar}
              onCloseSidebar={closeSidebar}
            >
              <MessagesPage />
            </AppLayout>
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
      </Router>
    </AuthProvider>
  );
}

export default App;
