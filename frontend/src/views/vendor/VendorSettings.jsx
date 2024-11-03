import React from 'react'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'
import Swal from 'sweetalert2'

function VendorSettings() {
    const [profileData, setProfileData] = useState([])
    const [profileImage, setProfileImage] = useState('')
    const [vendorData, setVendorData] = useState([])
    const [vendorImage, setVendorImage] = useState('')

    const fetchProfileData = () => {
        apiInstance.get(`vendor-settings/${UserData()?.user_id}/`).then((res) => {
            setProfileData(res.data);
            setProfileImage(res.data.image);
        })
    }

    const fetchVendorData = () => {
        try {
          apiInstance.get(`vendor-shop-settings/${UserData()?.vendor_id}/`).then((res) => {
        //   apiInstance.get(`vendor-shop-settings/${UserData()?.user_id}/`).then((res) => {
            setVendorData(res.data)
            setVendorImage(res.data.image);
            // console.log("res.data.image:", res.data.image);
          })
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };

    // const fetchVendorData = async () => {
    //     try {
    //         const res = await apiInstance.get(`vendor-shop-settings/${UserData()?.vendor_id}/`);
    //         setVendorData(res.data);
    //         setVendorImage(res.data.image); // Update image state if needed
    //         console.log('Vendor Image:', res.data.image);
    //     } catch (error) {
    //         console.error('Error fetching vendor data:', error);
    //     }
    // };

    useEffect(() => {
        fetchProfileData();
        fetchVendorData();
    }, [])

    console.log(vendorData);


    const handleInputChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.value
        })
    }

    const handleFileChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.files[0]
        })
    }

    const handleVendorChange = (event) => {
        setVendorData({
            ...vendorData,
            [event.target.name]: event.target.value            
        })
    }

    const handleVendorFileChange = (event) => {
        setVendorData({
            ...vendorData,
            [event.target.name]: event.target.files[0]
        })
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        const formdata = new FormData()
        const res = await apiInstance.get(`vendor-settings/${UserData()?.user_id}/`)
        if (profileData.image && profileData.image !== res.data.image) {
            formdata.append("image", profileData.image)
        }
        formdata.append("full_name", profileData.full_name)
        formdata.append("about", profileData.about)
        formdata.append("phone", profileData?.user?.phone);
        await apiInstance.patch(`vendor-settings/${UserData()?.user_id}/`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        fetchProfileData()
        Swal.fire({
            icon: 'success',
            title: 'Profile Updated Successfully',
        })
    }


    const handleVendorSubmit = async (e) => {
        e.preventDefault()
        const formdata = new FormData()
        const res = await apiInstance.get(`vendor-shop-settings/${UserData()?.vendor_id}/`)
        if (vendorData.image && vendorData.image !== res.data.image) {
            console.log("Appending image:", vendorData.image); 
            formdata.append('image', vendorData.image);
        }
        formdata.append("name", vendorData.name)
        formdata.append("email", vendorData.email)
        formdata.append("mobile", vendorData?.mobile);
        formdata.append("description", vendorData?.description);
        await apiInstance.patch(`vendor-shop-settings/${UserData()?.vendor_id}/`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        fetchVendorData()
        Swal.fire({
            icon: 'success',
            title: 'Shop Updated Successfully',
        })
    }

    // // MODIFIED
    // const handleVendorSubmit = async (e) => {
    //     e.preventDefault();
    //     const formdata = new FormData();
    //     const userId = UserData()?.vendor_id;
        
    //     if (!userId) {
    //         console.error("User ID not found!");
    //         return;
    //     }
        
    //     try {
    //         const res = await apiInstance.get(`vendor-shop-settings/${vendor_id}/`);
            
    //         if (vendorData.image && vendorData.image !== res.data.image) {
    //             console.log("Appending image:", vendorData.image); 
    //             formdata.append('image', vendorData.image);
    //         }
    //         formdata.append("name", vendorData.name);
    //         formdata.append("email", vendorData.email);
    //         formdata.append("mobile", vendorData?.mobile);
    //         formdata.append("description", vendorData?.description);
            
    //         await apiInstance.patch(`vendor-shop-settings/${vendor_id}/`, formdata, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });
            
    //         fetchVendorData();
    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Shop Updated Successfully',
    //         });
    //     } catch (error) {
    //         console.error("Error in handleVendorSubmit:", error);
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Failed to Update Shop',
    //             text: error.response ? error.response.data.detail : 'Unexpected error occurred',
    //         });
    //     }
    // };
    

    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
                {/* Add Sidebar Here */}
                <Sidebar />

                <div className="col-md-9 col-lg-10 main mt-4">
                    <div className="container">
                        <div className="main-body">
                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                        Profile
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">
                                        Shop
                                    </button>
                                </li>
                            </ul>
                            <div className="tab-content" id="pills-tabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="pills-home"
                                    role="tabpanel"
                                    aria-labelledby="pills-home-tab"
                                >
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <div className="col-md-4 mb-3">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <div className="d-flex flex-column align-items-center text-center">
                                                        <img
                                                            src={profileImage}
                                                            style={{ width: 160, height: 160, objectFit: "cover" }}
                                                            alt="Admin"
                                                            className="rounded-circle"
                                                            width={150}
                                                        />
                                                        <div className="mt-3">
                                                            <h4 className="text-dark">{profileData?.full_name}</h4>
                                                            <p className="text-secondary mb-1">{profileData?.about}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <form
                                                        className="form-group"
                                                        method="POST"
                                                        noValidate=""
                                                        encType="multipart/form-data"
                                                        onSubmit={handleProfileSubmit}
                                                    >
                                                        <div className="row text-dark">
                                                            <div className="col-lg-6 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Profile Image
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    className="form-control"
                                                                    name="image"
                                                                    id=""
                                                                    onChange={handleFileChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Full Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id=""
                                                                    value={profileData?.full_name}
                                                                    onChange={handleInputChange}
                                                                    name="full_name"
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Email
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name=""
                                                                    id=""
                                                                    value={profileData?.user?.email}
                                                                    readOnly
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Phone Number
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id=""
                                                                    value={profileData?.user?.phone}
                                                                    onChange={handleInputChange}
                                                                    name="phone"
                                                                    readOnly
                                                                />
                                                            </div>
                                                            <div className="col-lg-12 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    About Me
                                                                </label>
                                                                <textarea
                                                                    className='form-control'
                                                                    value={profileData?.about}
                                                                    id=""
                                                                    cols="30"
                                                                    rows="10"
                                                                    onChange={handleInputChange}
                                                                    name="about"
                                                                >

                                                                </textarea>
                                                            </div>
                                                            <div className="col-lg-6 mt-4 mb-3">
                                                                <button className="btn btn-success" type="submit">
                                                                    Update Profile <i className="fas fa-check-circle" />{" "}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="pills-profile"
                                    role="tabpanel"
                                    aria-labelledby="pills-profile-tab"
                                >
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <div className="col-md-4 mb-3">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <div className="d-flex flex-column align-items-center text-center">
                                                        <img
                                                            src={vendorImage}
                                                            // src={vendorData.image}
                                                            style={{ width: 160, height: 160, objectFit: "cover" }}
                                                            alt="Admin"
                                                            className="rounded-circle"
                                                            width={150}
                                                        />
                                                        <div className="mt-3">
                                                            <h4 className="text-dark">{vendorData.name}</h4>
                                                            <p className="text-secondary mb-1">{vendorData.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <form
                                                        className="form-group"
                                                        method="POST"
                                                        noValidate=""
                                                        encType="multipart/form-data"
                                                        onSubmit={handleVendorSubmit}
                                                    >
                                                        <div className="row text-dark">
                                                            <div className="col-lg-12 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Shop Image
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    className="form-control"
                                                                    name="image"
                                                                    id=""
                                                                    onChange={handleVendorFileChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-12 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Shop Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="name"
                                                                    id=""
                                                                    value={vendorData.name}
                                                                    onChange={handleVendorChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Shop Email
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="email"
                                                                    id=""
                                                                    value={vendorData.email}
                                                                    onChange={handleVendorChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Shop Phone Number
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="mobile"
                                                                    id=""
                                                                    value={vendorData.mobile}
                                                                    onChange={handleVendorChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-12 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Shop Description
                                                                </label>
                                                                <textarea
                                                                    cols='30'
                                                                    rows='10'
                                                                    className="form-control"
                                                                    name="description"
                                                                    id=""
                                                                    value={vendorData.description}
                                                                    onChange={handleVendorChange}
                                                                ></textarea>
                                                            </div>
                                                            <div className="col-lg-6 mt-4 mb-3">
                                                                <button className="btn btn-success me-3" type="submit">
                                                                    Update Shop <i className="fas fa-check-circle" />{" "}
                                                                </button>
                                                                <Link to={`/vendor/${vendorData.slug}/`} className="btn btn-primary" type="submit">
                                                                    View Shop <i className="fas fa-shop" />{" "}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VendorSettings