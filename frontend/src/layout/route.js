import  MenuIcon  from "../components/menu-icon.svg";
import Dashboard from "../pages/Dashboard";
import { ItemCategory } from "../pages/ItemCategory";
import Menus from "../pages/Menus";
//import orderIcon from "../components/orders-icon.svg";
import TableIcon from "../components/table-icon.svg";
import ReservationIcon from "../components/reservations-icon.svg";
import CustomerIcon from "../components/customers-icon.svg";
import StaffIcon from "../components/staff-icon.svg";
import DeliveryExecutiveIcon from "../components/delivery-executive-icon.svg";
import DashboardIcon from "../components/dashboard-icon.svg";

import {
    Home,
    Utensils,
    Table,
    Bell,
    Calendar,
    CreditCard,
    BarChart3,
    Package,
    Users,
    User,
    Truck,
    MapPin,
    ChevronDown,
    ExternalLink,
    Triangle,
} from "lucide-react"
import { MenuItems } from "../pages/MenuItems";
//import MenuItem from "../pages/MenuItemManagement";
import { ModifierGroup } from "../pages/ModifierGroup";
import { ItemModifiers } from "../pages/ItemModifier";
import { Areas } from "../pages/Areas";
import Tables from "../pages/Tables";
import { Customer } from "../pages/Customer";
import { DeliveryExecutive } from "../pages/DeliveryExecutive";
import { Staff } from "../pages/Staff";
import { Reservations } from "../pages/Reservations";
import POS from "../pages/POS";
import { Orders } from "../pages/Orders";
import KOT from "../pages/KOT";
import { OrderIcon } from "../components/svgIcons";

const routes = [
    {
        icon: DashboardIcon,
        label: "Dashboard",
        url: "/",
        component: Dashboard,
        hasDropdown: false
    },
    {
        icon: MenuIcon,
        label: "Menu",
        url: "/menu",
        hasDropdown: true,
        children: [
            {
                icon: Bell,
                label: "Menus",
                url: "/menus",
                component: Menus,
            },
            {
                icon: Utensils,
                label: "Menu Items",
                url: "/menu-items",
                component: MenuItems,
            },
             {
                icon: Utensils,
                label: "Item Categories",
                url: "/item-categories",
                component: ItemCategory,
            },
            {
                icon: Utensils,
                label: "Modifier Group",
                url: "/modifier-group",
                component: ModifierGroup,
            },
            {
                icon: Utensils,
                label: "Item Modifiers",
                url: "/item-modifier",
                component: ItemModifiers,
            },
        ]
    },
    {
        icon: TableIcon,
        label: "Table",
        url: "/table",
        hasDropdown: true,
        children: [
            {
                label: "Areas",
                url: "/areas",
                component: Areas
            },
            {
                label: "Tables",
                url: "/table",
                component: Tables
            },
        ]
    },
    {
        icon: ReservationIcon,
        label: "Reservations",
        url: "/reservations",
        hasDropdown: false,
        component: Reservations
    },
    {
        icon: CustomerIcon,
        icon: Users,
        label: "POS",
        url: "/pos",
        hasDropdown: false,
        component: POS
    },
    {
        icon: OrderIcon,
        label: "Orders",
        url: "/orders",
        hasDropdown: false,
        component: Orders
    },
    {
        icon: Users,
        label: "KOT",
        url: "/Kot",
        hasDropdown: false,
        component: KOT
    },
    {
        icon: Users,
        label: "Customers",
        url: "/cutomers",
        hasDropdown: false,
        component: Customer
    },
    {
        icon: StaffIcon,
        label: "Staff",
        url: "/staff",
        hasDropdown: false,
        component: Staff
    },
    {
        icon: DeliveryExecutiveIcon,
        label: "Delivery Executive",
        url: "/delivery-executive",
        hasDropdown: false,
        component: DeliveryExecutive
    }
].filter(v => (!v.hidden) || v.children?.length);

export default routes;
