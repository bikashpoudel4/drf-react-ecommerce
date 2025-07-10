import React from 'react'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import { Link, useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'
import Swal from 'sweetalert2'

function UpdateProduct() {
    const userData = UserData()
    const param = useParams()
    
    const [product, setProduct] = useState([])
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
    

  return (
    <div>UpdateProduct</div>
  )
}

export default UpdateProduct