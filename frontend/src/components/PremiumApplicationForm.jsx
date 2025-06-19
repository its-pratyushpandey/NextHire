import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    User, Mail, Phone, MapPin, Calendar as CalendarIcon,
    GraduationCap, Briefcase, Code, FileText,
    Image as ImageIcon, Target, CheckSquare,
    ChevronRight, Loader2, Plus, X, AlertCircle,
    Award, Star, BriefcaseIcon, Building2, 
    Clock, Globe, GraduationCap as GradCap,
    Heart, Link, MapPin as Location,
    PenTool, Rocket, Sparkles, Trophy,
    Upload, Users, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { format } from 'date-fns';

const PremiumCalendar = ({ selected, onSelect, error }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
        >
            <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                <div className="w-full">
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className={`flex items-center justify-between p-2 border rounded-md cursor-pointer transition-all duration-300 hover:border-blue-500 ${
                            error ? 'border-red-500' : 'border-gray-200'
                        }`}
                    >
                        <span className={`${selected ? 'text-gray-900' : 'text-gray-500'}`}>
                            {selected ? format(selected, 'PPP') : 'Select date'}
                        </span>
                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                    </div>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200"
                            >
                                <Calendar
                                    mode="single"
                                    selected={selected}
                                    onSelect={(date) => {
                                        onSelect(date);
                                        setIsOpen(false);
                                    }}
                                    className="rounded-md"
                                    disabled={(date) => date < new Date()}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center text-red-500 text-sm mt-1"
                >
                    <AlertCircle className="w-4 h-4 mr-1 animate-pulse" />
                    {error}
                </motion.div>
            )}
        </motion.div>
    );
};

