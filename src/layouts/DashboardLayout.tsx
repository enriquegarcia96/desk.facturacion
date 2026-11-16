import { Outlet } from 'react-router';
import { SideMenu } from '../components';

const DashboardLayout = () => {
  return (
    <div className="flex h-dvh w-full bg-slate-200 antialiased text-slate-900 selection:bg-blue-900 selection:text-white">
      <SideMenu />
      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;