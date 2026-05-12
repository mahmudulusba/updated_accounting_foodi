 import React from 'react';
 import { DashboardLayout } from '@/components/DashboardLayout';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { useApp } from '@/contexts/AppContext';
 import { useAccountingMode } from '@/contexts/AccountingModeContext';
 import { Link } from 'react-router-dom';
 import { 
   BarChart3, 
   FileSpreadsheet, 
   Receipt, 
   Settings, 
   Upload, 
   Truck, 
   Users, 
   Building,
   Clock,
   Globe,
   ArrowRight
 } from 'lucide-react';
 
 const quickLinks = [
   { label: 'Dashboard', icon: BarChart3, path: 'dashboard', description: 'View financial analytics and KPIs' },
  { label: 'Voucher Entry', icon: Receipt, path: 'batch-voucher', description: 'Create new voucher entries' },
   { label: 'Voucher List', icon: FileSpreadsheet, path: 'voucher-list', description: 'View and manage vouchers' },
   { label: 'Reports', icon: BarChart3, path: 'reports/transaction', description: 'Generate financial reports' },
   { label: 'General Ledger', icon: FileSpreadsheet, path: 'general-ledger', description: 'Manage chart of accounts' },
   { label: 'Configuration', icon: Settings, path: 'currency-setup', description: 'System configuration' },
 ];
 
 export default function Homepage() {
   const { selectedBranch } = useApp();
   const { accountingMode, isManagementMode, getModePath } = useAccountingMode();
   const prefix = isManagementMode ? '/management' : '/tax';
 
   return (
     <DashboardLayout>
       <div className="space-y-6">
        {/* Quick Access — shown by default on homepage */}
         <div>
           <h2 className="text-lg font-semibold text-foreground mb-4">Quick Access</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {quickLinks.map((link) => (
               <Link 
                 key={link.path} 
                 to={`${prefix}/${link.path}`}
                 className="group"
               >
                 <Card className="h-full transition-all hover:shadow-md hover:border-primary/40">
                   <CardContent className="p-4 flex items-start gap-4">
                     <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                       <link.icon className="h-5 w-5" />
                     </div>
                     <div className="flex-1">
                       <h3 className="font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                         {link.label}
                         <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </h3>
                       <p className="text-sm text-muted-foreground">{link.description}</p>
                     </div>
                   </CardContent>
                 </Card>
               </Link>
             ))}
           </div>
         </div>
 
         {/* Footer */}
         <div className="bg-background/90 backdrop-blur-sm py-3 text-center mt-8">
           <p className="text-sm text-muted-foreground">
             Copyright © Designed & Developed by{' '}
             <span className="text-primary font-medium">Foodi</span> 2026
           </p>
         </div>
       </div>
     </DashboardLayout>
   );
 }