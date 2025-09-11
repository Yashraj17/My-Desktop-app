import { MenuIcon } from "../components/svgIcons";
import Dashboard from "../pages/Dashboard";
import { ItemCategory } from "../pages/ItemCategory";
import Staff from "../pages/Staff";
import Menus from "../pages/Menus";
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

const routes = [
    { 
        icon: Home, 
        label: "Dashboard", 
        url: "/", 
        component: Dashboard,
        hasDropdown: false
    },
    { 
        icon: Bell, 
        label: "Table", 
        url: "/table", 
        hasDropdown: true,
        children:[
           {
            label:"Areas",
            url:"/areas",
            component:Areas
            },
             {
            label:"Tables",
            url:"/table",
            component:Tables
            },
        ]
    },
    { 
        icon: Truck, 
        label: "Menu", 
        url: "/menu", 
        hasDropdown: true,
        children:[
           {
            icon:Bell,
            label:"Menus",
            url:"/menus",
            component:Menus,
            },
           {
            icon:Utensils,
            label:"Item Categories",
            url:"/item-categories",
            component:ItemCategory,
            },
           {
            icon:Utensils,
            label:"Menu Items",
            url:"/menu-items",
            component:MenuItems,
            },
           {
            icon:Utensils,
            label:"Modifier Group",
            url:"/modifier-group",
            component:ModifierGroup,
            },
           {
            icon:Utensils,
            label:"Item Modifiers",
            url:"/item-modifier",
            component:ItemModifiers,
            },
        ]
    }
].filter(v => (!v.hidden) || v.children?.length);

export default routes;
