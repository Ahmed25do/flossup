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
  MessageSquare,
  Award,
  Building,
  Stethoscope,
  Users,
  TrendingUp
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../components/AuthProvider';

interface SpecialistDoctor {
  id: string;
  clinic_name: string;
  clinic_address: string;
  clinic_phone: string;
  doctor_id: string;
  specialties: string[];
  governorate: string;
  city: string;
  is_accepting_requests: boolean;
  consultation_fee: number;
  commission_rate: number;
  available_days: string[];
  available_hours: string;
  rating: number;
  completed_cases: number;
  profiles: {
    full_name: string;
    avatar_url: string;
    specialization: string;
    phone: string;
    email: string;
    bio: string;
    years_experience: number;
    university: string;
    graduation_year: number;
  };
}

interface DoctorRequest {
  id: string;
  clinic_id: string;
  clinic_name: string;
  requesting_doctor_id: string;
  specialist_doctor_id: string;
  specialty_needed: string;
  requested_date: string;
  requested_time: string;
  case_description: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  urgency: string;
  status: string;
  commission_amount: number;
  created_at: string;
  requesting_doctor: {
    full_name: string;
    avatar_url: string;
    specialization: string;
  };
  specialist_doctor: {
    full_name: string;
    avatar_url: string;
    specialization: string;
  };
}

