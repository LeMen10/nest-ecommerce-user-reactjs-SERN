import Home from "~/pages/Home/Home"
import Cart from "~/pages/Cart/Cart"
import CheckOut from "~/pages/CheckOut/CheckOut"
import Shop from "~/pages/Shop/Shop"
import About from "~/pages/About/About"
import Contact from "~/pages/Contact/Contact"
import Login from "~/pages/Login/Login"
import Register from "~/pages/Register/Register"
import Search from "~/pages/Search/Search"
import Detail from "~/pages/Detail/Detail"
import Success from "~/pages/Success/Success"
// import Payment from "~/pages/Payment/Payment"
import Reset from "~/pages/Reset/Reset"
import Forgot from "~/pages/Forgot/Forgot"
import Purchase from "~/pages/Purchase/Purchase"
import Cancel from "~/pages/Cancel/Cancel"

const publicRouter = [
    {path: '/', component: Home},
    {path: '/success', component: Success, layout: null},
    {path: '/cancel', component: Cancel, layout: null},
    // {path: '/payment', component: Payment, layout: null},
    {path: '/product/:slug', component: Detail},
    {path: '/cart', component: Cart},
    {path: '/checkout', component: CheckOut},
    {path: '/about', component: About},
    {path: '/contact', component: Contact},
    {path: '/shop', component: Shop},
    {path: '/search', component: Search},
    {path: '/login', component: Login, layout: null},
    {path: '/reset_password/:slug', component: Reset, layout: null},
    {path: '/forgot_password', component: Forgot, layout: null},
    {path: '/register', component: Register, layout: null},

    {path: '/user/purchase', component: Purchase},
]

const privateRouter = [

]

export { publicRouter, privateRouter }