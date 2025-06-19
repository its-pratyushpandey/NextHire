import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { 
  Bell, 
  Mail, 
  Globe, 
  Shield,
  Zap
} from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    applicationAlerts: true,
    profileVisibility: true,
    enhancedSecurity: false,
    aiFeatures: true
  });

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const settingsList = [
    {
      key: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive updates about applications and messages',
      icon: Mail,
      color: 'text-blue-500'
    },
    {
      key: 'applicationAlerts',
      title: 'Application Alerts',
      description: 'Get instant notifications for new applicants',
      icon: Bell,
      color: 'text-purple-500'
    },
    {
      key: 'profileVisibility',
      title: 'Public Profile',
      description: 'Make your company profile visible to candidates',
      icon: Globe,
      color: 'text-green-500'
    },
    {
      key: 'enhancedSecurity',
      title: 'Enhanced Security',
      description: 'Enable two-factor authentication',
      icon: Shield,
      color: 'text-red-500'
    },
    {
      key: 'aiFeatures',
      title: 'AI Features',
      description: 'Enable AI-powered recruitment tools',
      icon: Zap,
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Settings</h2>
        <Button>Save Changes</Button>
      </div>

      <div className="space-y-4">
        {settingsList.map((setting) => (
          <motion.div
            key={setting.key}
            whileHover={{ x: 2 }}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${setting.color}`}>
                <setting.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">{setting.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {setting.description}
                </p>
              </div>
            </div>
            <Switch
              checked={settings[setting.key]}
              onCheckedChange={() => handleSettingChange(setting.key)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminSettings;