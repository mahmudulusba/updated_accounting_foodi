import React, { useRef, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
  moduleName: string;
  excelTypes: string[];
}

export default function ModuleDataUpload({ moduleName, excelTypes }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [excelType, setExcelType] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!/\.(xlsx|xls)$/i.test(file.name)) {
      toast.error('Please upload an Excel file (.xlsx or .xls)');
      return;
    }
    setFileName(file.name);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleReset = () => { setExcelType(''); setFileName(null); };
  const handleSave = () => {
    if (!excelType) return toast.error('Please select an Excel type');
    if (!fileName) return toast.error('Please choose an Excel file');
    toast.success(`Uploaded "${fileName}" as ${excelType}`);
    handleReset();
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Card className="px-4 py-3 rounded-md">
          <div className="text-sm">
            <span className="font-semibold text-foreground">{moduleName}</span>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-primary">Data Upload</span>
          </div>
        </Card>

        <Card className="p-6 rounded-md">
          <h2 className="text-lg font-medium text-foreground">Data Upload</h2>
          <div className="border-b my-4" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Label className="text-sm">
                Select Excel Type <span className="text-destructive">*</span>
              </Label>
              <Select value={excelType} onValueChange={setExcelType}>
                <SelectTrigger className="mt-2 h-10">
                  <SelectValue placeholder="-- Select an excel type --" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-[9999]">
                  {excelTypes.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={cn(
                'rounded-md border-2 border-dashed p-8 text-center transition-colors flex flex-col items-center justify-center min-h-[180px]',
                dragOver ? 'border-primary bg-primary/5' : 'border-primary/40 bg-muted/30'
              )}
              style={{
                backgroundImage: dragOver ? undefined :
                  'repeating-linear-gradient(135deg, hsl(var(--muted)) 0 10px, transparent 10px 20px)',
              }}
            >
              <p className="text-primary font-medium">Drag and drop your Excel File here</p>
              <p className="text-xs italic text-primary/80 mt-2">Use Only Excel File</p>
              <Button className="mt-4" onClick={() => fileInput.current?.click()}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Choose [ Excel File ]
              </Button>
              <input
                ref={fileInput}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              {fileName && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Selected: <span className="font-medium text-foreground">{fileName}</span>
                </p>
              )}
            </div>
          </div>

          <div className="border-t mt-8 pt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={handleReset}>Reset</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
