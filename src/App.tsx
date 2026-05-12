import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppProvider, useApp } from "./contexts/AppContext";
import { AccountingModeProvider } from "./contexts/AccountingModeContext";
import { AccountingRoutes } from "./components/AccountingRoutes";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import SRSDocument from "./pages/SRSDocument";
import Config from "./pages/Config";
import FoodiLoader from "./components/FoodiLoader";

const queryClient = new QueryClient();

function RouteChangeLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [location.pathname]);

  if (!loading) return null;
  return <FoodiLoader fullScreen label="Loading..." />;
}

function AppRoutes() {
  const { isLoggedIn } = useApp();

  return (
    <>
    <RouteChangeLoader />
    <Routes>
      <Route 
        path="/" 
        element={
          isLoggedIn ? (
             <Navigate to="/management/homepage" replace />
          ) : (
            <Login />
          )
        } 
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/srs-document" element={<SRSDocument />} />
      <Route path="/config" element={<Config />} />
      
      {/* Management Accounting Routes */}
      <Route path="/management/*" element={
        <AccountingModeProvider>
          <AccountingRoutes />
        </AccountingModeProvider>
      } />
      
      {/* Tax Accounting Routes */}
      <Route path="/tax/*" element={
        <AccountingModeProvider>
          <AccountingRoutes />
        </AccountingModeProvider>
      } />
      
      {/* Legacy route redirects */}
       <Route path="/dashboard" element={<Navigate to="/management/homepage" replace />} />
      <Route path="/voucher-list" element={<Navigate to="/management/voucher-list" replace />} />
      <Route path="/general-ledger" element={<Navigate to="/management/general-ledger" replace />} />
      <Route path="/parent-gl" element={<Navigate to="/management/parent-gl" replace />} />
      <Route path="/gl-voucher-type-mapping" element={<Navigate to="/management/gl-voucher-type-mapping" replace />} />
      <Route path="/admin/*" element={<Navigate to="/management/homepage" replace />} />
      <Route path="/reports/*" element={<Navigate to="/management/reports/transaction" replace />} />
      <Route path="/report-config/*" element={<Navigate to="/management/report-config/ratio-analysis" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
