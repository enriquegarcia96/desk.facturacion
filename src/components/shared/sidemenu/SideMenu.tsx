import { useEffect, useMemo } from "react";
import { NavLink } from "react-router";
import {
  IoLogOutOutline,
  IoHeartOutline,
  IoSpeedometerOutline,
  IoListOutline,
  IoFileTrayFullOutline,
  IoFastFoodOutline,
  IoBasketOutline
} from "react-icons/io5";

import "./SideMenu.css";
import { SideMenuItem } from "./SideMenuItem";
import { IMenu } from "@interface/ApiResponse";
import { InfoEmployeeRequest } from "@interface/Request";
import { useSideMenuStore } from "./store/sideMenu.store";
import { useAuthStore } from "../../../features/auth/store/auth.store";

export const SideMenu = () => {
  const { user } = useAuthStore();
  const menus = useSideMenuStore((state) => state.menus);
  const loadMenusAction = useSideMenuStore((state) => state.loadEmployeeMenusAction);

  const defaultMenu: IMenu[] = [  
    { titleMenu: 'Dashboard', subTitle: 'Visualizar data', route: '/panel', Icon: IoSpeedometerOutline },
    { titleMenu: 'Inventario', subTitle: 'Actualización', route: '/panel/inventario', Icon: IoBasketOutline  },
    { titleMenu: 'Categorias', subTitle: 'Inventario de Categorias', route: '/panel/inventario/categorias', Icon: IoFileTrayFullOutline  },
    { titleMenu: 'Productos', subTitle: 'Inventario de Productos', route: '/panel/inventario/productos', Icon: IoFastFoodOutline },
    { titleMenu: 'Tareas', subTitle: 'Listado de tareas', route: '/dashboard/tasks', Icon: IoListOutline },
    { titleMenu: 'Boda', subTitle: 'Invitados a la boda', route: '/dashboard/wedding-invitation', Icon: IoHeartOutline },
    { titleMenu: "Boda", subTitle: "Invitados a la boda", route: "/dashboard/wedding-invitation", Icon: IoHeartOutline },
    { titleMenu: "Ventas", subTitle: "vender productos", route: "/venta/facturacion", Icon: IoHeartOutline},
    {titleMenu: "siuuu", subTitle: "admin", route: "/admin/reporte", Icon: IoHeartOutline },
  ];

  const misMenus = useMemo(
    () => defaultMenu.filter((option) => menus.some((menu) => menu.route === option.route)),
    [menus]
  );

  useEffect(() => {
  const createSidebarMenus = async () => {
      if (!user) return;
      
      const {identityEmployee, userName} = user;
      const request: InfoEmployeeRequest = {
        identityEmployee, userName
      };
      
      await loadMenusAction(request);
    };

  createSidebarMenus();
  }, [user, loadMenusAction]);

  return (
    <div
      id="menu"
      className="bg-gray-900 min-h-screen z-10 text-slate-300 w-80 left-0 overflow-y-scroll"
    >
      <div id="logo" className="my-4 px-6">
        {/* Title */}
        <h1 className="text-lg md:text-2xl font-bold text-white">
          Zustand
          <span className="text-blue-500 text-xs"> StateManager</span>.
        </h1>
        <p className="text-slate-500 text-sm">
          Manejador de estados simple pero poderoso.
        </p>
      </div>

      {/*  Profile */}
      <div id="profile" className="px-6 py-10">
        <p className="text-slate-500">Bienvenido,</p>
        <a href="#" className="inline-flex space-x-2 items-center">
          <span>
            <img
              className="rounded-full w-8 h-8"
              src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&q=80"
              alt=""
            />
          </span>
          <span className="text-sm md:text-base font-bold">{user?.userName}</span>
        </a>
      </div>

      {/* Menu Items */}
      <nav id="nav" className="w-full px-6">
        {misMenus.map((item) => (
          <SideMenuItem key={item.route} {...item} />
        ))}

        {/* Logout */}
        <NavLink to={"/auth/login"} className="mt-10">
          <div>
            <IoLogOutOutline />
          </div>
          <div className="flex flex-col">
            <span className="text-lg text-slate-300 font-bold leading-5">
              Logout
            </span>
            <span className="text-sm text-slate-500 hidden md:block">
              Cerrar sesión
            </span>
          </div>
        </NavLink>
      </nav>
    </div>
  );
};
