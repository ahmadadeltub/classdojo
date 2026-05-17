import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  Trophy, 
  Award, 
  BarChart3, 
  Settings as SettingsIcon,
  Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';
import { PageName } from '../App';

interface SidebarProps {
  currentPage: PageName;
  onNavigate: (page: PageName) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const menuItems: { icon: typeof LayoutDashboard; label: string; page: PageName }[] = [
    { icon: LayoutDashboard, label: 'الرئيسية', page: 'dashboard' },
    { icon: Users, label: 'الصفوف', page: 'classes' },
    { icon: UserCircle, label: 'الطلاب', page: 'students' },
    { icon: Trophy, label: 'النقاط', page: 'points' },
    { icon: Award, label: 'الشارات', page: 'badges' },
    { icon: BarChart3, label: 'التقارير', page: 'reports' },
    { icon: SettingsIcon, label: 'الإعدادات', page: 'settings' },
  ];

  return (
    <aside className="w-20 md:w-64 bg-white border-l border-slate-200 flex flex-col h-full transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
          <Sparkles size={24} />
        </div>
        <div className="hidden md:block">
          <h1 className="font-bold text-lg text-slate-900 leading-tight">صفّي</h1>
          <p className="text-xs text-slate-500">التفاعلي</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
              currentPage === item.page 
                ? "bg-primary-50 text-primary-600 font-bold" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            )}
          >
            <item.icon size={22} />
            <span className="hidden md:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-4 rounded-2xl text-white hidden md:block">
          <p className="text-xs opacity-80 mb-1">المعلم الحالي</p>
          <p className="font-bold">أحمد الطويشات</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
