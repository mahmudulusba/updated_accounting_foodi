 import React from 'react';
 import { DashboardLayout } from '@/components/DashboardLayout';
 import { Card, CardContent } from '@/components/ui/card';
 import { Link } from 'react-router-dom';
 import { 
   MapPin, 
   Truck, 
   Wrench, 
   Plane, 
   FileCheck, 
   Receipt, 
   BarChart3,
   ArrowRight
 } from 'lucide-react';
 
 const quickLinks = [
   { label: 'Station Management', icon: MapPin, path: 'station/list', description: 'Manage airport stations' },
   { label: 'Suppliers', icon: Truck, path: 'suppliers/list', description: 'View and manage suppliers' },
   { label: 'Services', icon: Wrench, path: 'services/list', description: 'Configure ground services' },
   { label: 'Flight Operations', icon: Plane, path: 'flight-ops/journey-log', description: 'Journey logs and service data' },
   { label: 'Agreements', icon: FileCheck, path: 'agreements/station-wise', description: 'Station-wise agreements' },
   { label: 'Invoices', icon: Receipt, path: 'invoice/list', description: 'Manage invoices' },
   { label: 'Reports', icon: BarChart3, path: 'reports/dashboard', description: 'View analytics and reports' },
 ];
 
 export default function GroundHandlingHomepage() {
   const prefix = '/management/ground-handling';
 
   return (
     <DashboardLayout>
       <div className="space-y-6">
         {/* Welcome Header */}
         <div className="bg-gradient-to-r from-success/10 via-success/5 to-transparent rounded-xl p-6 border border-success/20">
           <h1 className="text-2xl font-bold text-foreground mb-2">
             Ground Handling Module
           </h1>
           <p className="text-muted-foreground">
              Manage ground handling operations
           </p>
         </div>
 
         {/* Quick Links Grid */}
         <div>
           <h2 className="text-lg font-semibold text-foreground mb-4">Quick Access</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {quickLinks.map((link) => (
               <Link 
                 key={link.path} 
                 to={`${prefix}/${link.path}`}
                 className="group"
               >
                 <Card className="h-full transition-all hover:shadow-md hover:border-success/40">
                   <CardContent className="p-4 flex items-start gap-4">
                     <div className="p-2 rounded-lg bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground transition-colors">
                       <link.icon className="h-5 w-5" />
                     </div>
                     <div className="flex-1">
                       <h3 className="font-medium text-foreground group-hover:text-success transition-colors flex items-center gap-2">
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