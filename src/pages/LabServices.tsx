import React, { useState } from 'react';
import { 
  Microscope, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Camera,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Package
} from 'lucide-react';

const LabServices = () => {
  const [activeTab, setActiveTab] = useState<'request' | 'track' | 'history'>('request');
  const [selectedService, setSelectedService] = useState('');

  const services = [
    { id: 'crown', name: 'Crown & Bridge', turnaround: '5-7 days', price: '$350' },
    { id: 'implant', name: 'Implant Restoration', turnaround: '7-10 days', price: '$450' },
    { id: 'denture', name: 'Complete Denture', turnaround: '10-14 days', price: '$800' },
    { id: 'partial', name: 'Partial Denture', turnaround: '7-10 days', price: '$600' },
    { id: 'orthodontic', name: 'Orthodontic Appliance', turnaround: '3-5 days', price: '$200' },
    { id: 'nightguard', name: 'Night Guard', turnaround: '3-5 days', price: '$150' }
  ];

  const currentCases = [
    {
      id: 'LAB001',
      service: 'Crown & Bridge',
      patient: 'John Smith',
      dateSubmitted: '2024-12-10',
      expectedDelivery: '2024-12-15',
      status: 'In Progress',
      stage: 'Wax-up Complete',
      progress: 60
    },
    {
      id: 'LAB002',
      service: 'Implant Restoration',
      patient: 'Sarah Johnson',
      dateSubmitted: '2024-12-08',
      expectedDelivery: '2024-12-18',
      status: 'Ready for Pickup',
      stage: 'Final Polish',
      progress: 100
    },
    {
      id: 'LAB003',
      service: 'Night Guard',
      patient: 'Mike Wilson',
      dateSubmitted: '2024-12-11',
      expectedDelivery: '2024-12-16',
      status: 'In Queue',
      stage: 'Awaiting Production',
      progress: 20
    }
  ];

  const caseHistory = [
    {
      id: 'LAB098',
      service: 'Crown & Bridge',
      patient: 'Emily Davis',
      dateSubmitted: '2024-11-28',
      dateCompleted: '2024-12-05',
      status: 'Completed',
      price: '$350'
    },
    {
      id: 'LAB097',
      service: 'Partial Denture',
      patient: 'Robert Brown',
      dateSubmitted: '2024-11-25',
      dateCompleted: '2024-12-02',
      status: 'Completed',
      price: '$600'
    },
    {
      id: 'LAB096',
      service: 'Night Guard',
      patient: 'Lisa Taylor',
      dateSubmitted: '2024-11-20',
      dateCompleted: '2024-11-25',
      status: 'Completed',
      price: '$150'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready for Pickup': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'In Queue': return 'text-yellow-600 bg-yellow-100';
      case 'Completed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting lab request');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Microscope className="h-8 w-8 mr-3 text-blue-600" />
          Dental Lab Services
        </h1>
        <p className="text-gray-600">Professional lab work with quality assurance and fast turnaround</p>
      </div>

      {/* Lab Partner Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg border border-blue-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-xl font-semibold text-gray-900">ProDental Laboratory</h2>
            <p className="text-gray-600">Your trusted lab partner for over 15 years</p>
            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                123 Lab Street, Dental City
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                (555) 123-4567
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                orders@prodental.com
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">98.5%</div>
            <div className="text-sm text-gray-600">Quality Rating</div>
            <div className="text-sm text-gray-500">Based on 1,247 cases</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'request', label: 'New Request', icon: Upload },
            { key: 'track', label: 'Track Cases', icon: Package },
            { key: 'history', label: 'Case History', icon: FileText }
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

      {/* New Request Tab */}
      {activeTab === 'request' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Services</h3>
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedService === service.id
                        ? 'bg-blue-50 border-blue-200 border'
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {service.turnaround}
                      </span>
                      <span className="font-semibold text-blue-600">{service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Request Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Submit Lab Request</h3>
              <form onSubmit={handleSubmitRequest} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type *
                    </label>
                    <select
                      required
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tooth Number(s) *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 8, 9, 10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shade *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., A2, B1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any specific requirements or notes for the lab..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Files
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload impressions, photos, or X-rays
                    </p>
                    <p className="text-xs text-gray-500">
                      Drag and drop files here, or click to browse
                    </p>
                    <input type="file" multiple className="hidden" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requested Delivery Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Standard</option>
                      <option>Rush (+$50)</option>
                      <option>Emergency (+$100)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Estimated cost: <span className="font-semibold text-gray-900">$350</span>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Track Cases Tab */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          {currentCases.map((caseItem) => (
            <div key={caseItem.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Case #{caseItem.id}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Service:</span> {caseItem.service}</p>
                    <p><span className="font-medium">Patient:</span> {caseItem.patient}</p>
                    <p><span className="font-medium">Submitted:</span> {caseItem.dateSubmitted}</p>
                    <p><span className="font-medium">Expected Delivery:</span> {caseItem.expectedDelivery}</p>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0 lg:text-right">
                  <div className="text-sm text-gray-600 mb-2">Current Stage</div>
                  <div className="text-lg font-semibold text-blue-600">{caseItem.stage}</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{caseItem.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${caseItem.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Details
                </button>
                <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                  Contact Lab
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Case History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Completed Cases</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Case ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {caseHistory.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {caseItem.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {caseItem.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {caseItem.patient}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {caseItem.dateSubmitted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {caseItem.dateCompleted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {caseItem.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <button className="hover:text-blue-700">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabServices;