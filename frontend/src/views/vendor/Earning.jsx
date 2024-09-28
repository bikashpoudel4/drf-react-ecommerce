import React from 'react'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react'
import apiInstance from '../../utils/axios'
import UserData from '../plugin/UserData'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'

import { Chart } from 'chart.js/auto'
import {Line, Bar} from 'react-chartjs-2'

function Earning() {
    const [earningStats, setEarningStats] = useState({})
    const [earningStatsTracker, setEarningStatsTracker] = useState([])
    const [earningChart, setEarningChart] = useState([])


    useEffect(() => {
        apiInstance.get(`vendor-earning/${UserData()?.vendor_id}/`).then((res) => {
            setEarningStats(res.data[0])
        })

        apiInstance.get(`vendor-monthly-earning/${UserData()?.vendor_id}/`).then((res) => {
            setEarningStatsTracker(res.data)
            setEarningChart(res.data)
        })
    }, [])

    const months = earningChart?.map(item => item.month)
    const revenue = earningChart?.map(item => item.total_earning)

    const revenue_data = {
        labels: months,
        datasets: [
            {
            label: "Total Sales Revenue",
            data: revenue,
            fill: true,
            backgroundColor: 'green',
            borderColor: 'green'
            }
        ]
    }

    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
                {/* Add Sidebar Here */}
                < Sidebar />

                <div className="col-md-9 col-lg-10 main mt-4">
                    <div className="row mb-3">
                        <div className="col-xl-6 col-lg-6 mb-2">
                            <div className="card card-inverse card-success">
                                <div className="card-block bg-success p-3">
                                    <div className="rotate">
                                        <i className="bi bi-currency-dollar fa-5x" />
                                    </div>
                                    <h6 className="text-uppercase">Total Sales</h6>
                                    <h1 className="display-1">${earningStats.total_revenue}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 mb-2">
                            <div className="card card-inverse card-danger">
                                <div className="card-block bg-danger p-3">
                                    <div className="rotate">
                                        <i className="bi bi-currency-dollar fa-5x" />
                                    </div>
                                    <h6 className="text-uppercase">Monthly Earning</h6>
                                    <h1 className="display-1">${earningStats.monthly_revenue}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="row  container">
                        <div className="col-lg-12">
                            <h4 className="mt-3 mb-4">Revenue Tracker</h4>
                            <table className="table">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">Month</th>
                                        <th scope="col">Orders</th>
                                        <th scope="col">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {earningStatsTracker?.map((earning, index) => (
                                        <tr key={index}>
                                            {earning.month == 1 && <th scope="row">January </th>}
                                            {earning.month == 2 && <th scope="row">February </th>}
                                            {earning.month == 3 && <th scope="row">March </th>}
                                            {earning.month == 4 && <th scope="row">April </th>}
                                            {earning.month == 5 && <th scope="row">May </th>}
                                            {earning.month == 6 && <th scope="row">June </th>}
                                            {earning.month == 7 && <th scope="row">July </th>}
                                            {earning.month == 8 && <th scope="row">August </th>}
                                            {earning.month == 9 && <th scope="row">September </th>}
                                            {earning.month == 10 && <th scope="row">October </th>}
                                            {earning.month == 11 && <th scope="row">November </th>}
                                            {earning.month == 12 && <th scope="row">December </th>}
                                            <td>{earning.sales_count}</td>
                                            <td>${earning.total_earning.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="container">
                            <div className="row ">
                                <div className="col">
                                    <h4 className="mt-4">Revenue Analytics</h4>
                                </div>
                            </div>
                            <div className="row my-2">
                                <div className="col-md-12 py-1">
                                    <div className="card">
                                        <div className="card-body">
                                            {/* <canvas id="line-chart" /> */}
                                            {/* <Bar data={revenue_data} style={{height:300}} /> */}
                                            <Line data={revenue_data} options={{ maintainAspectRatio: false }} style={{height:300}} />
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

export default Earning