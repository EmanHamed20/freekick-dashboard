import React from 'react';
import RevenueOverviewChart from "../../components/Charts/RevenueOverviewChart.jsx";
import BookingPerVenues from "../../components/Charts/BookingPerVenues.jsx";

function Reports(props) {
    return (
        <div className={'grid grid-cols-2 gap-5'}>
        <RevenueOverviewChart/>
            <BookingPerVenues/>
        </div>
    );
}

export default Reports;