import React, { useState, useMemo } from 'react';
import { Trophy, Star, AlertTriangle, Plus, Minus, Search, Filter, History, UserCircle, CheckCircle2 } from 'lucide-react';
import { studentService } from '../services/studentService';
import { classService } from '../services/classService';
import { pointsService } from '../services/pointsService';
import { Student, PointType } from '../types';

const POSITIVE_REASONS = [
  { label: 'مشاركة فعّالة', icon: '🙋‍♂️', value: 1 },
  { label: 'تعاون', icon: '🤝', value: 1 },
  { label: 'التزام', icon: '✅', value: 1 },
  { label: 'إبداع', icon: '🎨', value: 2 },
  { label: 'حل الواجب', icon: '📝', value: 1 },
  { label: 'مساعدة الآخرين', icon: '🌟', value: 2 },
  { label: 'قيادة', icon: '🚩', value: 3 },
  { label: 'احترام', icon: '🙏', value: 1 },
];

const IMPROVEMENT_REASONS = [
  { label: 'يحتاج إلى تركيز', icon: '🎯', value: 1 },
  { label: 'تأخير', icon: '⏰', value: 1 },
  { label: 'عدم إحضار الواجب', icon: '📂', value: 1 },
  { label: 'مقاطعة', icon: '🚫', value: 1 },
  { label: 'استخدام غير مناسب للجهاز', icon: '📱', value: 2 },
  { label: 'يحتاج إلى متابعة', icon: '🔍', value: 1 },
];

const PointsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(studentService.getStudents());
  const classes = classService.getClasses();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || 'all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showPointModal, setShowPointModal] = useState(false);
  const [pointType, setPointType] = useState<PointType>('positive');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = selectedClass === 'all' || s.classId === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [students, searchTerm, selectedClass]);

  const handleGivePoint = (reason: { label: string, value: number }) => {
    if (!selectedStudent) return;

    pointsService.addPoint({
      studentId: selectedStudent.id,
      classId: selectedStudent.classId,
      type: pointType,
      reason: reason.label,
      value: reason.value,
    });

    setStudents(studentService.getStudents());
    setShowPointModal(false);
    setSelectedStudent(null);
    
    setSuccessMessage(`تم منح ${selectedStudent.fullName} نقطة ${reason.label} بنجاح!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 relative">
      {successMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={20} />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-900">نظام النقاط</h2>
        <p className="text-slate-500">اختر طالباً لمنحه نقاطاً تشجيعية أو ملاحظات للتحسين</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن الطالب لمنحه نقطة..."
            className="w-full pr-12 pl-4 py-3 rounded-2xl border border-slate-200 focus:border-primary-500 outline-none shadow-sm"
          />
        </div>
        <div className="w-full md:w-64">
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-primary-500 outline-none bg-white font-bold"
          >
            <option value="all">جميع الصفوف</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredStudents.map((s) => (
          <button 
            key={s.id} 
            onClick={() => {
              setSelectedStudent(s);
              setShowPointModal(true);
            }}
            className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-2 group"
          >
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md group-hover:scale-110 transition-transform"
              style={{ backgroundColor: s.avatarColor }}
            >
              {s.fullName.charAt(0)}
            </div>
            <span className="text-xs font-bold text-slate-700 truncate w-full text-center">{s.fullName}</span>
            <div className="flex gap-2">
              <span className="text-[10px] bg-success-50 text-success-600 px-2 py-0.5 rounded-full font-bold">+{s.positivePoints}</span>
              <span className="text-[10px] bg-danger-50 text-danger-600 px-2 py-0.5 rounded-full font-bold">-{s.improvementPoints}</span>
            </div>
          </button>
        ))}
      </div>

      {showPointModal && selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: selectedStudent.avatarColor }}
                >
                  {selectedStudent.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedStudent.fullName}</h3>
                  <p className="text-slate-500">{classes.find(c => c.id === selectedStudent.classId)?.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPointModal(false)}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex border-b border-slate-100">
              <button 
                onClick={() => setPointType('positive')}
                className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-all ${pointType === 'positive' ? 'text-success-600 bg-success-50 border-b-4 border-success-500' : 'text-slate-400'}`}
              >
                <Star size={20} />
                نقاط إيجابية
              </button>
              <button 
                onClick={() => setPointType('improvement')}
                className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-all ${pointType === 'improvement' ? 'text-danger-600 bg-danger-50 border-b-4 border-danger-500' : 'text-slate-400'}`}
              >
                <AlertTriangle size={20} />
                نقاط للتحسين
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(pointType === 'positive' ? POSITIVE_REASONS : IMPROVEMENT_REASONS).map((reason, i) => (
                  <button 
                    key={i}
                    onClick={() => handleGivePoint(reason)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95 ${pointType === 'positive' ? 'border-success-100 hover:border-success-500 bg-success-50/30' : 'border-danger-100 hover:border-danger-500 bg-danger-50/30'}`}
                  >
                    <span className="text-3xl">{reason.icon}</span>
                    <span className="text-xs font-bold text-slate-700 text-center">{reason.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pointType === 'positive' ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'}`}>
                      {pointType === 'positive' ? '+' : '-'}{reason.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsPage;
