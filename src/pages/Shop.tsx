import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Stethoscope,
  Zap,
  BookOpen,
  Scissors,
  Shield,
  Flask,
  Settings,
  Cpu,
  Smile,
  CircleDot,
  Crown,
  Microscope
} from 'lucide-react';

const Shop = () => {
  const [activeTab, setActiveTab] = useState('التصنيفات');

  const categories = [
    {
      id: 'surgery',
      name: 'Surgery',
      nameAr: 'الجراحة',
      icon: Stethoscope,
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-500'
    },
    {
      id: 'implantology',
      name: 'Implantology',
      nameAr: 'زراعة الأسنان',
      icon: Zap,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-500'
    },
    {
      id: 'physical-courses',
      name: 'Physical Courses',
      nameAr: 'الدورات الحضورية',
      icon: BookOpen,
      color: 'bg-gray-50 border-gray-200',
      iconColor: 'text-gray-500'
    },
    {
      id: 'disposable-material',
      name: 'Disposable Material',
      nameAr: 'المواد المستهلكة',
      icon: Scissors,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-500'
    },
    {
      id: 'sterilization-material',
      name: 'Sterilization Material',
      nameAr: 'مواد التعقيم',
      icon: Shield,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-500'
    },
    {
      id: 'laboratories',
      name: 'Laboratories',
      nameAr: 'المختبرات',
      icon: Flask,
      color: 'bg-cyan-50 border-cyan-200',
      iconColor: 'text-cyan-500'
    },
    {
      id: 'machine-inquiries',
      name: 'Machine Inquiries',
      nameAr: 'استفسارات الأجهزة',
      icon: Settings,
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-500'
    },
    {
      id: 'machines',
      name: 'Machines',
      nameAr: 'الأجهزة',
      icon: Cpu,
      color: 'bg-teal-50 border-teal-200',
      iconColor: 'text-teal-500'
    },
    {
      id: 'oral-care-system',
      name: 'Oral Care System',
      nameAr: 'نظام العناية بالفم',
      icon: Smile,
      color: 'bg-pink-50 border-pink-200',
      iconColor: 'text-pink-500'
    },
    {
      id: 'burs',
      name: 'Burs',
      nameAr: 'الأدوات الدوارة',
      icon: CircleDot,
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-600'
    },
    {
      id: 'anesthesia',
      name: 'Anesthesia',
      nameAr: 'التخدير',
      icon: Crown,
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-500'
    },
    {
      id: 'radiology',
      name: 'Radiology',
      nameAr: 'الأشعة',
      icon: Microscope,
      color: 'bg-emerald-50 border-emerald-200',
      iconColor: 'text-emerald-500'
    }
  ];

  const tabs = [
    { key: 'التصنيفات', label: 'التصنيفات' },
    { key: 'الموردون', label: 'الموردون' },
    { key: 'العلامات التجارية', label: 'العلامات التجارية' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ShoppingCart className="h-6 w-6 text-gray-600 ml-3" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">استكشاف</h1>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="بحث"
            className="w-full pr-10 pl-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-right"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {activeTab === 'التصنيفات' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className={`${category.color} border-2 rounded-2xl p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full ${category.color}`}>
                    <Icon className={`h-8 w-8 ${category.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.nameAr}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Suppliers Tab */}
      {activeTab === 'الموردون' && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">الموردون</h3>
            <p className="text-gray-600">قائمة الموردين المعتمدين</p>
          </div>
        </div>
      )}

      {/* Brands Tab */}
      {activeTab === 'العلامات التجارية' && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">العلامات التجارية</h3>
            <p className="text-gray-600">العلامات التجارية المتاحة</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;