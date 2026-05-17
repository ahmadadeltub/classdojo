import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, UserPlus, Filter, UserCircle } from 'lucide-react';
import { studentService } from '../services/studentService';
import { classService } from '../services/classService';
import { Student, ClassRoom } from '../types';

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(studentService.getStudents());
  const classes = classService.getClasses();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    classId: '',
    avatarColor: '#3b82f6'
  });

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = selectedClass === 'all' || s.classId === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [students, searchTerm, selectedClass]);

  const handleOpenModal = (s?: Student) => {
    if (s) {
      setEditingStudent(s);
      setFormData({ fullName: s.fullName, classId: s.classId, avatarColor: s.avatarColor });
    } else {
      setEditingStudent(null);
      setFormData({ fullName: '', classId: classes[0]?.id || '', avatarColor: '#3b82f6' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingStudent) {
      studentService.updateStudent(editingStudent.id, formData);
    } else {
      studentService.addStudent(formData);
    }
    setStudents(studentService.getStudents());
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      studentService.deleteStudent(id);
      setStudents(studentService.getStudents());
    }
  };

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#71717a'];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">إدارة الطلاب</h2>
          <p className="text-slate-500">أضف وقم بإدارة ملفات الطلاب في صفوفك</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary w-full md:w-auto">
          <UserPlus size={20} />
          إضافة طالب جديد
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث عن طالب..."
            className="w-full pr-12 pl-4 py-3 rounded-2xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
        </div>
        <div className="w-full md:w-64 relative">
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full pr-12 pl-4 py-3 rounded-2xl border border-slate-200 focus:border-primary-500 outline-none appearance-none bg-white font-bold text-slate-700"
          >
            <option value="all">جميع الصفوف</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredStudents.map((s) => {
          const className = classes.find(c => c.id === s.classId)?.name || 'غير محدد';
          return (
            <div key={s.id} className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-xl transition-all duration-300 group">
              <div className="flex flex-col items-center text-center">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg ring-4 ring-slate-50"
                  style={{ backgroundColor: s.avatarColor }}
                >
                  {s.fullName.charAt(0)}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">{s.fullName}</h3>
                <p className="text-xs text-primary-600 font-bold mb-4">{className}</p>
                
                <div className="grid grid-cols-2 w-full gap-2 mb-6">
                  <div className="bg-success-50 p-2 rounded-xl">
                    <p className="text-[10px] text-success-600 font-bold">إيجابي</p>
                    <p className="text-lg font-bold text-success-700">+{s.positivePoints}</p>
                  </div>
                  <div className="bg-danger-50 p-2 rounded-xl">
                    <p className="text-[10px] text-danger-600 font-bold">تحسين</p>
                    <p className="text-lg font-bold text-danger-700">-{s.improvementPoints}</p>
                  </div>
                </div>

                <div className="flex gap-2 w-full">
                  <button onClick={() => handleOpenModal(s)} className="flex-1 btn-secondary text-xs py-2">تعديل</button>
                  <button onClick={() => handleDelete(s.id)} className="flex-1 btn-danger text-xs py-2">حذف</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-bold mb-6">{editingStudent ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">اسم الطالب رباعي</label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 outline-none"
                  placeholder="أدخل اسم الطالب..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">الصف</label>
                <select 
                  value={formData.classId}
                  onChange={(e) => setFormData({...formData, classId: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 outline-none bg-white"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">لون الرمز (الأفاتار)</label>
                <div className="flex flex-wrap gap-3">
                  {colors.map(c => (
                    <button 
                      key={c}
                      onClick={() => setFormData({...formData, avatarColor: c})}
                      className={`w-8 h-8 rounded-full transition-transform ${formData.avatarColor === c ? 'ring-4 ring-slate-200 scale-125' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
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

export default StudentsPage;
