
import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, UserRole } from './context/AuthContext';
import { AccessibleThemeProvider } from './context/AccessibleThemeContext';
import MobileAuthGuard from './components/MobileAuthGuard';
import MobileNav from './components/MobileNav';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import CookieConsent from './components/CookieConsent';
import LoadingFallback from './components/LoadingFallback';

// Lazy Load das Páginas para otimização de performance inicial
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Recovery = React.lazy(() => import('./pages/Recovery'));
const Services = React.lazy(() => import('./pages/Services'));
const Units = React.lazy(() => import('./pages/Units'));
const UnitDetail = React.lazy(() => import('./pages/UnitDetail'));
const Results = React.lazy(() => import('./pages/Results'));
const ResultsPortal = React.lazy(() => import('./pages/ResultsPortal'));
const Scheduling = React.lazy(() => import('./pages/Scheduling'));
const Preparation = React.lazy(() => import('./pages/Preparation'));
const WorkWithUs = React.lazy(() => import('./pages/WorkWithUs'));
const Agreements = React.lazy(() => import('./pages/Agreements'));
const Guepardo = React.lazy(() => import('./pages/Guepardo'));
const GuepardoPortal = React.lazy(() => import('./pages/GuepardoPortal'));
const EALPortal = React.lazy(() => import('./pages/EALPortal'));
const PartnerPortal = React.lazy(() => import('./pages/PartnerPortal'));
const PendingApproval = React.lazy(() => import('./pages/PendingApproval'));
const InventoryDashboard = React.lazy(() => import('./pages/InventoryDashboard'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AdminPortal = React.lazy(() => import('./pages/AdminPortal'));
const Corporate = React.lazy(() => import('./pages/Corporate'));
const HRDashboardDemo = React.lazy(() => import('./pages/HRDashboardDemo'));
const Compliance = React.lazy(() => import('./pages/Compliance'));
const TeaSupport = React.lazy(() => import('./pages/TeaSupport'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Triage = React.lazy(() => import('./pages/Triage'));
const Kids = React.lazy(() => import('./pages/Kids'));
const AdminDashboard = React.lazy(() => import('./pages/Dashboard'));

const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles?: UserRole[] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingFallback />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  // Check for pending status
  if (user && user.status === 'pending' && user.role !== 'CLIENT' && user.role !== 'ADMIN') {
    return <Navigate to="/aguardando-aprovacao" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AccessibleThemeProvider>
        <Router>
          <MobileAuthGuard>
            <div className="flex flex-col min-h-screen bg-[#fcfdfd] md:pb-0 pb-20">
              <Header />
              <main className="flex-grow">
                <Suspense fallback={<LoadingFallback />}>
                  {/* ... existing routes ... */}
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Navigate to="/" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/cadastro" element={<Signup />} />
                    <Route path="/recuperar-acesso" element={<Recovery />} />
                    <Route path="/servicos" element={<Services />} />
                    <Route path="/preparo" element={<Preparation />} />
                    <Route path="/unidades" element={<Units />} />
                    <Route path="/unidades/:id" element={<UnitDetail />} />
                    <Route path="/resultados" element={<Results />} />
                    <Route path="/agendamento" element={<Scheduling />} />
                    <Route path="/trabalhe-conosco" element={<WorkWithUs />} />
                    <Route path="/convenios" element={<Agreements />} />
                    <Route path="/guepardo" element={<Guepardo />} />
                    <Route path="/empresas" element={<Corporate />} />
                    <Route path="/compliance" element={<Compliance />} />
                    <Route path="/tea" element={<TeaSupport />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/contato" element={<Contact />} />
                    <Route path="/triagem" element={<Triage />} />
                    <Route path="/infantil" element={<Kids />} />
                    <Route path="/aguardando-aprovacao" element={<PendingApproval />} />
                    
                    {/* Rotas Protegidas */}
                    <Route path="/portal-guepardo" element={
                      <ProtectedRoute allowedRoles={['GUEPARDO', 'ADMIN']}>
                        <GuepardoPortal />
                      </ProtectedRoute>
                    } />
                    <Route path="/portal-eal" element={<EALPortal />} />
                    <Route path="/portal-resultados" element={
                      <ProtectedRoute allowedRoles={['EAL', 'ADMIN']}>
                        <ResultsPortal />
                      </ProtectedRoute>
                    } />
                    <Route path="/portal-parceiro" element={
                      <ProtectedRoute allowedRoles={['PARTNER', 'ADMIN']}>
                        <PartnerPortal />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard-rh" element={
                      <ProtectedRoute allowedRoles={['PARTNER', 'ADMIN']}>
                        <PartnerPortal />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard-mats" element={
                      <ProtectedRoute allowedRoles={['EAL', 'GUEPARDO', 'ADMIN']}>
                        <EALPortal />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute allowedRoles={['ADMIN', 'CLIENT']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin" element={<AdminPortal />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <Chatbot />
              <FloatingWhatsApp />
              <CookieConsent />
              <MobileNav />
            </div>
          </MobileAuthGuard>
        </Router>
      </AccessibleThemeProvider>
    </AuthProvider>
  );
};

export default App;
