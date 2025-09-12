/*
  # Doctor Referral System

  1. New Tables
    - `doctor_specialties` - Available specialties for referrals
    - `clinic_doctors` - Doctors associated with clinics
    - `referrals` - Referral requests between doctors
    - `referral_responses` - Responses to referral requests

  2. Security
    - Enable RLS on all tables
    - Proper access control for referral data
*/

-- Doctor specialties table
CREATE TABLE IF NOT EXISTS doctor_specialties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  category text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Clinic doctors table (for grouping doctors by clinic/practice)
CREATE TABLE IF NOT EXISTS clinic_doctors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_name text NOT NULL,
  clinic_address text,
  clinic_phone text,
  doctor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  specialties text[] NOT NULL,
  is_accepting_referrals boolean DEFAULT true,
  consultation_fee decimal(10,2),
  available_days text[], -- ['monday', 'tuesday', etc.]
  available_hours text, -- '9:00-17:00'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referring_doctor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  referred_doctor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  patient_name text NOT NULL,
  patient_phone text,
  patient_age integer,
  patient_gender text CHECK (patient_gender IN ('male', 'female')),
  specialty_needed text NOT NULL,
  procedure_type text NOT NULL,
  urgency text CHECK (urgency IN ('routine', 'urgent', 'emergency')) DEFAULT 'routine',
  clinical_notes text NOT NULL,
  medical_history text,
  current_medications text,
  allergies text,
  x_rays_available boolean DEFAULT false,
  x_ray_urls text[],
  photos_urls text[],
  preferred_appointment_date date,
  preferred_time_slot text,
  consultation_fee_agreed decimal(10,2),
  status text CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Referral responses table
CREATE TABLE IF NOT EXISTS referral_responses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_id uuid REFERENCES referrals(id) ON DELETE CASCADE NOT NULL,
  responding_doctor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  response_type text CHECK (response_type IN ('accept', 'decline', 'request_more_info')) NOT NULL,
  message text,
  proposed_appointment_date date,
  proposed_time_slot text,
  consultation_fee decimal(10,2),
  estimated_treatment_cost decimal(10,2),
  treatment_duration_estimate text,
  additional_requirements text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE doctor_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_responses ENABLE ROW LEVEL SECURITY;

-- Doctor specialties policies (public read)
CREATE POLICY "Anyone can view active specialties"
  ON doctor_specialties FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Clinic doctors policies
CREATE POLICY "Anyone can view clinic doctors accepting referrals"
  ON clinic_doctors FOR SELECT
  TO authenticated
  USING (is_accepting_referrals = true);

CREATE POLICY "Doctors can manage their clinic info"
  ON clinic_doctors FOR ALL
  TO authenticated
  USING ((select auth.uid()) = doctor_id)
  WITH CHECK ((select auth.uid()) = doctor_id);

-- Referrals policies
CREATE POLICY "Doctors can view referrals they're involved in"
  ON referrals FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = referring_doctor_id OR 
    (select auth.uid()) = referred_doctor_id
  );

CREATE POLICY "Doctors can create referrals"
  ON referrals FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = referring_doctor_id);

CREATE POLICY "Doctors can update referrals they're involved in"
  ON referrals FOR UPDATE
  TO authenticated
  USING (
    (select auth.uid()) = referring_doctor_id OR 
    (select auth.uid()) = referred_doctor_id
  );

-- Referral responses policies
CREATE POLICY "Doctors can view responses to their referrals"
  ON referral_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM referrals 
      WHERE referrals.id = referral_responses.referral_id 
      AND (referrals.referring_doctor_id = (select auth.uid()) OR referrals.referred_doctor_id = (select auth.uid()))
    )
  );

CREATE POLICY "Doctors can respond to referrals"
  ON referral_responses FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = responding_doctor_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_clinic_doctors_doctor_id ON clinic_doctors(doctor_id);
CREATE INDEX IF NOT EXISTS idx_clinic_doctors_specialties ON clinic_doctors USING GIN(specialties);
CREATE INDEX IF NOT EXISTS idx_referrals_referring_doctor ON referrals(referring_doctor_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_doctor ON referrals(referred_doctor_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referral_responses_referral_id ON referral_responses(referral_id);

-- Create triggers for updated_at
CREATE TRIGGER update_clinic_doctors_updated_at BEFORE UPDATE ON clinic_doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample specialties
INSERT INTO doctor_specialties (name, description, category) VALUES
('Oral Surgery', 'Surgical procedures including extractions, implants, and jaw surgery', 'Surgery'),
('Endodontics', 'Root canal therapy and endodontic treatments', 'Specialized Treatment'),
('Orthodontics', 'Teeth alignment and bite correction', 'Specialized Treatment'),
('Periodontics', 'Gum disease treatment and periodontal surgery', 'Specialized Treatment'),
('Prosthodontics', 'Crowns, bridges, dentures, and complex restorations', 'Restorative'),
('Pediatric Dentistry', 'Specialized care for children and adolescents', 'Specialized Care'),
('Oral Pathology', 'Diagnosis and treatment of oral diseases', 'Diagnosis'),
('Maxillofacial Surgery', 'Complex facial and jaw surgeries', 'Surgery'),
('Implantology', 'Dental implant placement and restoration', 'Surgery'),
('Cosmetic Dentistry', 'Aesthetic dental procedures and smile makeovers', 'Cosmetic');