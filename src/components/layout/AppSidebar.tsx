import { LayoutDashboard, ArrowLeftRight, Lightbulb, Target, X } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useFinanceStore } from '@/store/useFinanceStore';
import { useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Transactions', url: '/transactions', icon: ArrowLeftRight },
  { title: 'Budgets', url: '/budgets', icon: Target },
  { title: 'Insights', url: '/insights', icon: Lightbulb },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';
  const { role, setRole } = useFinanceStore();

  const handleNavClick = () => {
    // Close sidebar on small screens when navlink is clicked
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  // Expand sidebar when switching to small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && collapsed) {
        // On small screens, expand the sidebar to show text
        toggleSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed, toggleSidebar]);

  return (
    <Sidebar collapsible="icon" className="hidden md:flex">
      <SidebarContent className="motion-safe:animate-fade-in">
        <div className={`px-4 sm:px-2 py-4 sm:py-5 flex items-center justify-between ${collapsed ? 'px-14 py-3 ' : ''}`}>
          <div className="flex items-center gap-2">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary transition-transform duration-200 hover:scale-105 sm:h-8 sm:w-8 ${collapsed ? 'p-0 ' : ''}`}>
              <span className="text-xs font-bold text-sidebar-primary-foreground sm:text-sm">F</span>
            </div>
            {!collapsed && (
              <span className="text-base font-semibold tracking-tight text-sidebar-accent-foreground motion-safe:animate-fade-in sm:text-lg">
                FinDash
              </span>
            )}
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => toggleSidebar()}
            className="md:hidden h-8 w-8 rounded-md hover:bg-sidebar-accent hover:text-sidebar-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="group/nav rounded-md transition-[background-color,color,transform,box-shadow] duration-200 hover:bg-sidebar-accent/50 motion-safe:hover:translate-x-1"
                      activeClassName="bg-sidebar-accent font-medium text-sidebar-primary shadow-sm"
                      onClick={handleNavClick}
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0 transition-transform duration-200 motion-safe:group-hover/nav:scale-110" />
                      {!collapsed && (
                        <span className="transition-transform duration-200 motion-safe:group-hover/nav:translate-x-0.5">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto border-t">
          <div className={`px-2 py-3 ${collapsed ? 'flex justify-center' : ''}`}>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${role === 'viewer' ? 'text-sidebar-accent-foreground' : 'text-sidebar-muted-foreground'}`}>
                {!collapsed && 'View'}
              </span>
              <Switch
                checked={role === 'admin'}
                onCheckedChange={(checked) => setRole(checked ? 'admin' : 'viewer')}
                className="scale-75"
              />
              <span className={`text-xs font-medium ${role === 'admin' ? 'text-sidebar-accent-foreground' : 'text-sidebar-muted-foreground'}`}>
                {!collapsed && 'Admin'}
              </span>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
