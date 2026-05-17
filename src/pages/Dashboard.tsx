import React from 'react';
import { 
  Users, 
  UserCircle, 
  Star, 
  AlertCircle,
  PlusCircle,
  UserPlus,
  BarChart2,
  Trophy
} from 'lucide-react';
import { classService } from '../services/classService';
import { studentService } from '../services/studentService';
import { pointsService } from '../services/pointsService';
import { PageName } from '../App';

interface DashboardProps {
  onNavigate: (page: PageName) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const classes = classService.getClasses();
  const students = studentService.getStudents();
  const points = pointsService.getPoints();

  const totalPositive = points.filter(p => p.type === 'positive').reduce((acc, curr) => acc + curr.value, 0);
  const totalImprovement = points.filter(p => p.type === 'improvement').reduce((acc, curr) => acc + curr.value, 0);

  const stats = [
    { label: 'إجمالي الصفوف', value: classes.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'إجمالي الطلاب', value: students.length, icon: UserCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'النقاط الإيجابية', value: totalPositive, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'نقاط التحسين', value: totalImprovement, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const quickActions: { label: string; icon: typeof PlusCircle; page: PageName; color: string }[] = [
    { label: 'إنشاء صف جديد', icon: PlusCircle, page: 'classes', color: 'bg-blue-600' },
    { label: 'إضافة طالب', icon: UserPlus, page: 'students', color: 'bg-purple-600' },
    { label: 'منح نقطة', icon: Trophy, page: 'points', color: 'bg-amber-600' },
    { label: 'عرض التقارير', icon: BarChart2, page: 'reports', color: 'bg-emerald-600' },
  ];

  const recentActivity = points.slice(0, 5);

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">مرحباً بك مجدداً</h2>
        <p className="text-slate-500">هذا هو ملخص نشاطك الدراسي لليوم</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">إجراءات سريعة</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <button 
                key={i} 
                onClick={() => onNavigate(action.page)}
                className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 gap-3"
              >
                <div className={`w-12 h-12 rounded-full ${action.color} text-white flex items-center justify-center shadow-md`}>
                  <action.icon size={24} />
                </div>
                <span className="text-sm font-bold text-slate-700">{action.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">آخر النشاطات</h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((p) => {
                  const student = students.find(s => s.id === p.studentId);
                  return (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: student?.avatarColor || '#ccc' }}>
                          {student?.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{student?.fullName}</p>
                          <p className="text-xs text-slate-500">{p.reason}</p>
                        </div>
                      </div>
                      <div className={`font-bold ${p.type === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                        {p.type === 'positive' ? '+' : '-'}{p.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Star size={48} className="mx-auto mb-3 opacity-20" />
                <p>لا يوجد نشاط مسجل بعد</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">إحصائيات النقاط</h3>
          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6">
             <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>الإيجابية</span>
                  <span className="text-green-600">{Math.round((totalPositive / (totalPositive + totalImprovement || 1)) * 100)}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${(totalPositive / (totalPositive + totalImprovement || 1)) * 100}%` }}
                  />
                </div>
             </div>

             <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>للتحسين</span>
                  <span className="text-red-600">{Math.round((totalImprovement / (totalPositive + totalImprovement || 1)) * 100)}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${(totalImprovement / (totalPositive + totalImprovement || 1)) * 100}%` }}
                  />
                </div>
             </div>

             <div className="pt-4 border-t border-slate-50">
               <p className="text-xs text-slate-500 mb-2">إجمالي النقاط الممنوحة</p>
               <p className="text-3xl font-bold text-slate-900">{totalPositive + totalImprovement}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
