import { Outlet, useNavigate } from 'react-router-dom';
import { BottomNavigation, Icon } from 'zmp-ui';

const tabs = [
  { key: 'vehicles', label: 'Vehicles', icon: 'zi-home', path: '/vehicles' },
  { key: 'odo', label: 'ODO', icon: 'zi-clock-1', path: '/odo' },
  { key: 'service', label: 'Service', icon: 'zi-setting', path: '/service' },
  { key: 'recommendations', label: 'Recs', icon: 'zi-star', path: '/recommendations' },
  { key: 'products', label: 'Products', icon: 'zi-more', path: '/products' },
];

export function Layout() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <BottomNavigation
        fixed
        activeKey="vehicles"
        onChange={(key) => {
          const tab = tabs.find((t) => t.key === key);
          if (tab) navigate(tab.path);
        }}
      >
        {tabs.map((tab) => (
          <BottomNavigation.Item
            key={tab.key}
            label={tab.label}
            icon={<Icon icon={tab.icon as any} />}
            activeIcon={<Icon icon={tab.icon as any} />}
          />
        ))}
      </BottomNavigation>
    </div>
  );
}
