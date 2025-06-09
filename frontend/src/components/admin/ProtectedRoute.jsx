import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (user === null || user.role !== 'recruiter') {
            navigate("/login", { 
                replace: true,
                state: { from: window.location.pathname }
            });
        }
        setIsChecking(false);
    }, [user, navigate]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return user?.role === 'recruiter' ? children : null;
};

export default ProtectedRoute;