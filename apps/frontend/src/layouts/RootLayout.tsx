import { Outlet } from '@tanstack/react-router';

export const RootLayout = () => {
  return (
    <div className="min-h-screen w-full">
      <Outlet />
    </div>
  );
};

