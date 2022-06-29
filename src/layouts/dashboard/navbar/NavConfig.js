import { SupervisedUserCircle, MenuBookOutlined, AccessTime, AccountCircle } from '@mui/icons-material';
// routes
// eslint-disable-next-line import/named
import { PATH_APP } from '../../../routes/paths';
// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  calendar: getIcon('ic_calendar'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard')
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'dashboard', path: PATH_APP.dashboard, icon: ICONS.analytics },
      { title: 'calendario', path: PATH_APP.calendar, icon: ICONS.calendar },
      { title: 'checador', path: PATH_APP.checkin, icon: <AccessTime /> }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'administración',
    items: [
      // MANAGEMENT
      { title: 'colaboradores', path: PATH_APP.associate, icon: <SupervisedUserCircle /> },
      {
        title: 'catalogos',
        path: PATH_APP.catalogue,
        icon: <MenuBookOutlined />,
        children: [
          { title: 'horarios', path: PATH_APP.shift },
          { title: 'tipo asociado', path: PATH_APP.associateType },
          { title: 'areas', path: PATH_APP.area },
          { title: 'subareas', path: PATH_APP.subarea }
        ]
      },
      {
        title: 'reportes',
        path: PATH_APP.reports,
        icon: <MenuBookOutlined />,
        children: [
          { title: 'picking', path: PATH_APP.picking },
          { title: 'sorter', path: PATH_APP.sorter },
          { title: 'asistencia', path: PATH_APP.attendance }
        ]
      },
      { title: 'usuarios', path: PATH_APP.user, icon: <AccountCircle /> }
    ]
  }

  // APP
  // ----------------------------------------------------------------------
];

export default navConfig;
