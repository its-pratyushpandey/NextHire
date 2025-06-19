import React, { useState, useEffect } from 'react';
import { motion , AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
    LogOut, 
    User2, 
    Search, 
    Building2, 
    BriefcaseIcon, 
    BookmarkIcon,
    HomeIcon,
    GlobeIcon,
    MenuIcon,
    Bell,
    Settings,
    HelpCircle,
    Mail,
    Crown,
    Sparkles,
    Rocket,
    Target,
    Zap,
    X,
    ChevronDown,
    PlusCircle,
    BookOpen,
    BarChart2,
    Settings2, 
    BellDot, 
    LayoutDashboard, 
    History, 
    Shield, 
    Keyboard,
    UserCog,
    MessageSquare,
    BellRing,
    Eye,
    CheckCircle,
    AlertCircle,
    AlertTriangle,
    GaugeCircle,
    RefreshCw,
    Moon,
    ArrowUpRight,
    MailOpen
} from 'lucide-react';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { ThemeToggle } from "../ThemeToggle";
import { cn } from '@/lib/utils';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [query, setQuery] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            type: 'success',
            title: 'New Application',
            message: 'Someone applied to Frontend Developer position',
            time: '2 minutes ago'
        },
        {
            type: 'warning',
            title: 'Job Post Expiring',
            message: 'Your job post for UI Designer is expiring soon',
            time: '1 hour ago'
        }
    ]);
    const [firstJobId, setFirstJobId] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Here you would typically connect to your WebSocket or real-time service
        const handleNewNotification = (notification) => {
            setNotifications(prev => [notification, ...prev]);
            toast({
                title: notification.title,
                description: notification.message,
                icon: <BellRing className="h-4 w-4" />
            });
        };

        // Mock notification for demo
        const interval = setInterval(() => {
            if (Math.random() > 0.8) { // 20% chance of new notification
                handleNewNotification({
                    type: 'success',
                    title: 'New Activity',
                    message: 'A new candidate viewed your job posting',
                    time: 'Just now'
                });
            }
        }, 30000); // Every 30 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Fetch recruiter's jobs to get the first jobId
        const fetchJobs = async () => {
            if (user?.role === 'recruiter') {
                try {
                    const res = await axios.get('/api/v1/recruiter/jobs', { withCredentials: true });
                    if (res.data.jobs && res.data.jobs.length > 0) {
                        setFirstJobId(res.data.jobs[0]._id); // Use first or most recent job
                    }
                } catch (err) {
                    setFirstJobId(null);
                }
            }
        };
        fetchJobs();
    }, [user]);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, icon, children, badge }) => (
        <Link 
            to={to} 
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 group",
                isActive(to) 
                    ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 font-semibold" 
                    : "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            )}
        >
            {icon && React.createElement(icon, { className: "h-4 w-4 transition-transform group-hover:scale-110" })}
            <span className="transition-transform group-hover:translate-x-1">{children}</span>
            {badge && (
                <Badge variant="secondary" className="ml-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    {badge}
                </Badge>
            )}
        </Link>
    );

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                isScrolled 
                    ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm" 
                    : "bg-white dark:bg-gray-900"
            )}
        >
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2"
                    >
                        <Rocket className="h-6 w-6 text-purple-600" />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Next<span className="text-[#F83002]">Hire</span>
                        </h1>
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <ul className="flex items-center gap-2">
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li>
                                    <NavLink to="/admin/companies" icon={Building2} badge="New">
                                        Companies
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/jobs" icon={BriefcaseIcon}>
                                        Jobs
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/analytics" icon={BarChart2}>
                                        Analytics
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin/nextchat" icon={MessageSquare} badge={user?.unreadMessages || 1}>

                                        NextChat
                                    </NavLink>
                                </li>
                               
                               
                                
                            </>
                        ) : (
                            <>
                                <li><NavLink to="/" icon={HomeIcon}>Home</NavLink></li>
                                <li><NavLink to="/browse" icon={GlobeIcon}>Browse</NavLink></li>
                                <li>
                                    <NavLink to="/saved-jobs" icon={BookmarkIcon} badge={user?.savedJobs?.length || 0}>
                                        Saved
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Search Bar */}
                    <div className="relative group">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:ring-2 ring-purple-500 transition-all duration-300">
                            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                className="bg-transparent outline-none w-40 transition-all duration-300 focus:w-60 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    {user && (
                        <div className="flex items-center gap-2">
                            <NotificationPopover 
                                notifications={notifications} 
                                setNotifications={setNotifications}
                            />
                            <SettingsPopover />
                        </div>
                    )}

                    <ThemeToggle />

                    {/* User Menu */}
                    {!user ? (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button 
                                    variant="outline" 
                                    className="rounded-full border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <UserMenu user={user} onLogout={logoutHandler} />
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <MenuIcon className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <MobileMenu />
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

// Separate components for better organization
const UserMenu = ({ user, onLogout }) => (
    <Popover>
        <PopoverTrigger asChild>
            <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
            >
                <Avatar className="ring-2 ring-purple-500 dark:ring-purple-400">
                    <AvatarImage src={user?.profile?.profilePhoto || '/default-avatar.png'} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        {user?.fullname?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
            </motion.div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
            <UserMenuContent user={user} onLogout={onLogout} />
        </PopoverContent>
    </Popover>
);

const UserMenuContent = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleProfileNav = () => {
        navigate('/profile');
        toast.success('Redirecting to profile settings');
    };

    return (
        <div className="p-2">
            {/* User Info Section */}
            <div className="flex items-start gap-4 p-4">
                <Avatar className="h-16 w-16 ring-2 ring-purple-500/20">
                    <AvatarImage src={user?.profile?.profilePhoto || '/default-avatar.png'} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl">
                        {user?.fullname?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {user?.fullname}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.email}
                    </p>
                    {user?.role === 'recruiter' && (
                        <Badge className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            <Crown className="h-3 w-3 mr-1" />
                            Recruiter
                        </Badge>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 px-2">
                {/* View Profile Button */}
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 mb-2"
                    onClick={handleProfileNav}
                >
                    <User2 className="h-4 w-4 text-purple-500" />
                    <div className="flex-1 text-left">
                        <p className="text-sm font-medium">View Profile</p>
                        <p className="text-xs text-gray-500">See your professional profile</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 opacity-50" />
                </Button>

                {/* Help Center Button */}
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 mb-2"
                    onClick={() => navigate('/help')}
                >
                    <HelpCircle className="h-4 w-4 text-blue-500" />
                    <div className="flex-1 text-left">
                        <p className="text-sm font-medium">Help Center</p>
                        <p className="text-xs text-gray-500">Get support and guides</p>
                    </div>
                </Button>

               
                {/* Logout Button */}
                <Button 
                    variant="ghost" 
                    onClick={onLogout}
                    className="w-full justify-start gap-2 mt-2 text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </Button>
            </div>
        </div>
    );
};

const MenuLink = ({ icon, children, href, onClick, className }) => {
    const content = (
        <div
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                className
            )}
        >
            {icon && React.createElement(icon, { className: "h-4 w-4" })}
            <span>{children}</span>
        </div>
    );

    return onClick ? (
        <button className="w-full text-left" onClick={onClick}>
            {content}
        </button>
    ) : (
        <Link to={href}>{content}</Link>
    );
};

const MobileMenu = () => (
    <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        {/* Mobile menu content */}
    </div>
);

const NotificationPopover = ({ notifications, setNotifications }) => (
    <Popover>
        <PopoverTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
                <div className="relative">
                    <BellDot className="h-5 w-5" />
                    {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white rounded-full">
                            {notifications.length}
                        </span>
                    )}
                </div>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="end">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between p-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <BellRing className="h-4 w-4 text-purple-500" />
                        Notifications
                    </h3>
                    {notifications.length > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setNotifications([])}
                        >
                            Clear all
                        </Button>
                    )}
                </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                        <Bell className="h-8 w-8 mb-2 opacity-50" />
                        <p>No new notifications</p>
                    </div>
                ) : (
                    notifications.map((notification, index) => (
                        <NotificationItem 
                            key={index}
                            notification={notification}
                            onRead={() => {
                                const updatedNotifications = notifications.filter((_, i) => i !== index);
                                setNotifications(updatedNotifications);
                            }}
                        />
                    )))
                }
            </div>
        </PopoverContent>
    </Popover>
);