const PremiumApplicationForm = ({ jobId, onClose }) => {
    const formRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [form, setForm] = useState({
        // Basic Information
        fullName: '',
        email: '',
        contactNumber: '',
        currentAddress: '',
        dateOfBirth: null,
        // Academic Background
        collegeName: '',
        degree: '',
        branch: '',
        passingYear: '',
        cgpa: '',
        // Experience
        internships: [{ company: '', role: '', duration: '' }],
        workExperience: [{ company: '', role: '', duration: '' }],
        // Skills & Projects
        technicalSkills: [''],
        projects: [{ title: '', technologies: '', description: '' }],
        // Uploads
        resume: null,
        photo: null,
        // Preferences
        preferredRoles: [''],
        availableStartDate: null,
        // Declaration
        agreeToTerms: false
    });

    // Scroll to top when step changes
    useEffect(() => {
        if (formRef.current) {
            formRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [currentStep]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        },
        exit: { 
            opacity: 0, 
            x: -50,
            transition: {
                duration: 0.2
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : 
                    type === 'file' ? files[0] : value
        }));
    };

    const handleArrayChange = (field, index, value) => {
        setForm(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => 
                i === index ? { ...item, ...value } : item
            )
        }));
    };

    const addArrayItem = (field, template) => {
        setForm(prev => ({
            ...prev,
            [field]: [...prev[field], template]
        }));
    };

    const removeArrayItem = (field, index) => {
        setForm(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const validateStep = (step) => {
        const errors = {};
        
        switch(step) {
            case 1:
                if (!form.fullName?.trim()) errors.fullName = 'Full name is required';
                if (!form.email?.trim()) errors.email = 'Email is required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format';
                if (!form.contactNumber?.trim()) errors.contactNumber = 'Contact number is required';
                if (!form.currentAddress?.trim()) errors.currentAddress = 'Current address is required';
                if (!form.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
                break;
            case 2:
                if (!form.collegeName?.trim()) errors.collegeName = 'College name is required';
                if (!form.degree?.trim()) errors.degree = 'Degree is required';
                if (!form.branch?.trim()) errors.branch = 'Branch is required';
                if (!form.passingYear?.trim()) errors.passingYear = 'Passing year is required';
                if (!form.cgpa?.trim()) errors.cgpa = 'CGPA is required';
                else if (isNaN(form.cgpa) || form.cgpa < 0 || form.cgpa > 10) errors.cgpa = 'Invalid CGPA';
                break;
            case 3:
                // Optional fields, no validation needed
                break;
            case 4:
                // Optional fields, no validation needed
                break;
            case 5:
                if (!form.resume) errors.resume = 'Resume is required';
                if (!form.photo) errors.photo = 'Photo is required';
                if (!form.availableStartDate) errors.availableStartDate = 'Available start date is required';
                if (!form.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms and conditions';
                break;
        }
        
        return errors;
    };

    const handleNext = () => {
        const errors = validateStep(currentStep);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast.error('Please fill in all required fields correctly');
            return;
        }
        setFormErrors({});
        setCurrentStep(prev => prev + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all steps before submission
        for (let step = 1; step <= 5; step++) {
            const errors = validateStep(step);
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                setCurrentStep(step);
                toast.error('Please fill in all required fields correctly');
                return;
            }
        }

        setLoading(true);
        setFormErrors({});

        try {
            const formData = new FormData();
            
            // Map form fields to match backend expectations
            const fieldMappings = {
                fullName: 'fullName',
                email: 'email',
                contactNumber: 'contactNumber',
                currentAddress: 'currentAddress',
                dateOfBirth: 'dateOfBirth',
                collegeName: 'collegeName',
                degree: 'degree',
                branch: 'branch',
                passingYear: 'passingYear',
                cgpa: 'cgpa',
                internships: 'internships',
                workExperience: 'workExperience',
                technicalSkills: 'technicalSkills',
                projects: 'projects',
                preferredRoles: 'preferredRoles',
                availableStartDate: 'availableStartDate',
                agreeToTerms: 'agreeToTerms'
            };

            // Append all form fields to FormData
            Object.entries(fieldMappings).forEach(([formKey, backendKey]) => {
                const value = form[formKey];
                
                if (value instanceof File) {
                    formData.append(backendKey, value);
                } else if (Array.isArray(value)) {
                    // Filter out empty strings from arrays
                    const filteredArray = value.filter(item => {
                        if (typeof item === 'string') return item.trim() !== '';
                        if (typeof item === 'object') {
                            return Object.values(item).some(val => val && val.trim() !== '');
                        }
                        return true;
                    });
                    formData.append(backendKey, JSON.stringify(filteredArray));
                } else if (value instanceof Date) {
                    formData.append(backendKey, value.toISOString());
                } else if (typeof value === 'boolean') {
                    formData.append(backendKey, value.toString());
                } else if (value !== null && value !== undefined) {
                    formData.append(backendKey, value);
                }
            });

            // Ensure files are properly appended
            if (form.resume) {
                formData.append('resume', form.resume);
            }
            if (form.photo) {
                formData.append('photo', form.photo);
            }

            // Log form data for debugging
            console.log('Form data being sent:');
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`,
                formData,
                {
                    headers: { 
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                toast.success('Application submitted successfully!');
                onClose();
            }
        } catch (error) {
            console.error('Application submission error:', error);
            
            // Handle specific error cases
            if (error.response?.status === 400) {
                const errorMessage = error.response.data.message;
                console.log('Error response:', error.response.data);
                
                // Handle missing fields error
                if (errorMessage.includes('Missing required fields')) {
                    const missingFields = errorMessage.match(/Missing required fields: (.*)/)?.[1];
                    if (missingFields) {
                        const fieldErrors = missingFields.split(', ').reduce((acc, field) => ({
                            ...acc,
                            [field.toLowerCase()]: `${field} is required`
                        }), {});
                        setFormErrors(fieldErrors);
                        
                        // Set current step based on the first missing field
                        const firstMissingField = Object.keys(fieldErrors)[0];
                        if (firstMissingField) {
                            if (['fullname', 'email', 'contactnumber', 'currentaddress', 'dateofbirth'].includes(firstMissingField)) {
                                setCurrentStep(1);
                            } else if (['collegename', 'degree', 'branch', 'passingyear', 'cgpa'].includes(firstMissingField)) {
                                setCurrentStep(2);
                            } else if (['resume', 'photo', 'availablestartdate', 'agreetoterms'].includes(firstMissingField)) {
                                setCurrentStep(5);
                            }
                        }
                    }
                }
                
                toast.error(errorMessage);
            } else {
                toast.error('Error submitting application. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2" />
            {[1, 2, 3, 4, 5].map((step) => (
                <motion.div
                    key={step}
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
                        ${currentStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentStep(step)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: step * 0.1 }}
                >
                    <motion.div
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: step * 0.1 + 0.2 }}
                    >
                        {step}
                    </motion.div>
                    {currentStep === step && (
                        <motion.div
                            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-blue-500"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {getStepTitle(step)}
                        </motion.div>
                    )}
                </motion.div>
            ))}
        </div>
    );

    const getStepTitle = (step) => {
        const titles = {
            1: 'Basic Info',
            2: 'Education',
            3: 'Experience',
            4: 'Skills',
            5: 'Documents'
        };
        return titles[step];
    };

    const ErrorMessage = ({ field }) => {
        if (!formErrors[field]) return null;
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center text-red-500 text-sm mt-1"
            >
                <AlertCircle className="w-4 h-4 mr-1 animate-pulse" />
                {formErrors[field]}
            </motion.div>
        );
    };

    const renderInput = (name, placeholder, type = 'text', icon = null) => (
        <motion.div
            variants={itemVariants}
            className="space-y-1"
        >
            <div className="flex items-center space-x-2 group">
                {icon && (
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="text-blue-500"
                    >
                        {icon}
                    </motion.div>
                )}
                <Input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={form[name] || ''}
                    onChange={handleChange}
                    className={`transition-all duration-300 ${
                        formErrors[name] 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'focus:ring-blue-500'
                    }`}
                    required
                />
            </div>
            <ErrorMessage field={name} />
        </motion.div>
    );

    const renderFormSection = () => {
        switch(currentStep) {
            case 1:
                return renderBasicInfo();
            case 2:
                return renderAcademicInfo();
            case 3:
                return renderExperienceInfo();
            case 4:
                return renderSkillsAndProjects();
            case 5:
                return renderUploadsAndPreferences();
            default:
                return null;
        }
    };

    const renderBasicInfo = () => (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <motion.div variants={itemVariants} className="flex items-center space-x-2">
                <User className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-semibold">Basic Information</h3>
            </motion.div>
            <div className="space-y-4">
                {renderInput('fullName', 'Full Name', 'text', <User className="w-5 h-5" />)}
                {renderInput('email', 'Email Address', 'email', <Mail className="w-5 h-5" />)}
                {renderInput('contactNumber', 'Contact Number', 'tel', <Phone className="w-5 h-5" />)}
                {renderInput('currentAddress', 'Current Address', 'text', <Location className="w-5 h-5" />)}
                <motion.div variants={itemVariants}>
                    <PremiumCalendar
                        selected={form.dateOfBirth}
                        onSelect={(date) => setForm(prev => ({ ...prev, dateOfBirth: date }))}
                        error={formErrors.dateOfBirth}
                    />
                </motion.div>
            </div>
        </motion.div>
    );

    const renderAcademicInfo = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Academic Background</h3>
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-blue-500" />
                    <Input
                        name="collegeName"
                        placeholder="College/University Name"
                        value={form.collegeName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <Input
                        name="degree"
                        placeholder="Degree"
                        value={form.degree}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Code className="w-5 h-5 text-blue-500" />
                    <Input
                        name="branch"
                        placeholder="Branch/Specialization"
                        value={form.branch}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-5 h-5 text-blue-500" />
                    <Input
                        name="passingYear"
                        placeholder="Passing Year"
                        value={form.passingYear}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    <Input
                        name="cgpa"
                        placeholder="CGPA/Percentage"
                        value={form.cgpa}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
        </div>
    );

    const renderExperienceInfo = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Internships</h3>
                {form.internships.map((internship, index) => (
                    <div key={index} className="space-y-3 mb-4 p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium">Internship {index + 1}</h4>
                            {index > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeArrayItem('internships', index)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        <Input
                            placeholder="Company Name"
                            value={internship.company}
                            onChange={(e) => handleArrayChange('internships', index, { company: e.target.value })}
                        />
                        <Input
                            placeholder="Role"
                            value={internship.role}
                            onChange={(e) => handleArrayChange('internships', index, { role: e.target.value })}
                        />
                        <Input
                            placeholder="Duration"
                            value={internship.duration}
                            onChange={(e) => handleArrayChange('internships', index, { duration: e.target.value })}
                        />
                    </div>
                ))}
                <Button
                    variant="outline"
                    onClick={() => addArrayItem('internships', { company: '', role: '', duration: '' })}
                    className="w-full"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Internship
                </Button>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
                {form.workExperience.map((experience, index) => (
                    <div key={index} className="space-y-3 mb-4 p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium">Experience {index + 1}</h4>
                            {index > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeArrayItem('workExperience', index)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        <Input
                            placeholder="Company Name"
                            value={experience.company}
                            onChange={(e) => handleArrayChange('workExperience', index, { company: e.target.value })}
                        />
                        <Input
                            placeholder="Role"
                            value={experience.role}
                            onChange={(e) => handleArrayChange('workExperience', index, { role: e.target.value })}
                        />
                        <Input
                            placeholder="Duration"
                            value={experience.duration}
                            onChange={(e) => handleArrayChange('workExperience', index, { duration: e.target.value })}
                        />
                    </div>
                ))}
                <Button
                    variant="outline"
                    onClick={() => addArrayItem('workExperience', { company: '', role: '', duration: '' })}
                    className="w-full"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                </Button>
            </div>
        </div>
    );

    const renderSkillsAndProjects = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Technical Skills</h3>
                {form.technicalSkills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <Input
                            placeholder="Skill"
                            value={skill}
                            onChange={(e) => {
                                const newSkills = [...form.technicalSkills];
                                newSkills[index] = e.target.value;
                                setForm(prev => ({ ...prev, technicalSkills: newSkills }));
                            }}
                        />
                        {index > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    const newSkills = form.technicalSkills.filter((_, i) => i !== index);
                                    setForm(prev => ({ ...prev, technicalSkills: newSkills }));
                                }}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button
                    variant="outline"
                    onClick={() => setForm(prev => ({ ...prev, technicalSkills: [...prev.technicalSkills, ''] }))}
                    className="w-full"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                </Button>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-4">Projects</h3>
                {form.projects.map((project, index) => (
                    <div key={index} className="space-y-3 mb-4 p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium">Project {index + 1}</h4>
                            {index > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeArrayItem('projects', index)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        <Input
                            placeholder="Project Title"
                            value={project.title}
                            onChange={(e) => handleArrayChange('projects', index, { title: e.target.value })}
                        />
                        <Input
                            placeholder="Technologies Used"
                            value={project.technologies}
                            onChange={(e) => handleArrayChange('projects', index, { technologies: e.target.value })}
                        />
                        <Textarea
                            placeholder="Project Description"
                            value={project.description}
                            onChange={(e) => handleArrayChange('projects', index, { description: e.target.value })}
                        />
                    </div>
                ))}
                <Button
                    variant="outline"
                    onClick={() => addArrayItem('projects', { title: '', technologies: '', description: '' })}
                    className="w-full"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                </Button>
            </div>
        </div>
    );

    const renderUploadsAndPreferences = () => (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <motion.div variants={itemVariants}>
                <h3 className="text-lg font-semibold mb-4">Upload Documents</h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <Input
                            type="file"
                            name="resume"
                            onChange={handleChange}
                            accept=".pdf,.doc,.docx"
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <ImageIcon className="w-5 h-5 text-blue-500" />
                        <Input
                            type="file"
                            name="photo"
                            onChange={handleChange}
                            accept="image/*"
                            required
                        />
                    </div>
                </div>
            </motion.div>
            <motion.div variants={itemVariants}>
                <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Preferred Roles</label>
                        {form.preferredRoles.map((role, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <Input
                                    placeholder="Preferred Role"
                                    value={role}
                                    onChange={(e) => {
                                        const newRoles = [...form.preferredRoles];
                                        newRoles[index] = e.target.value;
                                        setForm(prev => ({ ...prev, preferredRoles: newRoles }));
                                    }}
                                />
                                {index > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            const newRoles = form.preferredRoles.filter((_, i) => i !== index);
                                            setForm(prev => ({ ...prev, preferredRoles: newRoles }));
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            onClick={() => setForm(prev => ({ ...prev, preferredRoles: [...prev.preferredRoles, ''] }))}
                            className="w-full mt-2"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Preferred Role
                        </Button>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Available Start Date</label>
                        <PremiumCalendar
                            selected={form.availableStartDate}
                            onSelect={(date) => setForm(prev => ({ ...prev, availableStartDate: date }))}
                            error={formErrors.availableStartDate}
                        />
                    </div>
                </div>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-blue-500" />
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={form.agreeToTerms}
                        onChange={(e) => setForm(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                        className="rounded border-gray-300"
                        required
                    />
                    <span className="text-sm">I agree to the terms and conditions</span>
                </label>
            </motion.div>
        </motion.div>
    );

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader className="flex-shrink-0">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
                            <Sparkles className="w-6 h-6 text-blue-500" />
                            <span>Job Application</span>
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 mt-2">
                            Please fill out all required fields to complete your application.
                            Fields marked with * are mandatory.
                        </DialogDescription>
                    </motion.div>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
                    <div className="flex-shrink-0">
                        {renderStepIndicator()}
                    </div>
                    <div 
                        ref={formRef}
                        className="flex-grow overflow-y-auto pr-4 custom-scrollbar"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                variants={stepVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="pb-4"
                            >
                                {renderFormSection()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <motion.div 
                        className="flex-shrink-0 flex justify-between pt-4 mt-4 border-t bg-white dark:bg-gray-800 sticky bottom-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {currentStep > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180" />
                                Previous
                            </Button>
                        )}
                        
                        {currentStep < 5 ? (
                            <Button
                                type="button"
                                onClick={handleNext}
                                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Rocket className="w-4 h-4 mr-2" />
                                        Submit Application
                                    </>
                                )}
                            </Button>
                        )}
                    </motion.div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// Add custom scrollbar styles
const style = document.createElement('style');
style.textContent = `
    .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;
document.head.appendChild(style);

export default PremiumApplicationForm;
