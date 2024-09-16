import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import apiInstance from '../../utils/axios';

function PaymentSuccess() {
    const [order, setOrder] = useState({})
    // const [loading, setIsLoading] = useState(true)
    const [status, setStatus] = useState("Verifying")

    const param = useParams()

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const paypal_order_id = urlParams.get('paypal_order_id');

    console.log(param.order_oid);
    console.log(sessionId);
    console.log("4m PaymentSuccess.jsx === PAYPAL ORDER ID", paypal_order_id);

    useEffect(() => {
        apiInstance.get(`checkout/${param.order_oid}/`).then((res) => {
            setOrder(res.data)
        })
    }, [param])

    useEffect(() => {
        const formdata = new FormData()
        formdata.append("order_oid", param?.order_oid)
        formdata.append("session_id", sessionId)
        formdata.append("paypal_order_id", paypal_order_id)

        // setIsLoading("Verifying")
        setStatus("Verifying")

        apiInstance.post(`payment-success/${param.order_oid}/`, formdata).then((res) => {
            if (res.data.message === "Payment Successfull") {
                setStatus("Payment Successfull")
            }
            else if (res.data.message === "Already Paid") {
                setStatus("Already Paid")
            }
            else if (res.data.message === "Your Invoice is Unpaid") {
                setStatus("Your Invoice is Unpaid")
            }
            // if(res.data === "Your Invoice was canclled"){
            //     setStatus("Your Invoice was canclled")
            // }
            console.log(res.data);
        })
    // }, [param?.order_oid])
    }, [param.order_oid, paypal_order_id, sessionId])

    return (
        <>
            <main>
                <main className="mb-4 mt-4 h-100">
                    <div className="container">
                        {/* Section: Checkout form */}
                        <section className="">
                            <div className="gx-lg-5">
                                <div className="row pb50">
                                    <div className="col-lg-12">
                                        <div className="dashboard_title_area">
                                            {/* <p class="para">Lorem ipsum dolor sit amet, consectetur.</p> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="application_statics">
                                            <div className="account_user_deails dashboard_page">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <div className="col-lg-12">
                                                        <div className="" />

                                                        {status === "Verifying" && (
                                                            <div className="border border-3 border-warning">
                                                                <div className="card bg-white shadow p-5">
                                                                    <div className="mb-4 text-center">
                                                                        <i
                                                                            className="fas fa-clock text-warning"
                                                                            style={{ fontSize: 100, color: "yellow" }}
                                                                        />
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <h3>Payment Verifying <i className="fas fa-spinner fa-spin"></i></h3>
                                                                        <p>
                                                                            <b className='text-success'>Please hold on, while we are verify your payment</b> <br />
                                                                            <b className='text-danger'>NOTE: Do not reload or leave the page</b>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {status === "Your Invoice is Unpaid" && (
                                                            <div className="border border-3 border-warning">
                                                                <div className="card bg-white shadow p-5">
                                                                    <div className="mb-4 text-center">
                                                                        <i
                                                                            className="fas fa-clock text-warning"
                                                                            style={{ fontSize: 100, color: "red" }}
                                                                        />
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <h3>Unpaid Invoice<i className="fas fa-ban"></i></h3>
                                                                        <p>
                                                                            <b className='text-danger'>Please try making the payment again.</b>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {status === "Payment Successfull" && (
                                                            <div className="border border-3 border-success">
                                                                <div className="card bg-white shadow p-5">
                                                                    <div className="mb-4 text-center">
                                                                        <i
                                                                            className="fas fa-check-circle text-success"
                                                                            style={{ fontSize: 100, color: "green" }}
                                                                        />
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <h3>Thank You !</h3>
                                                                        <p>
                                                                            Your checkout was successfull, Please note your order id: <b>{order.oid}</b><br></br>
                                                                            We have sent the order detail to your email: <b>{order.email}</b>
                                                                        </p>
                                                                        <button
                                                                            className="btn btn-success mt-3 me-2"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#exampleModal"
                                                                        >
                                                                            View Order <i className="fas fa-eye" />{" "}
                                                                        </button>
                                                                        <Link to={`/invoice/${order.oid}/`} className="btn btn-primary mt-3 me-2" >
                                                                            Download Invoice{" "}
                                                                            <i className="fas fa-file-invoice" />{" "}
                                                                        </Link>
                                                                        <a
                                                                            href="{% url 'dashboard:dashboard' %}"
                                                                            className="btn btn-secondary mt-3 me-2"
                                                                        >
                                                                            Go Home <i className="fas fa-fa-arrow-left" />{" "}
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {status === "Already Paid" && (
                                                            <div className="border border-3 border-success">
                                                                <div className="card bg-white shadow p-5">
                                                                    <div className="mb-4 text-center">
                                                                        <i
                                                                            className="fas fa-check-circle text-success"
                                                                            style={{ fontSize: 100, color: "green" }}
                                                                        />
                                                                    </div>
                                                                    <div className="text-center">
                                                                        <h3>Already Paid !</h3>
                                                                        <p>
                                                                            Your checkout was successfull, Please note your order id: <b>{order.oid}</b><br></br>
                                                                            We have sent the order detail to your email: <b>{order.email}</b>
                                                                        </p>
                                                                        <button
                                                                            className="btn btn-success mt-3 me-2"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#exampleModal"
                                                                        >
                                                                            View Order <i className="fas fa-eye" />{" "}
                                                                        </button>
                                                                        <Link to={`/invoice/${order.oid}/`} className="btn btn-primary mt-3 me-2" >
                                                                            Download Invoice{" "}
                                                                            <i className="fas fa-file-invoice" />{" "}
                                                                        </Link>
                                                                        <a
                                                                            href="{% url 'dashboard:dashboard' %}"
                                                                            className="btn btn-secondary mt-3 me-2"
                                                                        >
                                                                            Go Home <i className="fas fa-fa-arrow-left" />{" "}
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
                <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Order Summary
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                <div className="modal-body text-start text-black p-4">
                                    <h5
                                        className="modal-title text-uppercase "
                                        id="exampleModalLabel"
                                    >
                                        {order.full_name}
                                    </h5>
                                    <h6>{order.email}</h6>
                                    <h6>{order.mobile}</h6><br />
                                    <h6 className="mb-3">{order.address} - {order.city} <br /> {order.state} - {order.country}</h6>
                                    <p className="mb-0" style={{ color: "#35558a" }}>
                                        Payment Summary
                                    </p>
                                    <hr
                                        className="mt-2 mb-4"
                                        style={{
                                            height: 0,
                                            backgroundColor: "transparent",
                                            opacity: ".75",
                                            borderTop: "2px dashed #9e9e9e"
                                        }}
                                    />

                                    {order.orderitem?.map((o, index) => (
                                        <div key={index} className="small d-flex justify-content-between shadow p-2 rounded-2">
                                            {/* <p className="fw-bold mb-1">{o.product?.title}</p> */}
                                            <p className="mb-1">{o.product?.title}</p>
                                            <p className="text-muted mb-1">${o.price}</p>
                                        </div>
                                    ))}

                                    <div className="d-flex justify-content-between">
                                        <p className="fw-bold mb-0">Sub Total</p>
                                        <p className="text-muted mb-0">${order.sub_total}</p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <p className="small mb-0">Shipping Fee</p>
                                        <p className="small mb-0">${order.shipping_amount}</p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <p className="small mb-0">Service Fee</p>
                                        <p className="small mb-0">${order.service_fee}</p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <p className="small mb-0">Tax</p>
                                        <p className="small mb-0">${order.tax_fee}</p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <p className="small mb-0">Discount</p>
                                        <p className="small mb-0">-${order.saved}</p>
                                    </div>
                                    <div className="d-flex justify-content-between mt-4">
                                        <p className="fw-bold">Total</p>
                                        <p className="fw-bold" style={{ color: "#35558a" }}>
                                            ${order.total}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default PaymentSuccess