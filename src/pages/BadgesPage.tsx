import React, { useState } from 'react';
import { Award, Star, Search, UserCircle, CheckCircle2 } from 'lucide-react';
import { studentService } from '../services/studentService';
import { classService } from '../services/classService';
import { badgeService, DEFAULT_BADGES } from '../services/badgeService';
import { Student, Badge } from '../types';

const BadgesPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(studentService.getStudents());
  const classes = classService.getClasses();
  const badges = badgeService.getBadges();

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAssignBadge = (badge: Badge) => {
    if (!selectedStudent) return;

    const currentBadges = selectedStudent.badges || [];
    if (currentBadges.includes(badge.id)) {
        alert('هذا الطالب يمتلك هذه الشارة بالفعل');
        return;
    }

    studentService.updateStudent(selectedStudent.id, {
      badges: [...currentBadges, badge.id]
    });

    setStudents(studentService.getStudents());
    setShowBadgeModal(false);
    setSelectedStudent(null);
    
    setSuccessMessage(`تم منح شارة "${badge.title}" لـ ${selectedStudent.fullName} بنجاح!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {successMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-primary-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <Award size={20} />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-900">نظام الشارات</h2>
        <p className="text-slate-500">كافئ التميز والسلوكيات الاستثنائية بشارات تقديرية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((badge) => (
          <div key={badge.id} className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col items-center text-center gap-4 group hover:shadow-lg transition-shadow">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${badge.color}20`, border: `2px solid ${badge.color}` }}
            >
              {badge.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{badge.title}</h3>
              <p className="text-sm text-slate-500">{badge.description}</p>
            </div>
            <button 
              onClick={() => {
                setShowBadgeModal(true);
              }}
              className="w-full mt-2 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
              منح لشخص ما
            </button>
          </div>
        ))}
      </div>

      {showBadgeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900">اختر طالباً للمنح</h3>
              <button onClick={() => setShowBadgeModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
              {students.map(s => (
                <button 
                  key={s.id}
                  onClick={() => {
                    setSelectedStudent(s);
                    // Next step: show badge selection or just use a simple flow
                  }}
                  className={`w-full p-4 rounded-2xl border flex items-center justify-between hover:bg-slate-50 transition-all ${selectedStudent?.id === s.id ? 'border-primary-500 bg-primary-50' : 'border-slate-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: s.avatarColor }}>
                      {s.fullName.charAt(0)}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{s.fullName}</p>
                      <p className="text-xs text-slate-500">{classes.find(c => c.id === s.classId)?.name}</p>
                    </div>
                  </div>
                  {selectedStudent?.id === s.id && <CheckCircle2 className="text-primary-600" />}
                </button>
              ))}
            </div>

            {selectedStudent && (
              <div className="mt-8 border-t border-slate-100 pt-6">
                <p className="text-sm font-bold text-slate-700 mb-4">اختر الشارة لمنحها لـ {selectedStudent.fullName}:</p>
                <div className="grid grid-cols-4 gap-3">
                  {badges.map(b => (
                    <button 
                      key={b.id}
                      onClick={() => handleAssignBadge(b)}
                      className="p-3 rounded-xl border border-slate-100 hover:border-primary-300 hover:bg-primary-50 transition-all flex flex-col items-center gap-1"
                    >
                      <span className="text-2xl">{b.icon}</span>
                      <span className="text-[10px] font-bold text-slate-600 text-center">{b.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgesPage;
