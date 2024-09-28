import React from 'react'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'
import Swal from 'sweetalert2'


function Coupon() {
    const [stats, setStats] = useState([])
    const [coupons, setCoupons] = useState([])
    const [createCoupon, setCreateCoupon] = useState({
        code: "",
        discount: "",
        active: true
    })

    const fetchCouponData = async () => {
        await apiInstance.get(`vendor-coupon-stats/${UserData()?.vendor_id}/`).then((res) => {
            setStats(res.data[0]);
        })

        await apiInstance.get(`vendor-coupon-list/${UserData()?.vendor_id}/`).then((res) => {
            setCoupons(res.data);
        })
    }

    useEffect(() => {
        fetchCouponData()

    }, [])

    const handleDeleteCoupon = async (couponId) => {
        await apiInstance.delete(`vendor-coupon-detail/${UserData().vendor_id}/${couponId}/`)
        fetchCouponData()
        Swal.fire({
            icon: 'success',
            title: 'Coupon Deleted',
        })
    }

    const handleCouponChange = (event) => {
        setCreateCoupon({
            ...createCoupon,
            [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
        })
        console.log(createCoupon.code);
        console.log(createCoupon.discount);
        console.log(createCoupon.active);      
    }

    const handleCreateCoupon = async (e) => {
        e.preventDefault()

        const formdata = new FormData()
        
        formdata.append('vendor_id', UserData()?.vendor_id)
        formdata.append('code', createCoupon.code)
        formdata.append('discount', createCoupon.discount)
        formdata.append('active', createCoupon.active)

        await apiInstance.post(`vendor-coupon-list/${UserData()?.vendor_id}/`, formdata).then((res) => {
            console.log(res.data);            
        })
        fetchCouponData()
        Swal.fire({
            icon: 'success',
            title: 'Coupon Created',
        })
    }

    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
                {/* Sidebar Here */}
                <Sidebar />
                <div className="col-md-9 col-lg-10 main mt-4">
                    <div className="row mb-3">
                        <div className="col-xl-6 col-lg-6 mb-2">
                            <div className="card card-inverse card-success">
                                <div className="card-block bg-success p-3">
                                    <div className="rotate">
                                        <i className="bi bi-tag fa-5x"></i>
                                    </div>
                                    <h6 className="text-uppercase">Total Coupons</h6>
                                    <h1 className="display-1">{stats.total_coupons}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 mb-2">
                            <div className="card card-inverse card-danger">
                                <div className="card-block bg-danger p-3">
                                    <div className="rotate">
                                        <i className="bi bi-check-circle fa-5x"></i>
                                    </div>
                                    <h6 className="text-uppercase">Active Coupons</h6>
                                    <h1 className="display-1">{stats.active_coupons}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="row container">
                        <div className="col-lg-12">
                            <h4 className="mt-3 mb-4">
                                <i className="bi bi-tag"></i> Coupons
                            </h4>
                            <table className="table">
                                <thead className="table-dark">

                                    <tr>
                                        <th scope="col">Code</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Discount</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Action</th>
                                    </tr>



                                </thead>
                                <tbody>
                                    {coupons?.map((c, index) => (
                                        <tr key={index}>
                                            <td>{c.code}</td>
                                            <td>Percentage</td>
                                            <td>{c.discount}%</td>
                                            <td>
                                                {c.active === true
                                                    ? 'Active'
                                                    : 'In-active'
                                                }
                                            </td>
                                            <td>
                                                <Link to={`/vendor/coupon/${c.id}/`} className="btn btn-primary mb-1 ms-2">
                                                    <i className="fas fa-edit"></i>
                                                </Link>
                                                <a onClick={() => handleDeleteCoupon(c.id)} href="#" className="btn btn-danger mb-1 ms-2">
                                                    <i className="fas fa-trash"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}

                                    {coupons.length < 1 &&
                                        <h5 className='mt-3 p-3'>No coupons yet</h5>
                                    }

                                    {/* Modal */}
                                    {/* https://getbootstrap.com/docs/5.1/components/modal/ */}
                                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        <i className='fas fa-plus'></i> Create Coupon
                                    </button>

                                    {/* Modal */}
                                    <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalLabel">Create Coupon</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">

                                                    <form onSubmit={handleCreateCoupon}>
                                                        
                                                        <div className="mb-3">
                                                            <label htmlFor="code" className="form-label">Code</label>
                                                            <input type="text" className="form-control" id="code" name='code' value={createCoupon.code} onChange={handleCouponChange} placeholder='Enter coupon code' aria-describedby="emailHelp" />
                                                        </div>

                                                        <div className="mb-3">
                                                            <label htmlFor="discount" className="form-label">Discount</label>
                                                            <input type="text" className="form-control" id="discount" name='discount' value={createCoupon.discount} onChange={handleCouponChange} placeholder='Enter coupon discount' aria-describedby="emailHelp" />
                                                        </div>

                                                        <div className="mb-3 form-check">
                                                            <input checked={createCoupon.active} onChange={handleCouponChange} name='active' type="checkbox" className="form-check-input" id="exampleCheck1" />
                                                                <label className="form-check-label" htmlFor="exampleCheck1">Active</label>
                                                        </div>

                                                        <button type="submit" className="btn btn-primary">Create Coupon</button>
                                                    </form>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Coupon;
