import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiInstance from '../../utils/axios';
import Swal from 'sweetalert2';

import UserData from "../plugin/UserData";
import CardID from "../plugin/CardID"
import GetCurrentAddress from '../plugin/UserCountry';


const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
})

function Cart() {
    const [cart, setCart] = useState([])
    const [cartTotal, setCartTotal] = useState([])
    const [productQuantities, setProductQuantities] = useState('')

    const userData = UserData()
    const cart_id = CardID()
    const currentAddress = GetCurrentAddress()

    const fetchCartData = (cartId, userId) => {
        const url = userId ? `cart-list/${cartId}/${userId}/` : `cart-list/${cartId}/`
        apiInstance.get(url).then((res) => {
            setCart(res.data)
        })
    }

    const fetchCartTotal = (cartId, userId) => {
        const url = userId ? `cart-detail/${cartId}/${userId}/` : `cart-detail/${cartId}/`
        apiInstance.get(url).then((res) => {
            setCartTotal(res.data)
        })
    }

    if (cart_id !== null || cart_id !== undefined) {
        if (userData !== undefined) {
            // send cart data with userId
            useEffect(() => {
                fetchCartData(cart_id, userData?.user_id);
                fetchCartTotal(cart_id, userData?.user_id);
            }, []);
        } else {
            // send cart data without userId but only cartId
            useEffect(() => {
                fetchCartData(cart_id, null);
                fetchCartTotal(cart_id, null);
            }, []);
        }
    }

    useEffect(() => {
        const initialQuantities = {}
        cart.forEach((c) => {
            initialQuantities[c.product?.id] = c.qty
        })
        setProductQuantities(initialQuantities)
    }, [cart])

    const handleQuantutyChange = (event, product_id) => {
        const quantity = event.target.value
        setProductQuantities((prevQuantities) => ({
            ...prevQuantities,
            [product_id]: quantity
        }))
    }

    const updateCart = async (product_id, price, shipping_amount, color, size) => {
        const qtyValue = productQuantities[product_id]
        const formdata = new FormData()

        formdata.append("product_id", product_id)
        formdata.append("user_id", userData?.user_id)
        formdata.append("qty", qtyValue)
        formdata.append("price", price)
        formdata.append("shipping_amount", shipping_amount)
        formdata.append("country", currentAddress.country)
        formdata.append("size", size)
        formdata.append("color", color)
        formdata.append("cart_id", cart_id)

        const response = await apiInstance.post('cart-view/', formdata)
        console.log(response.data);

        fetchCartData(cart_id, userData?.user_id);
        fetchCartTotal(cart_id, userData?.user_id);

        Toast.fire({
            icon: "success",
            title: response.data.message,
        })
    }

    const handleDeleteCartItem = async (itemId) => {
        const url = userData?.user_id
            ? `cart-delete/${cart_id}/${itemId}/${userData?.user_id}/`
            : `cart-delete/${cart_id}/${itemId}/`

        try {
            await apiInstance.delete(url)

            fetchCartData(cart_id, userData?.user_id);
            fetchCartTotal(cart_id, userData?.user_id);

            Toast.fire({
                icon: "success",
                title: "Item Removed from Cart"
            })
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <main className="mt-5">
            <div className="container">
                <main className="mb-6">
                    <div className="container">
                        <section className="">
                            <div className="row gx-lg-5 mb-5">
                                <div className="col-lg-8 mb-4 mb-md-0">
                                    {/* Single Product List */}
                                    <section className="mb-5">

                                        {cart?.map((c, index) =>
                                            <div className="row border-bottom mb-4" key={index}>
                                                <div className="col-md-2 mb-4 mb-md-0">
                                                    <div
                                                        className="bg-image ripple rounded-5 mb-4 overflow-hidden d-block"
                                                        data-ripple-color="light"
                                                    >
                                                        <Link to=''>
                                                            <img
                                                                src={c.product?.image}
                                                                className="w-100"
                                                                alt=""
                                                                style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "10px" }}
                                                            />
                                                        </Link>
                                                        <a href="#!">
                                                            <div className="hover-overlay">
                                                                <div
                                                                    className="mask"
                                                                    style={{
                                                                        backgroundColor: "hsla(0, 0%, 98.4%, 0.2)"
                                                                    }}
                                                                />
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="col-md-8 mb-4 mb-md-0">
                                                    <Link to={null} className="fw-bold text-dark mb-4">{c.product?.title}</Link>
                                                    {c.size !== "No Size" &&
                                                        <p className="mb-0">
                                                            <span className="text-muted me-2">Size:</span>
                                                            <span>{c.size}</span>
                                                        </p>
                                                    }
                                                    {c.color !== "No Color" &&
                                                        <p className='mb-0'>
                                                            <span className="text-muted me-2">Color:</span>
                                                            <span>{c.color}</span>
                                                        </p>
                                                    }
                                                    <p className='mb-0'>
                                                        <span className="text-muted me-2">Price:</span>
                                                        <span>${c.price}</span>
                                                    </p>

                                                    {/* <p className='mb-0'>
                                                    <span className="text-muted me-2">Stock Qty:</span>
                                                    <span>3</span>
                                                </p>
                                                <p className='mb-0'>
                                                    <span className="text-muted me-2">Vendor:</span>
                                                    <span>Desphixs</span>
                                                </p> */}

                                                    <p className="mt-3">
                                                        <button onClick={() => handleDeleteCartItem(c.id)} className="btn btn-danger ">
                                                            <small><i className="fas fa-trash me-2" />Remove</small>
                                                        </button>
                                                    </p>
                                                </div>
                                                <div className="col-md-2 mb-4 mb-md-0">
                                                    <div className="d-flex justify-content-center align-items-center">
                                                        <div className="form-outline">
                                                            {/* <label className='form-label' htmlFor='typeNumber'>Quantity</label> */}
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                value={productQuantities[c.product?.id] || c.qty}
                                                                min={1}
                                                                onChange={(e) => handleQuantutyChange(e, c.product.id)}
                                                            />
                                                        </div>
                                                        <button onClick={() => updateCart(c.product.id, c.product.price, c.product.shipping_amount, c.color, c.size)} className='ms-2 btn btn-primary'><i className='fas fa-rotate-right'></i></button>
                                                    </div>
                                                    {/* <h5 className="mb-2 mt-3 text-center"><span className="align-middle">$100.00</span></h5> */}
                                                    <h5 className="mb-2 mt-3"><span className="align-middle">${c.sub_total}</span></h5>

                                                    <p className='text-dark'>
                                                        <small>Sub Total</small>
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {cart.length < 1 &&
                                            <h5>Your Cart Is Empty</h5>
                                        }
                                        <hr />
                                        <Link to='/' className='btn btn-primary'> <i className='fas fa-shopping-cart'></i> Continue Shopping</Link>


                                        {/* Personal info */}
                                    </section>
                                    {cart?.length > 0 &&
                                        <form>
                                            <h5 className="mb-4 mt-4">Personal Information</h5>
                                            {/* 2 column grid layout with text inputs for the first and last names */}
                                            <div className="row mb-4">
                                                <div className="col">
                                                    <div className="form-outline">
                                                        <label className="form-label" htmlFor="full_name"> <i className='fas fa-user'></i> Full Name</label>
                                                        <input
                                                            type="text"
                                                            id=""
                                                            name='fullName'
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="row mb-4">
                                                <div className="col">
                                                    <div className="form-outline">
                                                        <label className="form-label" htmlFor="form6Example1"><i className='fas fa-envelope'></i> Email</label>
                                                        <input
                                                            type="text"
                                                            id="form6Example1"
                                                            className="form-control"
                                                            name='email'

                                                        />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-outline">
                                                        <label className="form-label" htmlFor="form6Example1"><i className='fas fa-phone'></i> Mobile</label>
                                                        <input
                                                            type="text"
                                                            id="form6Example1"
                                                            className="form-control"
                                                            name='mobile'
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <h5 className="mb-1 mt-4">Shipping address</h5>

                                            <div className="row mb-4">
                                                <div className="col-lg-6 mt-3">
                                                    <div className="form-outline">
                                                        <label className="form-label" htmlFor="form6Example1"> Address</label>
                                                        <input
                                                            type="text"
                                                            id="form6Example1"
                                                            className="form-control"
                                                            name='address'
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 mt-3">
                                                    <div className="form-outline">
                                                        <label className="form-label" htmlFor="form6Example1"> City</label>
                                                        <input
                                                            type="text"
                                                            id="form6Example1"
                                                            className="form-control"
                                                            name='city'
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mt-3">
                                                    <div className="form-outline">
                                                        <label className="form-label" htmlFor="form6Example1"> State</label>
                                                        <input
                                                            type="text"
                                                            id="form6Example1"
                                                            className="form-control"
                                                            name='state'
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 mt-3">
                                                    <div className="form-outline">
                                                        <label className="form-label" htmlFor="form6Example1"> Country</label>
                                                        <input
                                                            type="text"
                                                            id="form6Example1"
                                                            className="form-control"
                                                            name='country'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    }

                                </div>
                                <div className="col-lg-4 mb-4 mb-md-0">
                                    {/* Section: Summary */}
                                    <section className="shadow-4 p-4 rounded-5 mb-4">
                                        <h5 className="mb-3">Cart Summary</h5>
                                        <div className="d-flex justify-content-between mb-3">
                                            <span>Subtotal </span>
                                            <span>${cartTotal.sub_total?.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span>Shipping </span>
                                            <span>${cartTotal.shipping?.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span>Tax </span>
                                            <span>${cartTotal.tax?.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span>Servive Fee </span>
                                            <span>${cartTotal.service_fee?.toFixed(2)}</span>
                                        </div>
                                        <hr className="my-4" />
                                        <div className="d-flex justify-content-between fw-bold mb-5">
                                            <span>Total </span>
                                            <span>${cartTotal.total?.toFixed(2)}</span>
                                        </div>
                                        <button className="btn btn-primary btn-rounded w-100" >
                                            Proceed to Checkout <i className='fas fa-arrow-right ms-2'></i>
                                        </button>
                                    </section>
                                    {/* APPLY COUPAN CODE */}
                                    <section className='shadow card p-4 rounded-5'>
                                        <h4 className='mb-4'>Apply promo code</h4>
                                        <div className='d-flex align-items-center'>
                                            <input
                                                type='text'
                                                className='form-control rounded me-1'
                                                placeholder='Promo code'
                                            />
                                            {/* <button
                                                type='button'
                                                className='btn btn-link btn-rounded overflow-visible'
                                            > */}
                                            <button
                                                type='button'
                                                className='btn btn-secondary btn-rounded overflow-visible'
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </section>
                                    {/* APPLY COUPAN CODE */}
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </main>

    )
}

export default Cart