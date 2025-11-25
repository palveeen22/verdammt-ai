import { PlusCircle, Settings, User, History } from "lucide-react";

export const menuItems = [
  {
    title: 'New Chat',
    url: '/askMe',
    icon: PlusCircle,
  },
  {
    title: 'History',
    url: '/history',
    icon: History,
  },
];

export const settingsItems = [
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
  {
    title: 'Profile',
    url: '/profile',
    icon: User,
  },
];
