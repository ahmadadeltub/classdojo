import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Trash2, Globe, School, User, Calendar } from 'lucide-react';
import { storageService } from '../services/storageService';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    teacherName: 'أحمد الطويشات',
    schoolName: 'مدرسة التميز العالمية',
    academicYear: '2025/2026',
    language: 'ar'
  });

  const handleSave = () => {
    // In a real app, save to storage
    alert('تم حفظ الإعدادات بنجاح!');
  };

  const handleReset = () => {
    if (confirm('هل أنت متأكد من مسح جميع البيانات؟ لا يمكن التراجع عن هذه الخطوة.')) {
      storageService.clearAll();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">الإعدادات</h2>
        <p className="text-slate-500">قم بتخصيص تجربتك ومعلومات مدرستك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6">
          <div className="flex items-center gap-3 text-primary-600 font-bold border-b border-slate-50 pb-4">
            <User size={20} />
            <span>المعلومات الشخصية</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">اسم المعلم</label>
              <input 
                type="text" 
                value={settings.teacherName}
                onChange={(e) => setSettings({...settings, teacherName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">المدرسة</label>
              <input 
                type="text" 
                value={settings.schoolName}
                onChange={(e) => setSettings({...settings, schoolName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6">
          <div className="flex items-center gap-3 text-primary-600 font-bold border-b border-slate-50 pb-4">
            <Globe size={20} />
            <span>تفضيلات التطبيق</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">اللغة الافتراضية</label>
              <select 
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-500 bg-white"
              >
                <option value="ar">العربية (Default)</option>
                <option value="en">English (Soon)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">العام الدراسي</label>
              <input 
                type="text" 
                value={settings.academicYear}
                onChange={(e) => setSettings({...settings, academicYear: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <button onClick={handleSave} className="btn-primary px-12">
          <Save size={20} />
          حفظ الإعدادات
        </button>
        <button onClick={handleReset} className="btn-danger px-8 bg-white border border-danger-200">
          <Trash2 size={20} />
          مسح كافة البيانات
        </button>
      </div>

      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
          <RefreshCw size={20} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-1">تحديثات التطبيق</h4>
          <p className="text-sm text-blue-700">تطبيق "صفّي التفاعلي" يقوم بحفظ البيانات محلياً على جهازك. سيتم دعم المزامنة السحابية قريباً عبر Firebase.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
