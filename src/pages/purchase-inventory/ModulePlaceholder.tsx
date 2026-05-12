import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';

interface Props {
  title: string;
  description?: string;
  module: 'Purchase' | 'Inventory';
  newPath?: string;
}

export default function ModulePlaceholder({ title, description, module, newPath }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const handleNew = () => {
    const target = newPath || `${location.pathname.replace(/\/$/, '')}/new`;
    navigate(target);
  };
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">{module}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-1" /> Filter</Button>
            <Button size="sm" onClick={handleNew}><Plus className="h-4 w-4 mr-1" /> New</Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{title} List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={`Search ${title.toLowerCase()}...`} className="pl-8 h-9" />
              </div>
              <Button size="sm" variant="outline">Search</Button>
            </div>
            <TableWithSearch>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">SL</TableHead>
                  <TableHead>Reference No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No records yet. Click "New" to add the first {title.toLowerCase()}.
                  </TableCell>
                </TableRow>
              </TableBody>
            </TableWithSearch>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}