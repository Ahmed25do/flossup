import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Camera,
  Upload,
  Send,
  Eye,
  MessageSquare
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../components/AuthProvider';

interface ClinicDoctor {
  id: string;
  clinic_name: string;
  clinic_address: string;
  clinic_phone: string;
  doctor_id: string;
  specialties: string[];
  is_accepting_referrals: boolean;
  consultation_fee: number;
  available_days: string[];
  available_hours: string;
  profiles: {
    full_name: string;
    avatar_url: string;
    specialization: string;
    phone: string;
    email: string;
  };
}

interface Referral {
  id: string;
  referring_doctor_id: string;
  referred_doctor_id: string;
  patient_name: string;
  patient_phone: string;
  patient_age: number;
  patient_gender: string;
  specialty_needed: string;
  procedure_type: string;
  urgency: string;
  clinical_notes: string;
  medical_history: string;
  current_medications: string;
  allergies: string;
  x_rays_available: boolean;
  x_ray_urls: string[];
  photos_urls: string[];
  preferred_appointment_date: string;
  preferred_time_slot: string;
  consultation_fee_agreed: number;
  status: string;
  created_at: string;
  referring_doctor: {
    full_name: string;
    avatar_url: string;
    specialization: string;
  };
  referred_doctor: {
    full_name: string;
    avatar_url: string;
    specialization: string;
  };
}

