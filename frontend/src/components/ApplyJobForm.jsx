import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { Dialog, DialogContent } from './ui/dialog'
import { Loader2 } from 'lucide-react'

const ApplyJobForm = ({ jobId, onClose, job }) => {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        contactNumber: '',
        experience: '',
        coverLetter: '',
        resume: null
    })

    const handleChange = (e) => {
        const { name, value, files } = e.target
        setForm(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData()
            Object.entries(form).forEach(([key, value]) => {
                if (value) formData.append(key, value)
            })

            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                }
            )

            if (res.data.success) {
                toast.success('Application submitted successfully!')
                onClose()
            }
        } catch (error) {
            console.error('Application error:', error)
            toast.error(error.response?.data?.message || 'Error submitting application')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-xl font-semibold">Apply for {job?.title}</h2>
                    
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={form.fullName}
                            onChange={handleChange}
                            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                            required
                        />
                        
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                            required
                        />

                        <input
                            type="tel"
                            name="contactNumber"
                            placeholder="Contact Number"
                            value={form.contactNumber}
                            onChange={handleChange}
                            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                            required
                        />

                        <input
                            type="text"
                            name="experience"
                            placeholder="Years of Experience"
                            value={form.experience}
                            onChange={handleChange}
                            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                            required
                        />

                        <textarea
                            name="coverLetter"
                            placeholder="Cover Letter"
                            value={form.coverLetter}
                            onChange={handleChange}
                            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
                            rows={4}
                            required
                        />

                        <input
                            type="file"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            onChange={handleChange}
                            className="w-full p-2"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 min-h-[40px] min-w-[120px] flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </div>
                            ) : (
                                'Submit Application'
                            )}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ApplyJobForm
