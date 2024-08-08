// import React, { useState, useEffect } from "react";
// import { Routes, Route, BrowserRouter } from "react-router-dom";

// import Login from "./views/auth/Login";
// import Register from "./views/auth/Register";
// import Dashboard from "./views/auth/Dashboard";
// import Logout from "./views/auth/Logout";
// import ForgotPassword from "./views/auth/ForgotPassword";
// import CreatePassword from "./views/auth/CreatePassword";
// import StoreHeader from "./views/base/StoreHeader";
// import StoreFooter from "./views/base/StoreFooter";
// import Products from "./views/store/Products";
// import ProductDetail from "./views/store/ProductDetail";
// import Cart from "./views/store/Cart";
// import Checkout from "./views/store/Checkout";
// import PaymentSuccess from "./views/store/PaymentSuccess";
// import Search from "./views/store/Search";
// import { CartContext } from "./views/plugin/Context";
// import CardID from "./views/plugin/CardID";
// import UserData from "./views/plugin/UserData";
// import apiInstance from "./utils/axios";
// import Account from "./views/customer/Account";
// import PrivateRoute from "./layout/PrivateRoute";
// import MainWrapper from "./layout/MainWrapper";



// function App() {
//     const [count, setCount] = useState(0);
//     const [cartCount, setCartCount] = useState()

//     const cart_id = CardID()
//     const userData = UserData()

//     useEffect(() => {
//         const url = userData ? `cart-list/${cart_id}/${userData?.user_id}/` : `cart-list/${cart_id}/`
//         apiInstance.get(url).then((res) => {
//             setCartCount(res.data.length)
//         })
//     })

//     return (
//         <CartContext.Provider value={[cartCount, setCartCount]}>

//             <BrowserRouter>
//             <StoreHeader/> 
//             <MainWrapper>
//                 <Routes>
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/register" element={<Register />} />
//                     <Route path="/logout" element={<Logout />} />
//                     <Route path="/forgot-password" element={<ForgotPassword />} />
//                     <Route path="/create-new-password" element={<CreatePassword />} />
//                     <Route path="/dashboard" element={<Dashboard />} />

//                     {/* STORE COMPONENTS */}
//                     <Route path='/' element={<Products />} />
//                     <Route path='/detail/:slug/' element={<ProductDetail />} />
//                     <Route path='/cart/' element={<Cart />} />
//                     <Route path='/checkout/:order_oid/' element={<Checkout />} />
//                     <Route path='/payment-success/:order_oid/' element={<PaymentSuccess />} />
//                     <Route path='/search' element={<Search />} />

//                     {/* Customer Routes */}
//                     {/* <Route path='/customer/account/' element={<Account />} /> */}
//                     <Route path="/customer/account/" element={<PrivateRoute><Account /></PrivateRoute>} />
//                 </Routes>
//             </MainWrapper>
//             <StoreFooter/>
//             </BrowserRouter>

//         </CartContext.Provider>
//     );
// }

// export default App;


import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import Dashboard from "./views/auth/Dashboard";
import Logout from "./views/auth/Logout";
import ForgotPassword from "./views/auth/ForgotPassword";
import CreatePassword from "./views/auth/CreatePassword";
import StoreHeader from "./views/base/StoreHeader";
import StoreFooter from "./views/base/StoreFooter";
import Products from "./views/store/Products";
import ProductDetail from "./views/store/ProductDetail";
import Cart from "./views/store/Cart";
import Checkout from "./views/store/Checkout";
import PaymentSuccess from "./views/store/PaymentSuccess";
import Search from "./views/store/Search";
import { CartContext } from "./views/plugin/Context";
import CardID from "./views/plugin/CardID";
import UserData from "./views/plugin/UserData";
import apiInstance from "./utils/axios";
import Account from "./views/customer/Account";
import PrivateRoute from "./layout/PrivateRoute";
import MainWrapper from "./layout/MainWrapper";

function App() {
    const [cartCount, setCartCount] = useState(0); // Initial value for cartCount

    const cart_id = CardID();
    const userData = UserData();

    useEffect(() => {
        if (!cart_id || !userData) return;

        const url = userData ? `cart-list/${cart_id}/${userData.user_id}/` : `cart-list/${cart_id}/`;
        apiInstance.get(url)
            .then((res) => {
                setCartCount(res.data.length);
            })
            .catch((error) => {
                console.error('Error fetching cart data:', error);
            });
    }, [cart_id, userData]); // Dependency array to avoid infinite loop

    return (
        <CartContext.Provider value={[cartCount, setCartCount]}>
            <BrowserRouter>
                <StoreHeader />
                <MainWrapper>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/create-new-password" element={<CreatePassword />} />
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* STORE COMPONENTS */}
                        <Route path='/' element={<Products />} />
                        <Route path='/detail/:slug/' element={<ProductDetail />} />
                        <Route path='/cart/' element={<Cart />} />
                        <Route path='/checkout/:order_oid/' element={<Checkout />} />
                        <Route path='/payment-success/:order_oid/' element={<PaymentSuccess />} />
                        <Route path='/search' element={<Search />} />

                        {/* Customer Routes */}
                        <Route path='/customer/account/' element={<PrivateRoute><Account /></PrivateRoute>} />
                    </Routes>
                </MainWrapper>
                <StoreFooter />
            </BrowserRouter>
        </CartContext.Provider>
    );
}

export default App;
