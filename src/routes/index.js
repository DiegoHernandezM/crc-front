import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import LoadingScreen from '../components/LoadingScreen';
// config
import useAuth from '../hooks/useAuth';
// components
// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  const { user } = useAuth();
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'login/:token',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        }
      ]
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      // eslint-disable-next-line no-nested-ternary
      element: user ? (
        user.roles.filter((obj) => obj.name !== 'Solo checador').length > 0 ? (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ) : (
          <AuthGuard>
            <Calendar />
          </AuthGuard>
        )
      ) : (
        <Page403 />
      ),
      children: [{ element: <Navigate to="/dashboard/app" replace /> }, { path: 'app', element: <GeneralAnalytics /> }]
    },
    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'maintenance', element: <Maintenance /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: '/', element: <Navigate to="/main" replace /> },
        {
          path: 'main',
          // eslint-disable-next-line no-nested-ternary
          element: user ? (
            user.roles.filter((obj) => obj.name === 'Solo checador').length > 0 ? (
              <Checkin />
            ) : (
              <GeneralAnalytics />
            )
          ) : (
            <Page403 />
          )
        },
        { path: 'calendar', element: <Calendar /> },
        {
          path: 'picking',
          // eslint-disable-next-line no-nested-ternary
          element: user ? (
            user.roles.filter((obj) => obj.name === 'Solo checador').length > 0 ? (
              <Page403 />
            ) : (
              <Picking />
            )
          ) : (
            <Page403 />
          )
        },
        // {
        //   path: 'Sorter',
        //   // eslint-disable-next-line no-nested-ternary
        //   element: user ? (
        //     user.roles.filter((obj) => obj.name === 'Solo checador').length > 0 ? (
        //       <Page403 />
        //     ) : (
        //       <Sorter />
        //     )
        //   ) : (
        //     <Page403 />
        //   )
        // },
        { path: 'checkin', element: <Checkin /> },
        {
          path: 'attendance',
          // eslint-disable-next-line no-nested-ternary
          element: user ? (
            user.roles.filter((obj) => obj.name === 'Solo checador').length > 0 ? (
              <Page403 />
            ) : (
              <Attendance />
            )
          ) : (
            <Page403 />
          )
        },
        {
          path: 'associate',
          // eslint-disable-next-line no-nested-ternary
          element: user ? (
            user.roles.filter((obj) => obj.name === 'Solo checador').length > 0 ? (
              <Page403 />
            ) : (
              <AssociatePage />
            )
          ) : (
            <Page403 />
          )
        },
        {
          path: 'user',
          // eslint-disable-next-line no-nested-ternary
          element: user ? (
            user.roles.filter((obj) => obj.name === 'Solo checador').length > 0 ? (
              <Page403 />
            ) : (
              <UserPage />
            )
          ) : (
            <Page403 />
          )
        },
        {
          path: 'shift',
          // eslint-disable-next-line no-nested-ternary
          element: user ? (
            user.roles.filter((obj) => obj.name === 'Solo checador').length > 0 ? (
              <Page403 />
            ) : (
              <ShiftPage />
            )
          ) : (
            <Page403 />
          )
        },
        {
          path: 'area',
          // eslint-disable-next-line no-nested-ternary
          element: user ? (
            user.roles.filter((obj) => obj.name === 'Solo checador').length > 0 ? (
              <Page403 />
            ) : (
              <AreaPage />
            )
          ) : (
            <Page403 />
          )
        },
        {
          path: 'subarea',
          // eslint-disable-next-line no-nested-ternary
          element: user ? (
            user.permissions.filter((obj) => obj.name === 'Solo checador').length > 0 ? (
              <SubareaPage />
            ) : (
              <Page403 />
            )
          ) : (
            <Page403 />
          )
        },
        { path: 'contact-us', element: <Contact /> },
        { path: 'faqs', element: <Faqs /> },
        { path: 'profile', element: <Profile /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
// Dashboard
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));
// Main
const Contact = Loadable(lazy(() => import('../pages/Contact')));
const Faqs = Loadable(lazy(() => import('../pages/Faqs')));
const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Page403 = Loadable(lazy(() => import('../pages/Page403')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
// APP
const UserPage = Loadable(lazy(() => import('../pages/user/User')));
const AssociatePage = Loadable(lazy(() => import('../pages/associate/Associate')));
const ShiftPage = Loadable(lazy(() => import('../pages/shift/Shift')));
const AreaPage = Loadable(lazy(() => import('../pages/area/Area')));
const SubareaPage = Loadable(lazy(() => import('../pages/subarea/Subarea')));
const Profile = Loadable(lazy(() => import('../pages/user/Profile')));
const Calendar = Loadable(lazy(() => import('../pages/calendar/Calendar')));

// CRC
const Checkin = Loadable(lazy(() => import('../pages/checkin/Checkin')));
const Picking = Loadable(lazy(() => import('../pages/productivity/Picking')));
const Sorter = Loadable(lazy(() => import('../pages/productivity/Sorter')));
const Attendance = Loadable(lazy(() => import('../pages/attendance/Attendance')));
