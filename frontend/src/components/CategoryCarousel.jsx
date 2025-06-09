import React, { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { motion } from 'framer-motion';
import { 
    Code2, 
    Server, 
    Database, 
    Palette, 
    Layers,
    Cloud,
    Smartphone,
    Shield,
    Bot,
    LineChart,
    Projector,
    Network
} from 'lucide-react';

const categories = [
    {
        title: "Frontend Developer",
        icon: <Code2 className="h-5 w-5" />,
        color: "from-blue-500 to-cyan-500",
        description: "Build stunning user interfaces"
    },
    {
        title: "Backend Developer",
        icon: <Server className="h-5 w-5" />,
        color: "from-green-500 to-emerald-500",
        description: "Power robust server solutions"
    },
    {
        title: "Data Science",
        icon: <Database className="h-5 w-5" />,
        color: "from-purple-500 to-violet-500",
        description: "Transform data into insights"
    },
    {
        title: "Graphic Designer",
        icon: <Palette className="h-5 w-5" />,
        color: "from-pink-500 to-rose-500",
        description: "Create visual masterpieces"
    },
    {
        title: "FullStack Developer",
        icon: <Layers className="h-5 w-5" />,
        color: "from-orange-500 to-red-500",
        description: "Master both ends of development"
    },
    {
        title: "Cloud Engineer",
        icon: <Cloud className="h-5 w-5" />,
        color: "from-sky-500 to-blue-500",
        description: "Scale cloud infrastructure"
    },
    {
        title: "Mobile Developer",
        icon: <Smartphone className="h-5 w-5" />,
        color: "from-indigo-500 to-purple-500",
        description: "Craft mobile experiences"
    },
    {
        title: "Security Engineer",
        icon: <Shield className="h-5 w-5" />,
        color: "from-red-500 to-pink-500",
        description: "Protect digital assets"
    },
    {
        title: "AI Engineer",
        icon: <Bot className="h-5 w-5" />,
        color: "from-emerald-500 to-teal-500",
        description: "Build intelligent systems"
    },
    {
        title: "DevOps Engineer",
        icon: <Network className="h-5 w-5" />,
        color: "from-amber-500 to-orange-500",
        description: "Streamline development operations"
    }
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-purple-800 to-pink-900 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                        Explore Career Categories
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Discover opportunities across different technology domains
                    </p>
                </motion.div>

                <Carousel 
                    className="w-full max-w-5xl mx-auto"
                    opts={{
                        align: "start",
                        loop: true
                    }}
                >
                    <CarouselContent>
                        {categories.map((cat, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    onHoverStart={() => setHoveredIndex(index)}
                                    onHoverEnd={() => setHoveredIndex(null)}
                                >
                                    <Button 
                                        onClick={() => searchJobHandler(cat.title)}
                                        variant="outline"
                                        className="w-full h-full flex flex-col items-center gap-3 p-6 rounded-xl border-2 hover:border-transparent bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 dark:hover:from-purple-500/20 dark:hover:to-pink-500/20 transition-all duration-300"
                                    >
                                        <motion.div
                                            className={`p-3 rounded-lg bg-gradient-to-r ${cat.color}`}
                                            animate={hoveredIndex === index ? { 
                                                rotate: [0, 360],
                                                scale: [1, 1.1, 1]
                                            } : {}}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <div className="text-white">
                                                {cat.icon}
                                            </div>
                                        </motion.div>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {cat.title}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {cat.description}
                                        </span>
                                    </Button>
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex -left-12 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 dark:hover:from-purple-500/20 dark:hover:to-pink-500/20 border-2" />
                    <CarouselNext className="hidden md:flex -right-12 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 dark:hover:from-purple-500/20 dark:hover:to-pink-500/20 border-2" />
                </Carousel>
            </div>
        </div>
    );
};

export default CategoryCarousel;