'use client';

import Link from "next/link";
import { Home, FileText, Settings, Users, BarChart, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "next/navigation";

const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Clientes", href: "/clientes" },
    { icon: FileText, label: "Citas", href: "/citas" },
    // { icon: BarChart, label: "Reportes", href: "/reportes" },
    // { icon: Settings, label: "Configuración", href: "/configuracion" },
];

const Sidebar = () => {
    const {user, logout} = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/auth');
    };

    if (!user) {
        return null;
    }
    return (
        <aside className="h-screen w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex flex-col fixed left-0 top-0 border-r border-gray-200 dark:border-gray-700 transition-colors">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">
                        C
                    </div>
                    <span className="text-xl font-semibold">Enrollment</span>
                </div>
            </div>

            <nav className="flex-1 p-4 my-20 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                        >
                            <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                            <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
                {/*<ThemeToggle />*/}
                <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left group"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400">
                        Cerrar Sesión
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;