import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableWithSearch } from '@/components/ui/table-with-search';
import { ArrowLeft, Plus, Save, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

export type FieldType = 'text' | 'number' | 'date' | 'textarea' | 'select';

export interface FieldDef {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  colSpan?: 1 | 2 | 3;
}

export interface SectionDef {
  title: string;
  fields: FieldDef[];
}

export interface LineColumnDef {
  name: string;
  label: string;
  type?: FieldType;
  options?: string[];
  width?: string;
}

export interface LineItemsDef {
  title: string;
  columns: LineColumnDef[];
}

interface Props {
  title: string;
  module: 'Purchase' | 'Inventory';
  description?: string;
  backPath: string;
  sections: SectionDef[];
  lineItems?: LineItemsDef;
  showAttachments?: boolean;
  showRemarks?: boolean;
  submitLabel?: string;
}

export default function EntryFormScaffold({
  title,
  module,
  description,
  backPath,
  sections,
  lineItems,
  showAttachments = true,
  showRemarks = true,
  submitLabel = 'Save',
}: Props) {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState<Record<string, string>[]>(
    lineItems ? [Object.fromEntries(lineItems.columns.map((c) => [c.name, '']))] : []
  );

  const addRow = () => {
    if (!lineItems) return;
    setRows([...rows, Object.fromEntries(lineItems.columns.map((c) => [c.name, '']))]);
  };
  const removeRow = (idx: number) => setRows(rows.filter((_, i) => i !== idx));
  const updateRow = (idx: number, key: string, value: string) => {
    const copy = [...rows];
    copy[idx] = { ...copy[idx], [key]: value };
    setRows(copy);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`${title} saved successfully`);
    navigate(backPath);
  };

  const colSpanCls = (cs?: 1 | 2 | 3) =>
    cs === 3 ? 'md:col-span-3' : cs === 2 ? 'md:col-span-2' : '';

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" size="icon" onClick={() => navigate(backPath)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">{module}</Badge>
                <Badge variant="secondary" className="text-xs">New</Badge>
              </div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => navigate(backPath)}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button type="submit" size="sm">
              <Save className="h-4 w-4 mr-1" /> {submitLabel}
            </Button>
          </div>
        </div>

        {sections.map((section, si) => (
          <Card key={si}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.fields.map((f) => (
                  <div key={f.name} className={`space-y-2 ${colSpanCls(f.colSpan)}`}>
                    <Label>
                      {f.label}
                      {f.required && <span className="text-destructive ml-0.5">*</span>}
                    </Label>
                    {f.type === 'textarea' ? (
                      <Textarea placeholder={f.placeholder} required={f.required} />
                    ) : f.type === 'select' ? (
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={f.placeholder || `Select ${f.label}`} />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-[9999]">
                          {(f.options || []).map((o) => (
                            <SelectItem key={o} value={o}>{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={f.type || 'text'}
                        placeholder={f.placeholder}
                        required={f.required}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {lineItems && (
          <Card>
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-base">{lineItems.title}</CardTitle>
              <Button type="button" size="sm" variant="outline" onClick={addRow}>
                <Plus className="h-4 w-4 mr-1" /> Add Row
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <TableWithSearch>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">SL</TableHead>
                      {lineItems.columns.map((c) => (
                        <TableHead key={c.name} style={c.width ? { width: c.width } : undefined}>
                          {c.label}
                        </TableHead>
                      ))}
                      <TableHead className="w-12 text-right">—</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{idx + 1}</TableCell>
                        {lineItems.columns.map((c) => (
                          <TableCell key={c.name}>
                            {c.type === 'select' ? (
                              <Select value={row[c.name]} onValueChange={(v) => updateRow(idx, c.name, v)}>
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover z-[9999]">
                                  {(c.options || []).map((o) => (
                                    <SelectItem key={o} value={o}>{o}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                className="h-9"
                                type={c.type || 'text'}
                                value={row[c.name] || ''}
                                onChange={(e) => updateRow(idx, c.name, e.target.value)}
                              />
                            )}
                          </TableCell>
                        ))}
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeRow(idx)}
                            disabled={rows.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableWithSearch>
              </div>
            </CardContent>
          </Card>
        )}

        {(showRemarks || showAttachments) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showRemarks && (
                <div className="space-y-2">
                  <Label>Remarks / Notes</Label>
                  <Textarea placeholder="Enter remarks or notes..." rows={3} />
                </div>
              )}
              {showAttachments && (
                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <Input type="file" multiple />
                  <p className="text-xs text-muted-foreground">Upload supporting documents (PDF, images, Excel).</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(backPath)}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-1" /> {submitLabel}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}