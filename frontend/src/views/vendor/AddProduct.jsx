import React from 'react'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import { Link, useParams } from 'react-router-dom'
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

    const [specifications, setSpecifications] = useState([{title: '', content:''}])
    const [colors, setColors] = useState([{name: '', color_code: ''}])
    const [sizes, setSizes] = useState([{name: '', price: ''}])
    const [gallery, setGallery] = useState([{image: ''}])
    const [category, setCategory] = useState([])

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
                setStateFunction((prevState) =>{
                    const newState = [...prevState]
                    newState[index].image = {file, preview: reader.result}
                    return newState
                } )
            }
            reader.readAsDataURL(file)
        } else {
            setStateFunction((prevState) =>{
                const newState = [...prevState]
                newState[index].image = null
                newState[index].preview = null
                return newState
            })
        }
    }

  return (
    <div>AddProduct</div>
  )
}

export default AddProduct