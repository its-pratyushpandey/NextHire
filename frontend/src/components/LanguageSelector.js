import React, { useState, useEffect } from 'react';
import { 
  SUPPORTED_LANGUAGES, 
  getUserPreferredLanguage, 
  saveLanguagePreference 
} from '../translation';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LanguageSelector = ({ onLanguageChange, className = '' }) => {
  const [currentLanguage, setCurrentLanguage] = useState(getUserPreferredLanguage());

  useEffect(() => {
    // Initialize with user's preferred language
    const userLang = getUserPreferredLanguage();
    setCurrentLanguage(userLang);
  }, []);

  const handleLanguageChange = (value) => {
    setCurrentLanguage(value);
    saveLanguagePreference(value);
    
    if (onLanguageChange) {
      onLanguageChange(value);
    }
    
    const languageName = Object.keys(SUPPORTED_LANGUAGES).find(
      key => SUPPORTED_LANGUAGES[key] === value
    );
    
    toast.success(`Language changed to ${languageName || value}`);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Globe className="mr-2 h-4 w-4 text-gray-500" />
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SUPPORTED_LANGUAGES).map(([name, code]) => (
            <SelectItem key={code} value={code}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
