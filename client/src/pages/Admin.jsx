import AdminComponent from '../components/admin/AdminComponent';
import OrdersList from '../components/admin/OrdersList';

const Admin = () => {
  return (
    <div className="container">
      <AdminComponent />
      <OrdersList />
    </div>
  );
};

export default Admin;
