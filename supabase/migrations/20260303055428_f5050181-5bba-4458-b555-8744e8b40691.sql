
-- Ground Handling Stations
CREATE TABLE public.gh_stations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  iata_code TEXT NOT NULL,
  icao_code TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Domestic' CHECK (type IN ('Domestic', 'International')),
  country TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT 'Asia',
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(iata_code, type)
);

-- Ground Handling Suppliers
CREATE TABLE public.gh_suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  designation TEXT,
  email TEXT,
  phone TEXT,
  fax TEXT,
  supplier_type TEXT NOT NULL DEFAULT 'Ground Handling',
  country TEXT,
  station_iata TEXT,
  remarks TEXT,
  valid_from DATE,
  valid_till DATE,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Expiring Soon', 'Expired', 'Inactive')),
  bank_name TEXT,
  account_name TEXT,
  account_number TEXT,
  branch_name TEXT,
  swift_code TEXT,
  routing_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ground Handling Criteria (pricing criteria like weight-based, per hour, sunrise/sunset etc.)
CREATE TABLE public.gh_criteria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ground Handling Services
CREATE TABLE public.gh_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_code TEXT,
  service_name TEXT NOT NULL,
  supplier_type TEXT NOT NULL,
  unit_of_measurement TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Service-Criteria junction table
CREATE TABLE public.gh_service_criteria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.gh_services(id) ON DELETE CASCADE,
  criteria_id UUID NOT NULL REFERENCES public.gh_criteria(id) ON DELETE CASCADE,
  UNIQUE(service_id, criteria_id)
);

-- Enable RLS on all tables
ALTER TABLE public.gh_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gh_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gh_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gh_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gh_service_criteria ENABLE ROW LEVEL SECURITY;

-- Public read policies (this is internal ERP data, read by authenticated users)
CREATE POLICY "Authenticated users can read gh_stations" ON public.gh_stations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage gh_stations" ON public.gh_stations FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read gh_suppliers" ON public.gh_suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage gh_suppliers" ON public.gh_suppliers FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read gh_criteria" ON public.gh_criteria FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage gh_criteria" ON public.gh_criteria FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read gh_services" ON public.gh_services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage gh_services" ON public.gh_services FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read gh_service_criteria" ON public.gh_service_criteria FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage gh_service_criteria" ON public.gh_service_criteria FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.update_gh_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_gh_stations_updated_at BEFORE UPDATE ON public.gh_stations FOR EACH ROW EXECUTE FUNCTION public.update_gh_updated_at();
CREATE TRIGGER update_gh_suppliers_updated_at BEFORE UPDATE ON public.gh_suppliers FOR EACH ROW EXECUTE FUNCTION public.update_gh_updated_at();
CREATE TRIGGER update_gh_criteria_updated_at BEFORE UPDATE ON public.gh_criteria FOR EACH ROW EXECUTE FUNCTION public.update_gh_updated_at();
CREATE TRIGGER update_gh_services_updated_at BEFORE UPDATE ON public.gh_services FOR EACH ROW EXECUTE FUNCTION public.update_gh_updated_at();
