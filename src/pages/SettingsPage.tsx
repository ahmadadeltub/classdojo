import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Trash2, Globe, School, User, Calendar, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { settingsService } from '../services/settingsService';
import { Settings } from '../types';

interface SettingsPageProps {
  onSettingsSaved: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onSettingsSaved }) => {
  const [settings, setSettings] = useState<Settings>(settingsService.getSettings());
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSave = () => {
    settingsService.saveSettings(settings);
    onSettingsSaved();
    
    setSaveMessage('تم حفظ الإعدادات بنجاح! ✅');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleReset = () => {
    if (confirm('هل أنت متأكد من مسح جميع البيانات؟ لا يمكن التراجع عن هذه الخطوة.')) {
      storageService.clearAll();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl">
      {saveMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={20} />
          <span className="font-bold">{saveMessage}</span>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-900">الإعدادات</h2>
        <p className="text-slate-500">قم بتخصيص تجربتك ومعلومات مدرستك — جميع التغييرات تُحفظ تلقائياً</p>
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
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                placeholder="أدخل اسمك الكامل"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">المدرسة</label>
              <input 
                type="text" 
                value={settings.schoolName}
                onChange={(e) => setSettings({...settings, schoolName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                placeholder="أدخل اسم المدرسة"
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
                onChange={(e) => setSettings({...settings, language: e.target.value as 'ar' | 'en'})}
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
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                placeholder="مثال: 2025/2026"
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

      <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-start gap-4">
        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <h4 className="font-bold text-emerald-900 mb-1">حفظ البيانات</h4>
          <p className="text-sm text-emerald-700">جميع بياناتك (الصفوف، الطلاب، النقاط، الشارات، والإعدادات) تُحفظ تلقائياً في متصفحك. يمكنك تعديل أي شيء من الصفحات المخصصة وسيتم حفظه فوراً.</p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
          <RefreshCw size={20} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-1">دليل التعديل</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li><strong>الإعدادات:</strong> عدّل اسمك ومدرستك أعلاه ثم اضغط "حفظ الإعدادات"</li>
            <li><strong>الصفوف:</strong> اذهب إلى صفحة "الصفوف" لإنشاء وتعديل وحذف الفصول</li>
            <li><strong>الطلاب:</strong> اذهب إلى صفحة "الطلاب" لإضافة وتعديل وحذف الطلاب</li>
            <li><strong>النقاط:</strong> اذهب إلى صفحة "النقاط" لمنح نقاط للطلاب</li>
            <li><strong>الشارات:</strong> اذهب إلى صفحة "الشارات" لمنح شارات تقديرية</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
