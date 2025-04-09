import React from 'react'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import { Link, useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'
import Swal from 'sweetalert2'

function AddProduct() {
    const userData = UserData()

    const [product, setProduct] = useState({
        title: '',
        image: null,
        description: '',
        category: '',
        price: '',
        old_price: '',
        shipping_amount: '',
        stock_qty: '',
        vendor: userData?.vendor_id,
    })

    const [specifications, setSpecifications] = useState([{ title: '', content: '' }])
    const [colors, setColors] = useState([{ name: '', color_code: '' }])
    const [sizes, setSizes] = useState([{ name: '', price: '' }])
    const [gallery, setGallery] = useState([{ image: '' }])
    const [category, setCategory] = useState([])

    const navigate = useNavigate()

    const handleAddMore = (setStateFunction) => {
        setStateFunction((prevState) => [...prevState, {}])
    }

    const handleRemove = (index, setStateFunction) => {
        setStateFunction((prevState) => {
            const newState = [...prevState]
            newState.splice(index, 1)
            return newState
        })
    }

    const handleInputChange = (index, field, value, setStateFunction) => {
        setStateFunction((prevState) => {
            const newState = [...prevState]
            newState[index][field] = value

            return newState
        })
    }

    const handleImageChange = (index, event, setStateFunction) => {
        const file = event.target.files[0]

        if (file) {
            const reader = new FileReader()

            reader.onloadend = () => {
                setStateFunction((prevState) => {
                    const newState = [...prevState]
                    newState[index].image = { file, preview: reader.result }
                    return newState
                })
            }
            reader.readAsDataURL(file)
        } else {
            setStateFunction((prevState) => {
                const newState = [...prevState]
                newState[index].image = null
                newState[index].preview = null
                return newState
            })
        }
    }

    const handleProductInputChange = (event) => {
        setProduct({
            ...product,
            [event.target.name]: event.target.value
        })

        console.log(product);

    }

    const handleProductFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()

            reader.onloadend = () => {
                setProduct({
                    ...product,
                    image: {
                        file: event.target.files[0],
                        preview: reader.result
                    }
                })
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        apiInstance.get('category/').then((res) => {
            setCategory(res.data);
        })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formdata = new FormData()
        Object.entries(product).forEach(([key, value]) => {
            if (key === 'image' && value){
                formdata.append(key, value.file)
            } else {
                formdata.append(key, value)
            }
        })

        specifications.forEach((specification, index) => {
            Object.entries(specification).forEach(([key, value]) => {
                formdata.append(`specifications[${index}][${key}]`, value)
            })
        })

        colors.forEach((color, index) => {
            Object.entries(color).forEach(([key, value]) => {
                formdata.append(`colors[${index}][${key}]`, value)
            })
        })

        sizes.forEach((size, index) => {
            Object.entries(size).forEach(([key, value]) => {
                formdata.append(`sizes[${index}][${key}]`, value)
            })
        })

        gallery.forEach((item, index) => {
            if(item.image) {
                formdata.append(`gallery[${index}][image]`, item.image.file)
            }
        })

        const response = await apiInstance.post(`vendor-create-product/`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        Swal.fire({
            icon: "success",
            title: "Product Created Successfully.",
            timer: 1500
        })

        
        navigate('/vendor/products/')

    }

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    
    //     const formdata = new FormData();
    
    //     // Append product fields
    //     Object.entries(product).forEach(([key, value]) => {
    //         if (key === 'image' && value) {
    //             formdata.append(key, value.file);
    //         } else {
    //             formdata.append(key, value);
    //         }
    //     });
    
    //     // Append specifications
    //     specifications.forEach((specification, index) => {
    //         Object.entries(specification).forEach(([key, value]) => {
    //             if (value) {
    //                 formdata.append(`specifications[${index}][${key}]`, value);
    //             }
    //         });
    //     });
    
    //     // Append colors
    //     colors.forEach((color, index) => {
    //         Object.entries(color).forEach(([key, value]) => {
    //             if (value) {
    //                 formdata.append(`colors[${index}][${key}]`, value);
    //             }
    //         });
    //     });
    
    //     // Append sizes
    //     sizes.forEach((size, index) => {
    //         Object.entries(size).forEach(([key, value]) => {
    //             if (value) {
    //                 formdata.append(`sizes[${index}][${key}]`, value);
    //             }
    //         });
    //     });
    
    //     // Append gallery images
    //     gallery.forEach((item, index) => {
    //         if (item.image) {
    //             formdata.append(`gallery[${index}][image]`, item.image.file);
    //         }
    //     });
    
    //     try {
    //         const response = await apiInstance.post(`vendor-create-product/`, formdata, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });
    //         console.log('Product created successfully:', response.data);
    //     } catch (error) {
    //         console.error('Error creating product:', error.response?.data || error.message);
    //     }
    // };
    

    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
                {/* Sidebar Here */}
                <Sidebar />

                <div className="col-md-9 col-lg-10 main mt-4">
                    <div className="container">
                        <form onSubmit={handleSubmit} className="main-body">
                            <div className="tab-content" id="pills-tabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="pills-home"
                                    role="tabpanel"
                                    aria-labelledby="pills-home-tab"
                                >
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <h4 className="mb-4">Product Details</h4>
                                        <div className="col-md-12">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    {/* <form
                                                        className="form-group"
                                                        method="POST"
                                                        noValidate=""
                                                        encType="multipart/form-data"
                                                    > */}
                                                        <div className="row text-dark">
                                                            <div className="col-lg-6 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Product Thumbnail
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    className="form-control"
                                                                    name="image"
                                                                    onChange={handleProductFileChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Title
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="title"
                                                                    value={product.title || ''}
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-12 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Description
                                                                </label>
                                                                <textarea
                                                                    className="form-control"
                                                                    id=""
                                                                    cols={30}
                                                                    rows={10}
                                                                    type="text"
                                                                    name="description"
                                                                    value={product.description || ''}
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                            {/* Category */}
                                                            <div className="col-lg-12 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Category
                                                                </label>
                                                                <select
                                                                    className="select form-control"
                                                                    id=""
                                                                    name="category"
                                                                    value={product.category || ''}
                                                                    onChange={handleProductInputChange}
                                                                >
                                                                    <option value="">- Select -</option>
                                                                    {category?.map((c, index) => (

                                                                        <option value={c.id} key={index}>{c.title}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            {/* Category */}

                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Sale Price
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="price"
                                                                    value={product.price || ''}
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Regular Price
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="old_price"
                                                                    value={product.old_price || ''}
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Shipping Amount
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="shipping_amount"
                                                                    value={product.shipping_amount || ''}
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Stock Qty
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="stock_qty"
                                                                    value={product.stock_qty || ''}
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    {/* </form> */}
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
                                        <h4 className="mb-4">Product Image</h4>
                                        <div className="col-md-12">
                                            <div className="card mb-3">
                                                <div className="card-body">

                                                    {gallery.map((item, index) => (
                                                        <div className="row text-dark" key={index}>
                                                            <div className="col-lg-6 mb-2">
                                                                {item.image && (
                                                                    <img
                                                                        style={{
                                                                            width: "100%", height: "200px", objectFit: "cover",
                                                                            borderRadius: "10px"
                                                                        }}
                                                                        src={item.image.preview}
                                                                        alt=""
                                                                    />
                                                                )}

                                                                {!item.image && (
                                                                    <img
                                                                        style={{
                                                                            width: "100%", height: "200px", objectFit: "cover",
                                                                            borderRadius: "10px"
                                                                        }}
                                                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARIAAAC4CAMAAAAYGZMtAAAANlBMVEXp7vG6vsHIzM/m6+7M0NO/w8bCxsnR1di7v8Li5+rDyMvl6u3h5unAxMfLz9K3u77Y3eDW2t13gQCUAAADH0lEQVR4nO3c7ZKaMBhAYTEGAwHi3v/NdhGqkBBXJYzm5Tz/OtMyeBogfB4OAAAAAAAAAAAAAAAAAAAAAAAAAL5A89MdUzs3n/5VK9jOFOm5os42StNuEOTKXD79296jdNEPktQDZVhenuPk5NL3uNGf/nXvUFvVuGZ2OW46Fzf8dyY+3nTlEKb79O97w/maxFTJF1xfk5TJl7u9IUm9wYIzT7LBmm+24M2RJECSAEkC4Zqry1EbXZ5XHoQEJfnRw4zCFZ1NuuBs+Gveudv80+k1pyhikpzuRfo57YqNR0qSy6zIqimckCSq9E/e3j9tE5JkNkjMumEiJMnJHyRFoZIsOCuzNa+DIu7hQaeq48fpfSZptGujTXaZpOkndWWsiZAk3Sv7kuHKvqsjcxchSbxpiXn0k6px4l+Uy02EJLG68PzE/l11/6vL+1ghScY/3UVvOsziLe5PpCQ51PMmsZ2rnd/5aRf2OGKSqEkTF72BWfkbmA6biEkymcG6MjZGfucj/j4nHCeCkhyaU2mM0cdL7Pi7dF/dBfsTSUl+t56qaeIz9b7Iwk1k/7gjK8lDVRtsNYvjZD9JwqlLZJzsJkm8SD/Vne599pLE6kfPorjpcWcnSYL5iG8yP5GZxHondNXfT7Xdx4nIJLac38h5okhxv6YkMYktXTFt8kyRybFYYJLhBsb95tZzRfprSurxgr9ebM3VWOB/kwfzEc/4kJe8JLebXEOT54tITaJaN84/zHV/0hd59uFYmUnsbYyY6zh5YYwITWK9mxf6pafsJSbxi7xIYBJbB2f/Lz1jLy+JWjdGJCZZ/XaOuCTl8jWz/SYJH0PaexK7foxIS3JMUERYkgSbjbQka4+/JCEJSUjSI0mPJAEOwoH5VE0n0IpKopJYWHBWeN0xQJLAZu/BZ5yEUeLrR4lZ9V5jxHGr4be58U2C9pTYOOvL8fslKsVVo6gsv3Kz9A5OOll+C+mgNvs2VLHmndqPasxW246Lvs3z7ezRbRDFxV9LyEFzTvzBrF+nTDcaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC+zj/F2S2b1UhTuQAAAABJRU5ErkJggg=="
                                                                        alt="default picture"
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <label htmlFor="" className="">Product Image</label>
                                                                <input
                                                                    type="file"
                                                                    className="form-control"
                                                                    onChange={(e) => handleImageChange(index, e, setGallery)}
                                                                />
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <button onClick={() => handleRemove(index, setGallery)} className='btn btn-danger mt-4'>Remove</button>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {gallery < 1 &&
                                                        <h4>No Images Selected</h4>
                                                    }

                                                    <button onClick={() => handleAddMore(setGallery)} className="btn btn-primary mt-5">
                                                        <i className="fas fa-plus" /> Add Image
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="pills-contact"
                                    role="tabpanel"
                                    aria-labelledby="pills-contact-tab"
                                >
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <h4 className="mb-4">Specifications</h4>
                                        <div className="col-md-12">
                                            <div className="card mb-3">
                                                <div className="card-body">

                                                    {specifications.map((specification, index) => (
                                                        <div key={index} className="row text-dark">
                                                            <div className="col-lg-5">
                                                                <label htmlFor="" className="">
                                                                    Title
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={specification.title || ''}
                                                                    onChange={(e) => handleInputChange(index, 'title', e.target.value, setSpecifications)}
                                                                />
                                                            </div>
                                                            <div className="col-lg-5">
                                                                <label htmlFor="" className="">
                                                                    Content
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={specification.content || ''}
                                                                    onChange={(e) => handleInputChange(index, 'content', e.target.value, setSpecifications)}
                                                                />
                                                            </div>
                                                            <div className="col-lg-2 mb-2">
                                                                <button onClick={() => handleRemove(index, setSpecifications)} className='btn btn-danger mt-4'>Remove</button>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {specifications < 1 && (
                                                        <h4>No Specifications selected</h4>
                                                    )}

                                                    <button onClick={() => handleAddMore(setSpecifications)} className="btn btn-primary mt-5">
                                                        <i className="fas fa-plus" /> Add Specifications
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="tab-pane fade"
                                    id="pills-size"
                                    role="tabpanel"
                                    aria-labelledby="pills-size-tab"
                                >
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <h4 className="mb-4">Size</h4>
                                        <div className="col-md-12">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    {sizes.map((s, index) => (
                                                        <div key={index} className="row text-dark">
                                                            <div className="col-lg-5">
                                                                <label htmlFor="" className="">
                                                                    Title
                                                                </label>
                                                                <input value={s.title || ''} onChange={(e) => handleInputChange(index, 'title', e.target.value, setSizes)} type="text" className="form-control" name="" id="" />
                                                            </div>
                                                            <div className="col-lg-5">
                                                                <label htmlFor="" className="">
                                                                    Price
                                                                </label>
                                                                <input value={s.price || ''} onChange={(e) => handleInputChange(index, 'price', e.target.value, setSizes)} type="text" className="form-control" name="" id="" />
                                                            </div>
                                                            <div className="col-lg-2">
                                                                <button onClick={() => handleRemove(index, setSizes)} className='btn btn-danger mt-4'>Remove</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {sizes < 1 && (
                                                        <h4>No Sizes Selected</h4>
                                                    )}

                                                    <button onClick={() => handleAddMore(setSizes)} className="btn btn-primary mt-5">
                                                        <i className="fas fa-plus" /> Add Size
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="pills-color"
                                    role="tabpanel"
                                    aria-labelledby="pills-color-tab"
                                >
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <h4 className="mb-4">Color</h4>
                                        <div className="col-md-12">
                                            <div className="card mb-3">
                                                <div className="card-body">

                                                    {colors.map((c, index) => (

                                                        <div key={index} className="row text-dark">
                                                            <div className="col-lg-5">
                                                                <label htmlFor="" className="">
                                                                    Name
                                                                </label>
                                                                <input
                                                                    value={c.name || ''}
                                                                    type="text"
                                                                    className="form-control"
                                                                    name=""
                                                                    placeholder="Green"
                                                                    id=""
                                                                    onChange={(e) => handleInputChange(index, 'name', e.target.value, setColors)}
                                                                />
                                                            </div>
                                                            <div className="col-lg-5">
                                                                <label htmlFor="" className="">
                                                                    Code
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="#f4f7f6"
                                                                    className="form-control"
                                                                    name=""
                                                                    id=""
                                                                    value={c.color_code || ''}
                                                                    onChange={(e) => handleInputChange(index, 'color_code', e.target.value, setColors)}
                                                                />
                                                            </div>
                                                            <div className="col-lg-2">
                                                                <button onClick={() => handleRemove(index, setColors)} className='btn btn-danger mt-4'>Remove</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {colors < 1 && (
                                                        <h4>No Colors Selected</h4>
                                                    )}

                                                    <button onClick={() => handleAddMore(setColors)} className="btn btn-primary mt-5">
                                                        <i className="fas fa-plus" /> Add Color
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <ul
                                        className="nav nav-pills mb-3 d-flex justify-content-center mt-5"
                                        id="pills-tab"
                                        role="tablist"
                                    >
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link active"
                                                id="pills-home-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-home"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-home"
                                                aria-selected="true"
                                            >
                                                Basic Information
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                id="pills-profile-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-profile"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-profile"
                                                aria-selected="false"
                                            >
                                                Gallery
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                id="pills-contact-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-contact"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-contact"
                                                aria-selected="false"
                                            >
                                                Specifications
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                id="pills-size-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-size"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-size"
                                                aria-selected="false"
                                            >
                                                Size
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                id="pills-color-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-color"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-color"
                                                aria-selected="false"
                                            >
                                                Color
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="d-flex justify-content-center mb-5">
                                        <button className="btn btn-success w-50" type='submit'>
                                            Create Product <i className="fa fa-check-circle" />{" "}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AddProduct