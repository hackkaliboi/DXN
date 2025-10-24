import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
    const { isAdmin, loading: adminLoading } = useAdmin();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (!adminLoading && !isAdmin) {
            navigate("/");
            toast({
                variant: "destructive",
                title: "Access Denied",
                description: "You don't have permission to access this page.",
            });
        }
    }, [isAdmin, adminLoading, navigate, toast]);

    // Show loading state when checking admin status
    if (adminLoading) {
        return null;
    }

    // Show nothing if not admin
    if (!isAdmin) {
        return null;
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">Configure site settings and preferences</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                    <p>Settings management interface will be implemented here.</p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Settings;