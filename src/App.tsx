import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ClassesPage from './pages/ClassesPage';
import StudentsPage from './pages/StudentsPage';
import PointsPage from './pages/PointsPage';
import BadgesPage from './pages/BadgesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import { classService } from './services/classService';
import { studentService } from './services/studentService';

export type PageName = 'dashboard' | 'classes' | 'students' | 'points' | 'badges' | 'reports' | 'settings';

const App: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageName>('dashboard');

  useEffect(() => {
    const classes = classService.getClasses();
    if (classes.length === 0) {
      const c1 = classService.addClass({ name: 'الصف العاشر - أ', grade: '10', section: 'أ', academicYear: '2025/2026' });
      const c2 = classService.addClass({ name: 'الصف الحادي عشر - ب', grade: '11', section: 'ب', academicYear: '2025/2026' });
      const c3 = classService.addClass({ name: 'الصف الثاني عشر - أ', grade: '12', section: 'أ', academicYear: '2025/2026' });

      studentService.addStudent({ fullName: 'أحمد محمد', classId: c1.id, avatarColor: '#3b82f6' });
      studentService.addStudent({ fullName: 'خالد علي', classId: c1.id, avatarColor: '#ef4444' });
      studentService.addStudent({ fullName: 'عمر حسن', classId: c2.id, avatarColor: '#10b981' });
      studentService.addStudent({ fullName: 'عبدالله سالم', classId: c2.id, avatarColor: '#f59e0b' });
      studentService.addStudent({ fullName: 'جاسم ناصر', classId: c3.id, avatarColor: '#8b5cf6' });
    }
    setInitialized(true);
  }, []);

  if (!initialized) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'classes': return <ClassesPage />;
      case 'students': return <StudentsPage />;
      case 'points': return <PointsPage />;
      case 'badges': return <BadgesPage />;
      case 'reports': return <ReportsPage />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" dir="rtl">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-y-auto relative">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
