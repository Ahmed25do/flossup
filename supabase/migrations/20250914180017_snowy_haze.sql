/*
  # Specialist Doctor System

  1. New Tables
    - `specialist_doctors` - Specialist doctor profiles and clinic information
    - `doctor_requests` - Consultation requests between clinics and specialists

  2. Security
    - Enable RLS on all tables
    - Proper access control for specialist data
*/

-- Specialist doctors table (replaces clinic_doctors)
CREATE TABLE IF NOT EXISTS specialist_doctors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  clinic_name text NOT NULL,
  clinic_address text,
  clinic_phone text,
  governorate text NOT NULL,
  city text,
  specialties text[] NOT NULL,
  is_accepting_requests boolean DEFAULT true,
  consultation_fee decimal(10,2),
  commission_rate decimal(5,2) DEFAULT 10.00,
  available_days text[], -- ['monday', 'tuesday', etc.]
  available_hours text, -- '9:00-17:00'
  rating decimal(3,2) DEFAULT 0,
  completed_cases integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Doctor requests table (replaces referrals)
CREATE TABLE IF NOT EXISTS doctor_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  requesting_doctor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  specialist_doctor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  clinic_name text NOT NULL,
  specialty_needed text NOT NULL,
  requested_date date NOT NULL,
  requested_time time NOT NULL,
  case_description text NOT NULL,
  patient_name text NOT NULL,
  patient_age integer,
  patient_gender text CHECK (patient_gender IN ('male', 'female')),
  urgency text CHECK (urgency IN ('routine', 'urgent', 'emergency')) DEFAULT 'routine',
  status text CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')) DEFAULT 'pending',
  commission_amount decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE specialist_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_requests ENABLE ROW LEVEL SECURITY;

-- Specialist doctors policies
CREATE POLICY "Anyone can view specialists accepting requests"
  ON specialist_doctors FOR SELECT
  TO authenticated
  USING (is_accepting_requests = true);

CREATE POLICY "Doctors can manage their specialist profile"
  ON specialist_doctors FOR ALL
  TO authenticated
  USING ((select auth.uid()) = doctor_id)
  WITH CHECK ((select auth.uid()) = doctor_id);

-- Doctor requests policies
CREATE POLICY "Doctors can view requests they're involved in"
  ON doctor_requests FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = requesting_doctor_id OR 
    (select auth.uid()) = specialist_doctor_id
  );

CREATE POLICY "Doctors can create requests"
  ON doctor_requests FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = requesting_doctor_id);

CREATE POLICY "Doctors can update requests they're involved in"
  ON doctor_requests FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) = requesting_doctor_id OR 
    (select auth.uid()) = specialist_doctor_id
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_specialist_doctors_doctor_id ON specialist_doctors(doctor_id);
CREATE INDEX IF NOT EXISTS idx_specialist_doctors_governorate ON specialist_doctors(governorate);
CREATE INDEX IF NOT EXISTS idx_specialist_doctors_specialties ON specialist_doctors USING GIN(specialties);
CREATE INDEX IF NOT EXISTS idx_doctor_requests_requesting_doctor ON doctor_requests(requesting_doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_requests_specialist_doctor ON doctor_requests(specialist_doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_requests_status ON doctor_requests(status);

-- Create triggers for updated_at
CREATE TRIGGER update_specialist_doctors_updated_at BEFORE UPDATE ON specialist_doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctor_requests_updated_at BEFORE UPDATE ON doctor_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample specialist doctors
INSERT INTO specialist_doctors (doctor_id, clinic_name, clinic_address, governorate, city, specialties, consultation_fee, commission_rate, available_days, available_hours, rating, completed_cases) 
SELECT 
  id,
  'Sample Clinic',
  'Sample Address',
  'Cairo',
  'New Cairo',
  ARRAY['Oral Surgery', 'Implantology'],
  500.00,
  10.00,
  ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  '9:00-17:00',
  4.8,
  25
FROM profiles 
WHERE specialization IN ('Oral Surgeon', 'Endodontist', 'Orthodontist', 'Periodontist')
LIMIT 3;