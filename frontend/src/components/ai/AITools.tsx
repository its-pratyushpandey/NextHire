import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const AITools = () => {
  return (
    <div className="container mx-auto p-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
      >
        AI Tools
      </motion.h1>
      <Card>
        <CardContent className="p-6">
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
};

export default AITools;