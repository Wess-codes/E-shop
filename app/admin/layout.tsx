import { title } from "process";
import AdminNav from "../components/admin/AdminNav";

export const metadata = {
    title   : "E-shop Admin",
    description : "E-shop Admin Dashboard",
}


const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return(
    <div>
        <div>
        <AdminNav />
        {children}

        </div>
    </div>);
}
export default AdminLayout;