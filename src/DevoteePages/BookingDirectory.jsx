import React, { useEffect, useState } from 'react';
import './Style/BookingDirectory.css';

const BookingDirectory = () => {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState(null); // State for the count bar
    const [amounts, setAmounts] = useState({
        donation: '',
        GD: '',
        BD: '',
        status: ''
    });

    // New Filter and Search States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    const fetchBookings = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/devoteeCheck`);
            const data = await res.json();
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    // New function to fetch seva counts
    const fetchStats = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/devoteeCheck/counts`); // Update with your actual count API endpoint
            const json = await res.json();
            if (json.success) {
                setStats(json.data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    useEffect(() => {
        fetchBookings();
        fetchStats();
    }, []);

    

    const handleStatusChange = async (name,id, newStatus) => {
        if(!confirm(`Do You Want to confirm Payment Status of ${name}`))
        {
            return;
        }
        try {
            
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/devoteeCheck/update-status/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ verify_status: newStatus })
            });

            if (res.ok) {
                fetchBookings();
                fetchStats(); // Update counts when status changes
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };
    

const formatDate=(date)=>{

const formattedDate = new Date(date).toLocaleDateString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit'
});

return formattedDate;
}

const generateReceipt = (data, total) => {

    const printWindow = window.open('', '_blank');

    printWindow.document.write(`

        <html>

            <head>

                <title>Receipt - ${data.Token_Prefix}</title>

                <style>

                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

                   

                    body {

                        font-family: 'Poppins', 'Arial', sans-serif;

                        padding: 40px;

                        background-color: #f5f5f5;

                        display: flex;

                        justify-content: center;

                    }



                    .receipt-box {

                        background-color: white;

                        border: 3px double #d84315; /* Deep Saffron/Orange */

                        padding: 30px;

                        width: 450px;

                        box-shadow: 0 0 10px rgba(0,0,0,0.1);

                        position: relative;

                    }



                    h2 {

                        margin: 0;

                        color: #bf360c;

                        font-size: 24px;

                        text-transform: uppercase;

                        letter-spacing: 1px;

                    }



                    .sub-header {

                        font-size: 12px;

                        color: #666;

                        margin-bottom: 15px;

                    }



                    .token-header {

                        font-size: 32px;

                        font-weight: 800;

                        color: #e65100;

                        margin: 15px 0;

                        padding: 5px;

                        border-top: 1px dashed #ccc;

                        border-bottom: 1px dashed #ccc;

                    }



                    .details { text-align: left; margin-top: 25px; }

                   

                    .row {

                        display: flex;

                        justify-content: space-between;

                        margin: 8px 0;

                        font-size: 14px;

                        color: #333;

                    }



                    .row span:first-child { color: #777; font-weight: 500; }

                    .row span:last-child { font-weight: 600; }



                    .seva-section {

                        margin: 15px 0;

                        padding: 10px 0;

                        border-top: 1px solid #eee;

                    }



                    .total-row {

                        display: flex;

                        justify-content: space-between;

                        margin-top: 20px;

                        padding: 12px;

                        background-color: #fff3e0; /* Light orange background */

                        border-radius: 5px;

                        border: 1px solid #ffcc80;

                    }



                    .total-label { font-weight: 700; font-size: 16px; color: #bf360c; }

                    .total-amount { font-weight: 800; font-size: 18px; color: #bf360c; }



                    .footer-note {

                        font-size: 10px;

                        color: #999;

                        margin-top: 30px;

                        font-style: italic;

                    }



                    .print-btn-container {

                        margin-top: 30px;

                        text-align: center;

                    }



                    button {

                        background-color: #e65100;

                        color: white;

                        border: none;

                        padding: 10px 25px;

                        border-radius: 5px;

                        cursor: pointer;

                        font-weight: 600;

                        font-size: 15px;

                    }



                    button:hover { background-color: #bf360c; }



                    @media print {

                        .no-print { display: none; }

                        body { background-color: white; padding: 0; }

                        .receipt-box { box-shadow: none; border: 2px solid #333; }

                    }

                </style>

            </head>

            <body>

                <div style="display: flex; flex-direction: column; align-items: center;">

                    <div class="receipt-box">

                        <h2>🛕 SHREE SEVA MANDIR</h2>

                        <div class="sub-header">Dharmic Seva Receipt</div>

                       

                        <div class="token-header">${data.Token_Prefix}</div>
                        

                        <div class="details">

                            <div class="row"><span>Devotee:</span> <span>${data.devotee_name}</span></div>

                            <div class="row"><span>Mobile:</span> <span>+91 ${data.devotee_mobile}</span></div>

                            <div class="row"><span>Seva Date:</span> <span>${formatDate(data.seva_date)}</span></div>

                           

                            <div class="seva-section">

                                ${ data.GD==0 &&data.seva_1 ? `<div class="row"><span>${data.seva_1}</span> <span>₹${data.seva_1_amount}</span></div>` : ''}

                                ${data.GD==0 && data.seva_2 ? `<div class="row"><span>${data.seva_2}</span> <span>₹${data.seva_2_amount}</span></div>` : 
                                ''}
                                ${data.GD > 0 ? `<div class="row"><span>Guru Dakshina:</span> <span>₹${data.GD}</span></div>` : ''}

${data.BD > 0 ? `<div class="row"><span>Vaidic Dakshina:</span> <span>₹${data.BD}</span></div>` : ''}

${data.donation > 0 ? `<div class="row"><span>Donation:</span> <span>₹${data.donation}</span></div>` : ''}



                            </div>



                            <div class="total-row">

                                <span class="total-label">TOTAL AMOUNT </span>

                                <span class="total-amount">₹${total?total:data.total_amount}</span>

                            </div>

                        </div>



                        <div class="footer-note">

                            Receipt Generated on ${new Date().toLocaleString()}<br>

                            Thank you for your contribution.

                        </div>

                    </div>



                    <div class="no-print print-btn-container">

                        <button onclick="window.print()">Print Receipt</button>

                    </div>

                </div>

            </body>

        </html>

    `);

    printWindow.document.close();

};



    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch = 
            booking.Token_Prefix?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.devotee_mobile?.includes(searchTerm);

        const bookingDate = new Date(booking.seva_date).toLocaleDateString('en-CA');
        const todayStr = new Date().toLocaleDateString('en-CA');

        let matchesFilter = true;
        if (filterType === 'PENDING') {
            matchesFilter = booking.verify_status === 0 || !booking.verify_status;
        } else if (filterType === 'TODAY') {
            matchesFilter = bookingDate === todayStr;
        }
        else if(filterType === 'PENDING-SEVA'){
                        matchesFilter = booking.status === 0 || !booking.status;

        }

        return matchesSearch && matchesFilter;
    });

    const currentTotal = Number(amounts.BD || 0) + Number(amounts.GD || 0) + Number(amounts.donation || 0);

    return (
        <div className="booking-page">
            <h2 className="booking-title">🛕 Seva Booking Directory</h2>

            {/* --- Count Bar (Stats Component) --- */}
            {stats && (
                <div className="stats-container">
                    <div className="stat-card">
                        <h4>Total Sevas</h4>
                        <p className="stat-numbers">{stats.Finished_Sevas} / {stats.Total_Sevas}</p>
                        <small>Finished / Total</small>
                    </div>
                    <div className="stat-card">
                        <h4>Paadha Pooja</h4>
                        <p className="stat-numbers">{stats.Paadha_Pooja.Finished} / {stats.Paadha_Pooja.Total}</p>
                        <small>Finished / Total</small>
                    </div>
                    <div className="stat-card">
                        <h4>Panchamruta</h4>
                        <p className="stat-numbers">{stats.Panchamruta.Finished} / {stats.Panchamruta.Total}</p>
                        <small>Finished / Total</small>
                    </div>
                </div>
            )}

            {/* --- Search and Filter Bar --- */}
            <div className="directory-controls">
                <input 
                    type="text" 
                    className="search-input"
                    placeholder="Search Token or Mobile..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    className="filter-select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="ALL">All Bookings</option>
                    <option value="TODAY">Today's Bookings</option>
                    <option value="PENDING">Payment Pending Status</option>
                    <option value="PENDING-SEVA">Seva Pending Status</option>
                </select>
            </div>

            {filteredBookings.length === 0 ? (
                <p className="no-data">No bookings match your criteria</p>
            ) : (
                <div className="booking-table">
                    <div className="booking-row header">
                        <div>Token</div>
                        <div>Devotee Details</div>
                        <div>Payment Status</div>
                        <div>Sevas</div>
                        <div>Total</div>
                        <div>Action</div>
                    </div>

                    {filteredBookings.map((booking) => (
                        <div key={booking.id} className="booking-row">
                            <div className="token-col">{booking.Token_Prefix}</div>
                            <div className="devotee-col">
                                <strong>{booking.devotee_name}</strong><br />
                                {booking.devotee_address}
                            </div>
                             <div className="status-col">
                                <div className="status-row">
                                <label className="status-label">
                                    <input 
                                        type="radio" 
                                        name={`status-${booking.id}`} 
                                        checked={booking.verify_status === 1} 
                                        onChange={() => handleStatusChange(booking.devotee_name,booking.id, 1)}
                                    /> Verified
                                </label>
                                {booking.verify_status === 1 && (
                                    <button
                                        className="mini-receipt-btn"
                                        onClick={() => generateReceipt(booking, currentTotal)}
                                    >
                                        Receipt
                                    </button>
                                )}
                                </div>
                                
    
                            </div>
                            
                            <div className="seva-col">

                                {booking.seva_1 && (
                                    <div className={`seva-item ${booking.status_2 ? "done" : ""}`}>
                                        <span>{booking.seva_1} - ₹{booking.seva_1_amount}</span>
                                    </div>
                                )}

                                {booking.seva_2 && (
                                    <div className={`seva-item ${booking.status_2 ? "done" : ""}`}>
                                        <span>{booking.seva_2} - ₹{booking.seva_2_amount}</span>
                                    </div>
                                )}

    </div>
                            <div className="total-col">₹ {booking.total_amount}</div>
                            
                           

                           {
                            (
                                booking.Token_Prefix.substr(3).includes('B') &&
                                booking.status_1 == 1 &&
                                booking.status_2 == 1 &&
                                booking.status == 1
                            ) ||
                            (
                                !booking.Token_Prefix.substr(3).includes('B') && 
                                booking.status==1
                            )
                            ? (
                                <div className='delete-btn' style={{background:"#079110ff"}}>
                                    Performed
                                </div>
                            )
                            : null
                        }


                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default BookingDirectory;