const NotificationItem = ({ notification, onRead }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            default:
                return <MailOpen className="h-5 w-5 text-blue-500" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
            onClick={onRead}
        >
            <div className="flex gap-3">
                <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {notification.time}
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    );
};

const SettingsPopover = () => {
    const navigate = useNavigate();

    const handleProfileNav = () => {
        navigate('/profile');
        toast.success('Redirecting to profile settings');
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
                >
                    <motion.div
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Settings2 className="h-5 w-5" />
                    </motion.div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-4"
                >
                    {/* Header */}
                    <div className="space-y-2 p-2">
                        <h4 className="font-medium leading-none flex items-center gap-2 text-lg">
                            <motion.div whileHover={{ scale: 1.1 }}>
                                <Crown className="h-5 w-5 text-purple-500" />
                            </motion.div>
                            Settings
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Customize your experience
                        </p>
                    </div>

                    {/* Profile Settings */}
                    <div className="px-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 mb-2"
                            onClick={handleProfileNav}
                        >
                            <User2 className="h-4 w-4 text-purple-500" />
                            <div className="flex-1 text-left">
                                <p className="text-sm font-medium">Profile Settings</p>
                                <p className="text-xs text-gray-500">Update your information</p>
                            </div>
                            <ArrowUpRight className="h-4 w-4 opacity-50" />
                        </Button>

                        {/* Theme Toggle */}
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
                            <div className="flex items-center gap-2">
                                <Moon className="h-4 w-4 text-purple-500" />
                                <div>
                                    <p className="text-sm font-medium">Dark Mode</p>
                                    <p className="text-xs text-gray-500">Toggle theme</p>
                                </div>
                            </div>
                            <ThemeToggle />
                        </div>

                        {/* Account Status - For Premium Users */}
                       
                    </div>

                    {/* Quick Actions */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2 px-2">
                        
                    </div>
                </motion.div>
            </PopoverContent>
        </Popover>
    );
};

export default Navbar;