const Referrals = () => {
  const { user, profile } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'find-doctors' | 'create-referral' | 'my-referrals' | 'received-referrals' | 'my-profile'>('find-doctors');
  const [clinicDoctors, setClinicDoctors] = useState<ClinicDoctor[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [receivedReferrals, setReceivedReferrals] = useState<Referral[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<ClinicDoctor | null>(null);
  const [showReferralModal, setShowReferralModal] = useState(false);

  const [referralForm, setReferralForm] = useState({
    patient_name: '',
    patient_phone: '',
    patient_age: '',
    patient_gender: '',
    specialty_needed: '',
    procedure_type: '',
    urgency: 'routine',
    clinical_notes: '',
    medical_history: '',
    current_medications: '',
    allergies: '',
    x_rays_available: false,
    preferred_appointment_date: '',
    preferred_time_slot: '',
    consultation_fee_agreed: ''
  });

  const [clinicProfile, setClinicProfile] = useState({
    clinic_name: '',
    clinic_address: '',
    clinic_phone: '',
    specialties: [] as string[],
    is_accepting_referrals: true,
    consultation_fee: '',
    available_days: [] as string[],
    available_hours: '9:00-17:00'
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    if (!supabase) return;

    try {
      setLoading(true);

      // Fetch specialties
      const { data: specialtiesData } = await supabase
        .from('doctor_specialties')
        .select('*')
        .eq('is_active', true)
        .order('name');
      setSpecialties(specialtiesData || []);

      if (activeTab === 'find-doctors') {
        // Fetch clinic doctors
        const { data: doctorsData } = await supabase
          .from('clinic_doctors')
          .select(`
            *,
            profiles (
              full_name,
              avatar_url,
              specialization,
              phone,
              email
            )
          `)
          .eq('is_accepting_referrals', true)
          .neq('doctor_id', user.id);
        setClinicDoctors(doctorsData || []);
      } else if (activeTab === 'my-referrals') {
        // Fetch referrals made by current user
        const { data: referralsData } = await supabase
          .from('referrals')
          .select(`
            *,
            referring_doctor:profiles!referrals_referring_doctor_id_fkey (
              full_name,
              avatar_url,
              specialization
            ),
            referred_doctor:profiles!referrals_referred_doctor_id_fkey (
              full_name,
              avatar_url,
              specialization
            )
          `)
          .eq('referring_doctor_id', user.id)
          .order('created_at', { ascending: false });
        setReferrals(referralsData || []);
      } else if (activeTab === 'received-referrals') {
        // Fetch referrals received by current user
        const { data: receivedData } = await supabase
          .from('referrals')
          .select(`
            *,
            referring_doctor:profiles!referrals_referring_doctor_id_fkey (
              full_name,
              avatar_url,
              specialization
            ),
            referred_doctor:profiles!referrals_referred_doctor_id_fkey (
              full_name,
              avatar_url,
              specialization
            )
          `)
          .eq('referred_doctor_id', user.id)
          .order('created_at', { ascending: false });
        setReceivedReferrals(receivedData || []);
      } else if (activeTab === 'my-profile') {
        // Fetch current user's clinic profile
        const { data: profileData } = await supabase
          .from('clinic_doctors')
          .select('*')
          .eq('doctor_id', user.id)
          .single();
        
        if (profileData) {
          setClinicProfile({
            clinic_name: profileData.clinic_name || '',
            clinic_address: profileData.clinic_address || '',
            clinic_phone: profileData.clinic_phone || '',
            specialties: profileData.specialties || [],
            is_accepting_referrals: profileData.is_accepting_referrals,
            consultation_fee: profileData.consultation_fee?.toString() || '',
            available_days: profileData.available_days || [],
            available_hours: profileData.available_hours || '9:00-17:00'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !selectedDoctor) return;

    try {
      const { error } = await supabase
        .from('referrals')
        .insert({
          referring_doctor_id: user.id,
          referred_doctor_id: selectedDoctor.doctor_id,
          ...referralForm,
          patient_age: parseInt(referralForm.patient_age),
          consultation_fee_agreed: parseFloat(referralForm.consultation_fee_agreed) || null
        });

      if (error) throw error;

      setShowReferralModal(false);
      setReferralForm({
        patient_name: '',
        patient_phone: '',
        patient_age: '',
        patient_gender: '',
        specialty_needed: '',
        procedure_type: '',
        urgency: 'routine',
        clinical_notes: '',
        medical_history: '',
        current_medications: '',
        allergies: '',
        x_rays_available: false,
        preferred_appointment_date: '',
        preferred_time_slot: '',
        consultation_fee_agreed: ''
      });
      setSelectedDoctor(null);
      
      // Show success message
      alert('Referral sent successfully!');
    } catch (error) {
      console.error('Error creating referral:', error);
      alert('Failed to send referral. Please try again.');
    }
  };

  const handleUpdateClinicProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const profileData = {
        doctor_id: user.id,
        ...clinicProfile,
        consultation_fee: parseFloat(clinicProfile.consultation_fee) || null
      };

      const { error } = await supabase
        .from('clinic_doctors')
        .upsert(profileData);

      if (error) throw error;

      alert('Clinic profile updated successfully!');
    } catch (error) {
      console.error('Error updating clinic profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleReferralResponse = async (referralId: string, responseType: string, message?: string) => {
    if (!supabase) return;

    try {
      // Update referral status
      const newStatus = responseType === 'accept' ? 'accepted' : 'declined';
      await supabase
        .from('referrals')
        .update({ status: newStatus })
        .eq('id', referralId);

      // Create response record
      await supabase
        .from('referral_responses')
        .insert({
          referral_id: referralId,
          responding_doctor_id: user.id,
          response_type: responseType,
          message: message
        });

      // Refresh data
      fetchData();
      alert(`Referral ${responseType}ed successfully!`);
    } catch (error) {
      console.error('Error responding to referral:', error);
      alert('Failed to respond to referral. Please try again.');
    }
  };

  const filteredDoctors = clinicDoctors.filter(doctor => {
    const matchesSearch = doctor.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.clinic_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'declined': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'text-red-600 bg-red-100';
      case 'urgent': return 'text-orange-600 bg-orange-100';
      case 'routine': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <UserPlus className="h-8 w-8 mr-3 text-blue-600" />
          Doctor Referrals
        </h1>
        <p className="text-gray-600">Refer patients to specialists and manage referral requests</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'find-doctors', label: 'Find Specialists', icon: Search },
            { key: 'my-referrals', label: 'My Referrals', icon: Send },
            { key: 'received-referrals', label: 'Received Referrals', icon: MessageSquare },
            { key: 'my-profile', label: 'My Clinic Profile', icon: UserPlus }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Find Specialists Tab */}
      {activeTab === 'find-doctors' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors or clinics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty.id} value={specialty.name}>{specialty.name}</option>
              ))}
            </select>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={doctor.profiles.avatar_url || 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={doctor.profiles.full_name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.profiles.full_name}</h3>
                    <p className="text-sm text-gray-600">{doctor.profiles.specialization}</p>
                    <p className="text-sm text-blue-600 font-medium">{doctor.clinic_name}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {doctor.clinic_address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {doctor.clinic_phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {doctor.available_hours}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {doctor.specialties.map((specialty, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Fee: <span className="font-semibold text-gray-900">
                      {doctor.consultation_fee ? `${doctor.consultation_fee} EGP` : 'Contact for pricing'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setReferralForm(prev => ({
                        ...prev,
                        specialty_needed: doctor.specialties[0] || '',
                        consultation_fee_agreed: doctor.consultation_fee?.toString() || ''
                      }));
                      setShowReferralModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Refer Patient
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && !loading && (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No specialists found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      )}

      {/* My Referrals Tab */}
      {activeTab === 'my-referrals' && (
        <div className="space-y-6">
          {referrals.map((referral) => (
            <div key={referral.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Referral to Dr. {referral.referred_doctor.full_name}
                  </h3>
                  <p className="text-sm text-gray-600">Patient: {referral.patient_name}</p>
                  <p className="text-sm text-gray-600">Procedure: {referral.procedure_type}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(referral.status)}`}>
                    {referral.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getUrgencyColor(referral.urgency)}`}>
                    {referral.urgency}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Patient Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Age: {referral.patient_age}</p>
                    <p>Gender: {referral.patient_gender}</p>
                    <p>Phone: {referral.patient_phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Appointment Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Preferred Date: {referral.preferred_appointment_date}</p>
                    <p>Time Slot: {referral.preferred_time_slot}</p>
                    <p>Fee: {referral.consultation_fee_agreed} EGP</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Clinical Notes</h4>
                <p className="text-sm text-gray-600">{referral.clinical_notes}</p>
              </div>

              <div className="text-xs text-gray-500">
                Sent on {new Date(referral.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}

          {referrals.length === 0 && !loading && (
            <div className="text-center py-12">
              <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals sent</h3>
              <p className="text-gray-500">Start by finding specialists to refer your patients to</p>
            </div>
          )}
        </div>
      )}

      {/* Received Referrals Tab */}
      {activeTab === 'received-referrals' && (
        <div className="space-y-6">
          {receivedReferrals.map((referral) => (
            <div key={referral.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Referral from Dr. {referral.referring_doctor.full_name}
                  </h3>
                  <p className="text-sm text-gray-600">Patient: {referral.patient_name}</p>
                  <p className="text-sm text-gray-600">Procedure: {referral.procedure_type}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(referral.status)}`}>
                    {referral.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getUrgencyColor(referral.urgency)}`}>
                    {referral.urgency}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Patient Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Age: {referral.patient_age}</p>
                    <p>Gender: {referral.patient_gender}</p>
                    <p>Phone: {referral.patient_phone}</p>
                    {referral.medical_history && <p>Medical History: {referral.medical_history}</p>}
                    {referral.current_medications && <p>Medications: {referral.current_medications}</p>}
                    {referral.allergies && <p>Allergies: {referral.allergies}</p>}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Appointment Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Preferred Date: {referral.preferred_appointment_date}</p>
                    <p>Time Slot: {referral.preferred_time_slot}</p>
                    <p>Agreed Fee: {referral.consultation_fee_agreed} EGP</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Clinical Notes</h4>
                <p className="text-sm text-gray-600">{referral.clinical_notes}</p>
              </div>

              {referral.status === 'pending' && (
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleReferralResponse(referral.id, 'accept')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      const message = prompt('Please provide a reason for declining:');
                      if (message) {
                        handleReferralResponse(referral.id, 'decline', message);
                      }
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Decline
                  </button>
                </div>
              )}

              <div className="text-xs text-gray-500 mt-4">
                Received on {new Date(referral.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}

          {receivedReferrals.length === 0 && !loading && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals received</h3>
              <p className="text-gray-500">Set up your clinic profile to start receiving referrals</p>
            </div>
          )}
        </div>
      )}

      {/* My Clinic Profile Tab */}
      {activeTab === 'my-profile' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Clinic Profile Setup</h3>
            
            <form onSubmit={handleUpdateClinicProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clinicProfile.clinic_name}
                    onChange={(e) => setClinicProfile(prev => ({ ...prev, clinic_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={clinicProfile.clinic_phone}
                    onChange={(e) => setClinicProfile(prev => ({ ...prev, clinic_phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinic Address
                </label>
                <input
                  type="text"
                  value={clinicProfile.clinic_address}
                  onChange={(e) => setClinicProfile(prev => ({ ...prev, clinic_address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialties for Referrals *
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {specialties.map(specialty => (
                    <label key={specialty.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={clinicProfile.specialties.includes(specialty.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setClinicProfile(prev => ({
                              ...prev,
                              specialties: [...prev.specialties, specialty.name]
                            }));
                          } else {
                            setClinicProfile(prev => ({
                              ...prev,
                              specialties: prev.specialties.filter(s => s !== specialty.name)
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{specialty.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Fee (EGP)
                  </label>
                  <input
                    type="number"
                    value={clinicProfile.consultation_fee}
                    onChange={(e) => setClinicProfile(prev => ({ ...prev, consultation_fee: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Hours
                  </label>
                  <input
                    type="text"
                    value={clinicProfile.available_hours}
                    onChange={(e) => setClinicProfile(prev => ({ ...prev, available_hours: e.target.value }))}
                    placeholder="e.g., 9:00-17:00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={clinicProfile.available_days.includes(day.toLowerCase())}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setClinicProfile(prev => ({
                              ...prev,
                              available_days: [...prev.available_days, day.toLowerCase()]
                            }));
                          } else {
                            setClinicProfile(prev => ({
                              ...prev,
                              available_days: prev.available_days.filter(d => d !== day.toLowerCase())
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="accepting_referrals"
                  checked={clinicProfile.is_accepting_referrals}
                  onChange={(e) => setClinicProfile(prev => ({ ...prev, is_accepting_referrals: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="accepting_referrals" className="text-sm text-gray-700">
                  Currently accepting referrals
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Clinic Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Referral Modal */}
      {showReferralModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Refer Patient to Dr. {selectedDoctor.profiles.full_name}
              </h2>
              <button
                onClick={() => setShowReferralModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReferral} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={referralForm.patient_name}
                    onChange={(e) => setReferralForm(prev => ({ ...prev, patient_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Phone
                  </label>
                  <input
                    type="tel"
                    value={referralForm.patient_phone}
                    onChange={(e) => setReferralForm(prev => ({ ...prev, patient_phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={referralForm.patient_age}
                    onChange={(e) => setReferralForm(prev => ({ ...prev, patient_age: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={referralForm.patient_gender}
                    onChange={(e) => setReferralForm(prev => ({ ...prev, patient_gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency *
                  </label>
                  <select
                    required
                    value={referralForm.urgency}
                    onChange={(e) => setReferralForm(prev => ({ ...prev, urgency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty Needed *
                  </label>
                  <select
                    required
                    value={referralForm.specialty_needed}
                    onChange={(e) => setReferralForm(prev => ({ ...prev, specialty_needed: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select specialty</option>
                    {selectedDoctor.specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Procedure Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={referralForm.procedure_type}
                    onChange={(e) => setReferralForm(prev => ({ ...prev, procedure_type: e.target.value }))}
                    placeholder="e.g., Root canal, Extraction, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinical Notes *
                </label>
                <textarea
                  required
                  rows={4}
                  value={referralForm.clinical_notes}
                  onChange={(e) => setReferralForm(prev => ({ ...prev, clinical_notes: e.target.value }))}
                  placeholder="Describe the patient's condition, symptoms, and reason for referral..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical History
                  </label>
                  <textarea
                    rows={3}
                    value={referralForm.medical_history}
                    onChange={(e) => setReferralForm(prev => ({ ...prev, medical_history: e.target.value }))}
                    placeholder="Relevant medical history..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    rows={3}
                    value={referralForm.current_medications}
                    onChange={(e) => setReferralForm(prev => ({ ...prev, current_medications: e.target.value }))}
                    placeholder="List current medications..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergies
                </label>
                <input
                  type="text"
                  value={referralForm.allergies}
                  onChange={(e) => setReferralForm(prev => ({ ...prev, allergies: e.target.value }))}
                  placeholder="Known allergies..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={referralForm.preferred_appointment_date}
                    onChange={(e) => setReferralForm(prev => ({ ...prev, preferred_appointment_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <input
                    type="text"
                    value={referralForm.preferred_time_slot}
                    onChange={(e) => setReferralForm(prev => ({ ...prev, preferred_time_slot: e.target.value }))}
                    placeholder="e.g., Morning, 2:00 PM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Fee (EGP)
                  </label>
                  <input
                    type="number"
                    value={referralForm.consultation_fee_agreed}
                    onChange={(e) => setReferralForm(prev => ({ ...prev, consultation_fee_agreed: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowReferralModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default Referrals;