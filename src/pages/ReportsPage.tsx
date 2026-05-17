import React, { useState } from 'react';
import { BarChart3, FileText, Download, Printer, Copy, Share2, TrendingUp, Users, Award } from 'lucide-react';
import { studentService } from '../services/studentService';
import { classService } from '../services/classService';
import { pointsService } from '../services/pointsService';
import { badgeService } from '../services/badgeService';

const ReportsPage: React.FC = () => {
  const students = studentService.getStudents();
  const classes = classService.getClasses();
  const points = pointsService.getPoints();
  const badges = badgeService.getBadges();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const selectedClass = classes.find(c => c.id === selectedClassId);
  const classStudents = students.filter(s => s.classId === selectedClassId);

  // Top 5 Students
  const topStudents = [...classStudents]
    .sort((a, b) => b.positivePoints - a.positivePoints)
    .slice(0, 5);

  const generateReportText = () => {
    if (!selectedClass) return '';
    
    let text = `تقرير صف: ${selectedClass.name}\n`;
    text += `العام الأكاديمي: ${selectedClass.academicYear}\n`;
    text += `إجمالي الطلاب: ${classStudents.length}\n\n`;
    text += `قائمة التميز (أعلى 5 طلاب):\n`;
    topStudents.forEach((s, i) => {
      text += `${i + 1}. ${s.fullName} - ${s.positivePoints} نقطة إيجابية\n`;
    });
    
    return text;
  };

  const handleInsertToPowerPoint = async () => {
    const reportText = generateReportText();
    
    /* global Office */
    if (typeof Office !== 'undefined' && Office.context && Office.context.document) {
      Office.context.document.setSelectedDataAsync(reportText, {
        coercionType: Office.CoercionType.Text
      }, (result) => {
        if (result.status === Office.AsyncResultStatus.Failed) {
          alert('حدث خطأ أثناء الإدراج في الشريحة. يرجى نسخ التقرير يدوياً.');
        } else {
          alert('تم إدراج التقرير في الشريحة الحالية بنجاح!');
        }
      });
    } else {
      alert('هذه الميزة تعمل فقط داخل PowerPoint. يمكنك نسخ التقرير حالياً.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    alert('تم نسخ التقرير إلى الحافظة');
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">التقارير والتحليلات</h2>
          <p className="text-slate-500">استعرض أداء طلابك وقم بتوليد تقارير للعروض التقديمية</p>
        </div>
        <div className="flex gap-2">
           <button onClick={handleCopy} className="btn-secondary">
             <Copy size={18} />
             نسخ
           </button>
           <button onClick={handleInsertToPowerPoint} className="btn-primary">
             <Share2 size={18} />
             إدراج في PowerPoint
           </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
        <span className="font-bold text-slate-700">اختر الصف:</span>
        <select 
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="bg-slate-50 border-none rounded-xl px-4 py-2 font-bold text-primary-600 outline-none"
        >
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="text-primary-600" size={20} />
                أداء الطلاب (أعلى 5)
              </h3>
            </div>
            <div className="p-6">
               <div className="space-y-6">
                 {topStudents.map((s, i) => (
                   <div key={s.id} className="space-y-2">
                     <div className="flex justify-between items-center">
                       <span className="font-bold text-slate-700">{i + 1}. {s.fullName}</span>
                       <span className="text-sm font-bold text-primary-600">{s.positivePoints} نقطة</span>
                     </div>
                     <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-primary-500 rounded-full transition-all duration-1000"
                         style={{ width: `${(s.positivePoints / (topStudents[0]?.positivePoints || 1)) * 100}%` }}
                       />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
             <div className="flex justify-between items-start mb-8">
               <div>
                 <h3 className="text-xl font-bold mb-1">معاينة التقرير</h3>
                 <p className="text-slate-400 text-sm">هذا هو النص الذي سيتم إدراجه في PowerPoint</p>
               </div>
               <FileText className="text-primary-400" size={32} />
             </div>
             <pre className="bg-slate-800/50 p-6 rounded-2xl font-mono text-sm leading-relaxed whitespace-pre-wrap border border-slate-700">
               {generateReportText()}
             </pre>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-3xl border border-slate-100 p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users size={18} className="text-blue-500" />
                ملخص الصف
              </h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                    <span className="text-sm text-slate-500">عدد الطلاب</span>
                    <span className="font-bold">{classStudents.length}</span>
                 </div>
                 <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                    <span className="text-sm text-slate-500">متوسط النقاط</span>
                    <span className="font-bold">
                      {Math.round(classStudents.reduce((acc, s) => acc + s.positivePoints, 0) / (classStudents.length || 1))}
                    </span>
                 </div>
                 <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                    <span className="text-sm text-slate-500">إجمالي الشارات</span>
                    <span className="font-bold">
                      {classStudents.reduce((acc, s) => acc + (s.badges?.length || 0), 0)}
                    </span>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white">
              <Award size={40} className="mb-4 opacity-80" />
              <h3 className="font-bold text-lg mb-2">الطالب الأكثر تميزاً</h3>
              {topStudents[0] ? (
                <div>
                  <p className="text-2xl font-black mb-1">{topStudents[0].fullName}</p>
                  <p className="text-sm opacity-90">بمجموع نقاط {topStudents[0].positivePoints}</p>
                </div>
              ) : (
                <p>لا يوجد بيانات كافية</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