const SpecialistDoctor = () => {
  const { user, profile } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'find-specialists' | 'create-request' | 'my-requests' | 'received-requests' | 'my-profile'>('find-specialists');
  const [specialists, setSpecialists] = useState<SpecialistDoctor[]>([]);
  const [requests, setRequests] = useState<DoctorRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<DoctorRequest[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [governorates, setGovernorates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<SpecialistDoctor | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const [requestForm, setRequestForm] = useState({
    clinic_name: '',
    specialty_needed: '',
    requested_date: '',
    requested_time: '',
    case_description: '',
    patient_name: '',
    patient_age: '',
    patient_gender: '',
    urgency: 'routine'
  });

  const [doctorProfile, setDoctorProfile] = useState({
    clinic_name: '',
    clinic_address: '',
    clinic_phone: '',
    governorate: '',
    city: '',
    specialties: [] as string[],
    is_accepting_requests: true,
    consultation_fee: '',
    commission_rate: 10,
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

      // Set governorates (Egyptian governorates)
      setGovernorates([
        'Cairo', 'Alexandria', 'Giza', 'Qalyubia', 'Port Said', 'Suez',
        'Luxor', 'Aswan', 'Asyut', 'Beheira', 'Beni Suef', 'Dakahlia',
        'Damietta', 'Fayyum', 'Gharbia', 'Ismailia', 'Kafr el-Sheikh',
        'Matrouh', 'Minya', 'Monufia', 'New Valley', 'North Sinai',
        'Qena', 'Red Sea', 'Sharqia', 'Sohag', 'South Sinai'
      ]);

      if (activeTab === 'find-specialists') {
        // Fetch specialist doctors
        const { data: specialistsData } = await supabase
          .from('specialist_doctors')
          .select(`
            *,
            profiles (
              full_name,
              avatar_url,
              specialization,
              phone,
              email,
              bio,
              years_experience,
              university,
              graduation_year
            )
          `)
          .eq('is_accepting_requests', true)
          .neq('doctor_id', user.id);
        setSpecialists(specialistsData || []);
      } else if (activeTab === 'my-requests') {
        // Fetch requests made by current user
        const { data: requestsData } = await supabase
          .from('doctor_requests')
          .select(`
            *,
            requesting_doctor:profiles!doctor_requests_requesting_doctor_id_fkey (
              full_name,
              avatar_url,
              specialization
            ),
            specialist_doctor:profiles!doctor_requests_specialist_doctor_id_fkey (
              full_name,
              avatar_url,
              specialization
            )
          `)
          .eq('requesting_doctor_id', user.id)
          .order('created_at', { ascending: false });
        setRequests(requestsData || []);
      } else if (activeTab === 'received-requests') {
        // Fetch requests received by current user
        const { data: receivedData } = await supabase
          .from('doctor_requests')
          .select(`
            *,
            requesting_doctor:profiles!doctor_requests_requesting_doctor_id_fkey (
              full_name,
              avatar_url,
              specialization
            ),
            specialist_doctor:profiles!doctor_requests_specialist_doctor_id_fkey (
              full_name,
              avatar_url,
              specialization
            )
          `)
          .eq('specialist_doctor_id', user.id)
          .order('created_at', { ascending: false });
        setReceivedRequests(receivedData || []);
      } else if (activeTab === 'my-profile') {
        // Fetch current user's specialist profile
        const { data: profileData } = await supabase
          .from('specialist_doctors')
          .select('*')
          .eq('doctor_id', user.id)
          .single();
        
        if (profileData) {
          setDoctorProfile({
            clinic_name: profileData.clinic_name || '',
            clinic_address: profileData.clinic_address || '',
            clinic_phone: profileData.clinic_phone || '',
            governorate: profileData.governorate || '',
            city: profileData.city || '',
            specialties: profileData.specialties || [],
            is_accepting_requests: profileData.is_accepting_requests,
            consultation_fee: profileData.consultation_fee?.toString() || '',
            commission_rate: profileData.commission_rate || 10,
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

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !selectedDoctor) return;

    try {
      const commissionAmount = (parseFloat(selectedDoctor.consultation_fee.toString()) * selectedDoctor.commission_rate) / 100;

      const { error } = await supabase
        .from('doctor_requests')
        .insert({
          requesting_doctor_id: user.id,
          specialist_doctor_id: selectedDoctor.doctor_id,
          clinic_name: requestForm.clinic_name,
          specialty_needed: requestForm.specialty_needed,
          requested_date: requestForm.requested_date,
          requested_time: requestForm.requested_time,
          case_description: requestForm.case_description,
          patient_name: requestForm.patient_name,
          patient_age: parseInt(requestForm.patient_age),
          patient_gender: requestForm.patient_gender,
          urgency: requestForm.urgency,
          commission_amount: commissionAmount
        });

      if (error) throw error;

      setShowRequestModal(false);
      setRequestForm({
        clinic_name: '',
        specialty_needed: '',
        requested_date: '',
        requested_time: '',
        case_description: '',
        patient_name: '',
        patient_age: '',
        patient_gender: '',
        urgency: 'routine'
      });
      setSelectedDoctor(null);
      
      alert('Request sent successfully!');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to send request. Please try again.');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    try {
      const profileData = {
        doctor_id: user.id,
        ...doctorProfile,
        consultation_fee: parseFloat(doctorProfile.consultation_fee) || null
      };

      const { error } = await supabase
        .from('specialist_doctors')
        .upsert(profileData);

      if (error) throw error;

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleRequestResponse = async (requestId: string, responseType: string, message?: string) => {
    if (!supabase) return;

    try {
      const newStatus = responseType === 'accept' ? 'accepted' : 'declined';
      await supabase
        .from('doctor_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      fetchData();
      alert(`Request ${responseType}ed successfully!`);
    } catch (error) {
      console.error('Error responding to request:', error);
      alert('Failed to respond to request. Please try again.');
    }
  };

  const filteredSpecialists = specialists.filter(doctor => {
    const matchesSearch = doctor.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.clinic_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialties.includes(selectedSpecialty);
    const matchesGovernorate = !selectedGovernorate || doctor.governorate === selectedGovernorate;
    return matchesSearch && matchesSpecialty && matchesGovernorate;
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
          <Stethoscope className="h-8 w-8 mr-3 text-blue-600" />
          Specialist Doctor
        </h1>
        <p className="text-gray-600">Connect with specialist doctors and manage consultation requests</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'find-specialists', label: 'Find Specialists', icon: Search },
            { key: 'my-requests', label: 'My Requests', icon: Send },
            { key: 'received-requests', label: 'Received Requests', icon: MessageSquare },
            { key: 'my-profile', label: 'My Specialist Profile', icon: UserPlus }
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
      {activeTab === 'find-specialists' && (
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

            <select
              value={selectedGovernorate}
              onChange={(e) => setSelectedGovernorate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Governorates</option>
              {governorates.map(gov => (
                <option key={gov} value={gov}>{gov}</option>
              ))}
            </select>
          </div>

          {/* Specialists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpecialists.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={doctor.profiles.avatar_url || 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={doctor.profiles.full_name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.profiles.full_name}</h3>
                    <p className="text-sm text-gray-600">{doctor.profiles.specialization}</p>
                    <p className="text-sm text-blue-600 font-medium">{doctor.clinic_name}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{doctor.rating} ({doctor.completed_cases} cases)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {doctor.city}, {doctor.governorate}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {doctor.clinic_phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {doctor.available_hours}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Award className="h-4 w-4 mr-2" />
                    {doctor.profiles.years_experience} years experience
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
                      {doctor.consultation_fee} EGP
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setRequestForm(prev => ({
                        ...prev,
                        specialty_needed: doctor.specialties[0] || ''
                      }));
                      setShowRequestModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Request Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredSpecialists.length === 0 && !loading && (
            <div className="text-center py-12">
              <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No specialists found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      )}

      {/* My Requests Tab */}
      {activeTab === 'my-requests' && (
        <div className="space-y-6">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Request to Dr. {request.specialist_doctor.full_name}
                  </h3>
                  <p className="text-sm text-gray-600">Patient: {request.patient_name}</p>
                  <p className="text-sm text-gray-600">Specialty: {request.specialty_needed}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getUrgencyColor(request.urgency)}`}>
                    {request.urgency}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Patient Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Age: {request.patient_age}</p>
                    <p>Gender: {request.patient_gender}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Appointment Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Requested Date: {request.requested_date}</p>
                    <p>Time: {request.requested_time}</p>
                    <p>Commission: {request.commission_amount} EGP</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Case Description</h4>
                <p className="text-sm text-gray-600">{request.case_description}</p>
              </div>

              <div className="text-xs text-gray-500">
                Sent on {new Date(request.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}

          {requests.length === 0 && !loading && (
            <div className="text-center py-12">
              <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests sent</h3>
              <p className="text-gray-500">Start by finding specialists to request consultations</p>
            </div>
          )}
        </div>
      )}

      {/* Received Requests Tab */}
      {activeTab === 'received-requests' && (
        <div className="space-y-6">
          {receivedRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Request from Dr. {request.requesting_doctor.full_name}
                  </h3>
                  <p className="text-sm text-gray-600">Clinic: {request.clinic_name}</p>
                  <p className="text-sm text-gray-600">Patient: {request.patient_name}</p>
                  <p className="text-sm text-gray-600">Specialty: {request.specialty_needed}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getUrgencyColor(request.urgency)}`}>
                    {request.urgency}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Patient Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Age: {request.patient_age}</p>
                    <p>Gender: {request.patient_gender}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Appointment Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Requested Date: {request.requested_date}</p>
                    <p>Time: {request.requested_time}</p>
                    <p>Your Commission: {request.commission_amount} EGP</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Case Description</h4>
                <p className="text-sm text-gray-600">{request.case_description}</p>
              </div>

              {request.status === 'pending' && (
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleRequestResponse(request.id, 'accept')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequestResponse(request.id, 'decline')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Decline
                  </button>
                </div>
              )}

              <div className="text-xs text-gray-500 mt-4">
                Received on {new Date(request.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}

          {receivedRequests.length === 0 && !loading && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests received</h3>
              <p className="text-gray-500">Set up your specialist profile to start receiving requests</p>
            </div>
          )}
        </div>
      )}

      {/* My Specialist Profile Tab */}
      {activeTab === 'my-profile' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Specialist Profile Setup</h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={doctorProfile.clinic_name}
                    onChange={(e) => setDoctorProfile(prev => ({ ...prev, clinic_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={doctorProfile.clinic_phone}
                    onChange={(e) => setDoctorProfile(prev => ({ ...prev, clinic_phone: e.target.value }))}
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
                  value={doctorProfile.clinic_address}
                  onChange={(e) => setDoctorProfile(prev => ({ ...prev, clinic_address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Governorate *
                  </label>
                  <select
                    required
                    value={doctorProfile.governorate}
                    onChange={(e) => setDoctorProfile(prev => ({ ...prev, governorate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select governorate</option>
                    {governorates.map(gov => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={doctorProfile.city}
                    onChange={(e) => setDoctorProfile(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialties for Consultations *
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {specialties.map(specialty => (
                    <label key={specialty.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={doctorProfile.specialties.includes(specialty.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDoctorProfile(prev => ({
                              ...prev,
                              specialties: [...prev.specialties, specialty.name]
                            }));
                          } else {
                            setDoctorProfile(prev => ({
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Fee (EGP)
                  </label>
                  <input
                    type="number"
                    value={doctorProfile.consultation_fee}
                    onChange={(e) => setDoctorProfile(prev => ({ ...prev, consultation_fee: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="20"
                    value={doctorProfile.commission_rate}
                    onChange={(e) => setDoctorProfile(prev => ({ ...prev, commission_rate: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Hours
                  </label>
                  <input
                    type="text"
                    value={doctorProfile.available_hours}
                    onChange={(e) => setDoctorProfile(prev => ({ ...prev, available_hours: e.target.value }))}
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
                        checked={doctorProfile.available_days.includes(day.toLowerCase())}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDoctorProfile(prev => ({
                              ...prev,
                              available_days: [...prev.available_days, day.toLowerCase()]
                            }));
                          } else {
                            setDoctorProfile(prev => ({
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
                  id="accepting_requests"
                  checked={doctorProfile.is_accepting_requests}
                  onChange={(e) => setDoctorProfile(prev => ({ ...prev, is_accepting_requests: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="accepting_requests" className="text-sm text-gray-700">
                  Currently accepting consultation requests
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Specialist Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Request Consultation with Dr. {selectedDoctor.profiles.full_name}
              </h2>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={requestForm.clinic_name}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, clinic_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty Needed *
                  </label>
                  <select
                    required
                    value={requestForm.specialty_needed}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, specialty_needed: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select specialty</option>
                    {selectedDoctor.specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requested Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={requestForm.requested_date}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, requested_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requested Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={requestForm.requested_time}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, requested_time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={requestForm.patient_name}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, patient_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Age
                  </label>
                  <input
                    type="number"
                    value={requestForm.patient_age}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, patient_age: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Gender
                  </label>
                  <select
                    value={requestForm.patient_gender}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, patient_gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency *
                </label>
                <select
                  required
                  value={requestForm.urgency}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, urgency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={requestForm.case_description}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, case_description: e.target.value }))}
                  placeholder="Describe the patient's condition and reason for consultation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Consultation Details</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>Consultation Fee: {selectedDoctor.consultation_fee} EGP</p>
                  <p>Platform Commission ({selectedDoctor.commission_rate}%): {((selectedDoctor.consultation_fee * selectedDoctor.commission_rate) / 100).toFixed(2)} EGP</p>
                  <p>Doctor Receives: {(selectedDoctor.consultation_fee - ((selectedDoctor.consultation_fee * selectedDoctor.commission_rate) / 100)).toFixed(2)} EGP</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Request
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

export default SpecialistDoctor;