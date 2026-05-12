import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea'; // kept for OCR dialog
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ClipboardList, Download, Save, Send, RotateCcw, Plane, Upload, Search, FileText, Info, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { mockStations, SUPPLIER_TYPES, SERVICES_BY_SUPPLIER_TYPE, mockJourneyLogs } from '@/lib/groundHandlingData';

interface ServiceDetail {
  quantity: string;
  duration: string;
  unit: string;
  attachment: File | null;
  remarks: string;
}

export default function ServiceDataEntry() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const flightId = searchParams.get('flightId') || '1';
  const flight = mockJourneyLogs.find(f => f.id === flightId) || mockJourneyLogs[0];

  const [station, setStation] = useState(flight?.station || '');
  const [supplierType, setSupplierType] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceDetails, setServiceDetails] = useState<Record<string, ServiceDetail>>({});
  const [serviceSearch, setServiceSearch] = useState('');
  const [showOcrReview, setShowOcrReview] = useState(false);
  const [ocrDetectedServices, setOcrDetectedServices] = useState<string[]>([]);
  const [servicesLoaded, setServicesLoaded] = useState(false);

  const availableServices = useMemo(() => {
    if (!supplierType) return [];
    return SERVICES_BY_SUPPLIER_TYPE[supplierType] || [];
  }, [supplierType]);

  const filteredServices = useMemo(() => {
    if (!serviceSearch) return availableServices;
    return availableServices.filter(s => s.toLowerCase().includes(serviceSearch.toLowerCase()));
  }, [availableServices, serviceSearch]);

  const handleLoadServices = () => {
    if (!station || !supplierType) { toast.error('Please select Station and Supplier Type first'); return; }
    setServicesLoaded(true);
    toast.success('Services loaded successfully');
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        const updated = { ...serviceDetails };
        delete updated[service];
        setServiceDetails(updated);
        return prev.filter(s => s !== service);
      }
      setServiceDetails(d => ({ ...d, [service]: { quantity: '', duration: '00:00', unit: 'Per Service', attachment: null, remarks: '' } }));
      return [...prev, service];
    });
  };

  const updateServiceDetail = (service: string, field: keyof ServiceDetail, value: string | File | null) => {
    setServiceDetails(prev => ({ ...prev, [service]: { ...prev[service], [field]: value } }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.info('Processing document with OCR...');
      setTimeout(() => {
        const mockDetected = availableServices.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 10) + 5);
        setOcrDetectedServices(mockDetected);
        setShowOcrReview(true);
      }, 1500);
    }
  };

  const handleServiceAttachment = (service: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) updateServiceDetail(service, 'attachment', file);
  };

  const handleOcrConfirm = () => {
    const newServices = ocrDetectedServices.filter(s => !selectedServices.includes(s));
    newServices.forEach(s => {
      setServiceDetails(prev => ({ ...prev, [s]: { quantity: '', duration: '00:00', unit: 'Per Service', attachment: null, remarks: '' } }));
    });
    setSelectedServices(prev => [...new Set([...prev, ...ocrDetectedServices])]);
    setShowOcrReview(false);
    toast.success('Services added from document');
  };

  const handleSubmit = () => { toast.success('Service data submitted successfully'); navigate('/management/ground-handling/flight-ops/journey-log'); };
  const handleSaveDraft = () => { toast.success('Draft saved'); };
  const handleReset = () => { setSelectedServices([]); setServiceDetails({}); setServicesLoaded(false); toast.info('Form reset'); };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-wrap">
                <ClipboardList className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg">Service Data Entry</span>
                <Badge variant="outline" className="bg-warning/20 text-warning">Draft</Badge>
                <span className="text-sm text-muted-foreground">Flight: <strong>{flight.flightNo}</strong></span>
                <span className="text-sm text-muted-foreground">Date: <strong>{flight.flightDate}</strong></span>
                <span className="text-sm text-muted-foreground">Reg: <strong className="text-primary">{flight.aircraftReg}</strong></span>
                <span className="text-sm text-muted-foreground">Entered By: <strong>John Doe</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="h-4 w-4 mr-2" />Save Draft
                </Button>
                <label className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span><Upload className="h-4 w-4 mr-2" />OCR Upload</span>
                  </Button>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls" onChange={handleFileUpload} />
                </label>
                <Button className="bg-primary" onClick={handleSubmit}>
                  <Send className="h-4 w-4 mr-2" />Submit
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Service Provider + Services */}
          <div className="space-y-4">
            <Card>
              <CardContent className="py-6">
                <div className="flex items-end gap-3 mb-6">
                  <div className="space-y-1 flex-1">
                    <label className="text-sm text-primary font-medium">Service Provider</label>
                    <Select value={supplierType} onValueChange={(v) => { setSupplierType(v); setServicesLoaded(false); setSelectedServices([]); setServiceDetails({}); }}>
                      <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                      <SelectContent className="bg-popover z-[9999]">
                        {SUPPLIER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="bg-primary" onClick={handleLoadServices}>
                    <Download className="h-4 w-4 mr-2" />Load Services
                  </Button>
                </div>
              </CardContent>
            </Card>

            {servicesLoaded && availableServices.length > 0 ? (
              <>
                <Card>
                  <CardContent className="py-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search services..." value={serviceSearch} onChange={(e) => setServiceSearch(e.target.value)} className="pl-9" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{supplierType} Services</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 max-h-[600px] overflow-y-auto">
                    {filteredServices.map(service => {
                      const isSelected = selectedServices.includes(service);
                      const detail = serviceDetails[service];
                      return (
                        <div key={service} className="border rounded-lg">
                          <div
                            className={`flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 ${isSelected ? 'bg-primary/5' : ''}`}
                            onClick={() => handleServiceToggle(service)}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox checked={isSelected} onCheckedChange={() => handleServiceToggle(service)} />
                              <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>{service}</span>
                            </div>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </div>

                          {isSelected && detail && (
                            <div className="px-4 pb-3 pt-2 border-t bg-muted/20">
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <label className="text-xs font-medium text-muted-foreground">Quantity</label>
                                  <Input placeholder="Qty" value={detail.quantity} onChange={(e) => updateServiceDetail(service, 'quantity', e.target.value)} className="h-8 text-sm" />
                                </div>
                                <div className="flex-1">
                                  <label className="text-xs font-medium text-muted-foreground">Duration</label>
                                  <Input placeholder="00:00" value={detail.duration} onChange={(e) => updateServiceDetail(service, 'duration', e.target.value)} className="h-8 text-sm" />
                                </div>
                                <div className="w-24">
                                  <label className="text-xs font-medium text-muted-foreground">Unit</label>
                                  <Input value={detail.unit} className="h-8 text-sm bg-muted" readOnly />
                                </div>
                                <div className="w-24">
                                  <label className="text-xs font-medium text-muted-foreground">Attach</label>
                                  <label className="flex items-center justify-center gap-1 h-8 px-2 border rounded-md text-xs cursor-pointer hover:bg-muted">
                                    <Upload className="h-3 w-3" />
                                    <span>{detail.attachment ? '✓' : 'File'}</span>
                                    <input type="file" className="hidden" onChange={(e) => handleServiceAttachment(service, e)} />
                                  </label>
                                </div>
                                <div className="flex-1">
                                  <label className="text-xs font-medium text-muted-foreground">Remarks</label>
                                  <Input placeholder="Notes..." value={detail.remarks} onChange={(e) => updateServiceDetail(service, 'remarks', e.target.value)} className="h-8 text-sm" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Plane className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">Select Service Provider, then click "Load Services" to view the checklist.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: OCR Document Preview */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">OCR Document Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Upload a JPG, PDF, or Excel file to auto-detect services via OCR.</p>
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer hover:border-primary/50 transition-colors">
                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-primary font-medium">Drop file or click to upload</span>
                <span className="text-xs text-muted-foreground mt-1">PDF, JPG, Excel supported</span>
                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls" onChange={handleFileUpload} />
              </label>
            </CardContent>
          </Card>
        </div>

        {/* OCR Review Dialog */}
        <Dialog open={showOcrReview} onOpenChange={setShowOcrReview}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Review Detected Services</DialogTitle></DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">The following services were detected. Please review before confirming.</p>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {ocrDetectedServices.map((service, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Checkbox defaultChecked /><span className="text-sm">{service}</span>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOcrReview(false)}>Cancel</Button>
              <Button onClick={handleOcrConfirm}>Confirm & Add Services</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
