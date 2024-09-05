import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Wishlist() {
    const [wishlist, setWishlist] = useState([])

    const userData = UserData()

    const fetchWishlist = async () => {
        await apiInstance.get(`customer/wishlist/${userData?.user_id}/`).then((res) => {
            setWishlist(res.data)
        })
    }

    useEffect(() => {
        fetchWishlist()
    }, [])

    const addToWishList = async (productID, userID) => {
        try {
            const formdata = new FormData()
            formdata.append("product_id", productID)
            formdata.append("user_id", userID)

            const response = await apiInstance.post(`customer/wishlist/${userID}/`, formdata)
            console.log(response.data);

            fetchWishlist()

            Swal.fire({
                icon: "success",
                title: response.data.message,
            })
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <main className="mt-5">
            <div className="container">
                <section className="">
                    <div className="row">
                        {/* Sidebar Here */}
                        <Sidebar />
                        <div className="col-lg-9 mt-1">
                            <section className="">
                                <main className="mb-5" style={{}}>
                                    <div className="container">
                                        <section className="">
                                            <div className="row">
                                                <h3 className="mb-3">                                                    
                                                    <i className="fas fa-heart text-danger" /> Wishlist
                                                </h3>

                                                {wishlist?.map((w, index) => (
                                                    <div className="col-lg-4 col-md-12 mb-4" key={index}>
                                                        <div className="card">
                                                            <div
                                                                className="bg-image hover-zoom ripple"
                                                                data-mdb-ripple-color="light"
                                                            >
                                                                <Link to={`/detail/${w.product?.slug}/`}>
                                                                    <img
                                                                        src={w.product?.image}
                                                                        className="w-100"
                                                                        style={{ width: "100%", height: "250px", objectFit: "cover" }}
                                                                    />
                                                                </Link>
                                                            </div>
                                                            <div className="card-body">
                                                                <Link to={`/detail/${w.product?.slug}/`} className="text-reset">
                                                                    <h5 className="card-title mb-3">{w.product?.title}</h5>
                                                                </Link>
                                                                <a href="" className="text-reset">
                                                                    <p>{w.product?.category?.title}</p>
                                                                </a>
                                                                <div className="d-flex">
                                                                    <h6 className="mb-3">${w.product?.price}</h6>
                                                                    <h6 className="mb-3 text-muted ms-3"><strike> ${w.product?.old_price}</strike></h6>
                                                                </div>
                                                                <div className="btn-group">
                                                                    
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger px-3 me-1 ms-2"
                                                                        onClick={() => addToWishList(w.product.id, userData?.user_id)}
                                                                    >
                                                                        <i className="fas fa-heart" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Show This if there are no item in wishlist */}
                                                {/* <h6 className='container'>Your wishlist is Empty </h6> */}
                                                {wishlist.length < 1 &&
                                                    <h4 className='p-4'>No item in wishlist</h4>
                                                }


                                            </div>
                                        </section>
                                    </div>
                                </main>
                            </section>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Wishlist