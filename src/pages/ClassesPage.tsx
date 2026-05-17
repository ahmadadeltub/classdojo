import React, { useState } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, Users } from 'lucide-react';
import { classService } from '../services/classService';
import { studentService } from '../services/studentService';
import { ClassRoom } from '../types';

const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassRoom[]>(classService.getClasses());
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    section: '',
    academicYear: '2025/2026'
  });

  const handleOpenModal = (c?: ClassRoom) => {
    if (c) {
      setEditingClass(c);
      setFormData({ name: c.name, grade: c.grade, section: c.section, academicYear: c.academicYear });
    } else {
      setEditingClass(null);
      setFormData({ name: '', grade: '', section: '', academicYear: '2025/2026' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingClass) {
      classService.updateClass(editingClass.id, formData);
    } else {
      classService.addClass(formData);
    }
    setClasses(classService.getClasses());
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الصف؟ سيتم حذف جميع بيانات الطلاب المرتبطة به.')) {
      classService.deleteClass(id);
      setClasses(classService.getClasses());
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">إدارة الصفوف</h2>
          <p className="text-slate-500">قم بإنشاء وتعديل الفصول الدراسية الخاصة بك</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          <Plus size={20} />
          إنشاء صف جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((c) => {
          const studentCount = studentService.getStudentsByClass(c.id).length;
          return (
            <div key={c.id} className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-xl transition-all duration-300 group relative">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <GraduationCap size={24} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(c)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1">{c.name}</h3>
              <p className="text-sm text-slate-500 mb-6">{c.academicYear} • الصف {c.grade} • شعبة {c.section}</p>
              
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-3 rounded-xl">
                <Users size={18} />
                <span className="font-bold">{studentCount}</span>
                <span className="text-sm">طالب مسجل</span>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-bold mb-6">{editingClass ? 'تعديل الصف' : 'إنشاء صف جديد'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">اسم الصف</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  placeholder="مثال: الصف العاشر - أ"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">المرحلة</label>
                  <input 
                    type="text" 
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الشعبة</label>
                  <input 
                    type="text" 
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    placeholder="أ"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">العام الأكاديمي</label>
                <input 
                  type="text" 
                  value={formData.academicYear}
                  onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={handleSave} className="flex-1 btn-primary">حفظ</button>
              <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesPage;
