
-- Drop restrictive policies and recreate as permissive for gh_stations
DROP POLICY IF EXISTS "Authenticated users can manage gh_stations" ON public.gh_stations;
DROP POLICY IF EXISTS "Authenticated users can read gh_stations" ON public.gh_stations;
CREATE POLICY "Anyone can read gh_stations" ON public.gh_stations FOR SELECT USING (true);
CREATE POLICY "Anyone can manage gh_stations" ON public.gh_stations FOR ALL USING (true) WITH CHECK (true);

-- gh_services
DROP POLICY IF EXISTS "Authenticated users can manage gh_services" ON public.gh_services;
DROP POLICY IF EXISTS "Authenticated users can read gh_services" ON public.gh_services;
CREATE POLICY "Anyone can read gh_services" ON public.gh_services FOR SELECT USING (true);
CREATE POLICY "Anyone can manage gh_services" ON public.gh_services FOR ALL USING (true) WITH CHECK (true);

-- gh_criteria
DROP POLICY IF EXISTS "Authenticated users can manage gh_criteria" ON public.gh_criteria;
DROP POLICY IF EXISTS "Authenticated users can read gh_criteria" ON public.gh_criteria;
CREATE POLICY "Anyone can read gh_criteria" ON public.gh_criteria FOR SELECT USING (true);
CREATE POLICY "Anyone can manage gh_criteria" ON public.gh_criteria FOR ALL USING (true) WITH CHECK (true);

-- gh_suppliers
DROP POLICY IF EXISTS "Authenticated users can manage gh_suppliers" ON public.gh_suppliers;
DROP POLICY IF EXISTS "Authenticated users can read gh_suppliers" ON public.gh_suppliers;
CREATE POLICY "Anyone can read gh_suppliers" ON public.gh_suppliers FOR SELECT USING (true);
CREATE POLICY "Anyone can manage gh_suppliers" ON public.gh_suppliers FOR ALL USING (true) WITH CHECK (true);

-- gh_service_criteria
DROP POLICY IF EXISTS "Authenticated users can manage gh_service_criteria" ON public.gh_service_criteria;
DROP POLICY IF EXISTS "Authenticated users can read gh_service_criteria" ON public.gh_service_criteria;
CREATE POLICY "Anyone can read gh_service_criteria" ON public.gh_service_criteria FOR SELECT USING (true);
CREATE POLICY "Anyone can manage gh_service_criteria" ON public.gh_service_criteria FOR ALL USING (true) WITH CHECK (true);
