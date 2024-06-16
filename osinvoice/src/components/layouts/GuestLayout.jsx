import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../../contexts/NavigationContext";
import logo from "../../assets/images/logo.png";

export const GuestLayout = () => {
  const { token } = useStateContext();
  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <section className="flex px-[5%] flex-col py-5">
      <img className="md:w-[90px] w-[20%] mb-5 md:mb-0" src={logo} />
      <Outlet />
    </section>
  );
};
