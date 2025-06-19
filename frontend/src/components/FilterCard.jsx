import React from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const filterData = [
    {
        filterType: "Job Type",
        array: ["Full Time", "Part Time", "Contract", "Internship"]
    },
    {
        filterType: "Experience Level",
        array: ["Entry Level", "Intermediate", "Senior", "Expert"]
    },
    {
        filterType: "Location",
        array: ["Remote", "On-Site", "Hybrid"]
    }
]

const FilterCard = () => {
    const dispatch = useDispatch();
    
    const changeHandler = (value) => {
        dispatch(setSearchedQuery(value));
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Filter Jobs
            </h2>
            <div className="space-y-6">
                {filterData.map((section, sectionIndex) => (
                    <div key={`filter-section-${sectionIndex}`} className="space-y-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                            {section.filterType}
                        </h3>
                        <RadioGroup 
                            onValueChange={changeHandler}
                            className="space-y-3"
                        >
                            {section.array.map((item, itemIndex) => (
                                <div key={`filter-item-${sectionIndex}-${itemIndex}`} className="flex items-center space-x-3">
                                    <RadioGroupItem
                                        value={item}
                                        id={`filter-${sectionIndex}-${itemIndex}`}
                                        className="border-gray-400 dark:border-gray-600"
                                    />
                                    <Label 
                                        htmlFor={`filter-${sectionIndex}-${itemIndex}`}
                                        className="text-gray-700 dark:text-gray-300 cursor-pointer"
                                    >
                                        {item}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FilterCard