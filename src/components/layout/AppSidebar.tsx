import { LayoutDashboard, ArrowLeftRight, Lightbulb, X } from 'lucide-react';
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
      <SidebarContent>
        <div className={`px-4 sm:px-2 py-4 sm:py-5 flex items-center justify-between ${collapsed ? 'px-14 py-3 ' : ''}`}>
          <div className="flex items-center gap-2">
<<<<<<< HEAD
            <div className={`h-7 sm:h-8 w-7 sm:w-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0 ${collapsed ? 'p-0 ' : ''}`}>
              <span className="text-sidebar-primary-foreground font-bold  text-xs sm:text-sm\">F</span>
            </div>
            {!collapsed && (
              <span className="text-sidebar-accent-foreground font-semibold text-base sm:text-lg tracking-tight\">
=======
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
              <span className="text-sidebar-primary-foreground font-bold text-xs sm:text-sm">F</span>
            </div>
            {!collapsed && (
              <span className="text-sidebar-accent-foreground font-semibold text-base sm:text-lg tracking-tight">
>>>>>>> 067612a1f07536c0111fce410abade02169fa000
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
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      onClick={handleNavClick}
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
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
