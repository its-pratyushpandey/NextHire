const templates = {
    jobSearch: (context: any) => ({
        text: `Based on your profile and preferences, here are some job search tips for ${context.page}:`,
        suggestions: [
            "Update your profile",
            "Browse latest jobs",
            "Set job alerts",
            "Network with professionals"
        ]
    }),
    resume: () => ({
        text: "Here's how to improve your resume:",
        suggestions: [
            "Use keywords from job descriptions",
            "Highlight achievements",
            "Keep it concise",
            "Include relevant skills"
        ]
    }),
    default: (context: any) => ({
        text: "How can I assist you today?",
        suggestions: [
            "Explore features",
            "Get help",
            "View guides"
        ]
    })
    // Add more templates as needed
};

export const generateTemplateResponse = (message: string, context: any) => {
    const keywords = {
        jobSearch: ['find job', 'job search', 'looking for work'],
        resume: ['resume', 'cv', 'curriculum'],
        interview: ['interview', 'preparation', 'questions']
    };

    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => message.toLowerCase().includes(word))) {
            return templates[category](context);
        }
    }

    return templates.default(context);
};