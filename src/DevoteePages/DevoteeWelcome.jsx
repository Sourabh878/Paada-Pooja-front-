import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaUserPlus, FaCalendarCheck, 
    FaSearch, FaTimes, FaArrowRight, FaSpinner 
} from 'react-icons/fa';
import { getToken } from '../utils/auth';
import './Style/DevoteeWelcome.css';

const DevoteeWelcome = () => {
    const navigate = useNavigate();
    
    const [showCheck, setShowCheck] = useState(false);
    const [devStatus, setDevStatus] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [loading, setLoading] = useState(false);

    const [Token_Prefix, setTokenPrefix] = useState("");
    const [showTokenScreen, setShowTokenScreen] = useState(false);

    const [BookingDetails,SetBookDetails] =useState([])

    const [DevoteeDetails, setDevotee] = useState({
        dev_id:"",
        dev_name: "",
        dev_address: "",
        dev_mobile: ""
    });

    const [selectedSevas, setSelectedSevas] = useState([]);

    const sevaList = [
        { id: 1, name: "Paadha Pooja", amount: 2500 },
        { id: 2, name: "Panchamruta", amount: 100 }
    ];

    const handleSevaSelect = (seva) => {
        setSelectedSevas(prev => {
            const exists = prev.find(item => item.id === seva.id);
            return exists
                ? prev.filter(item => item.id !== seva.id)
                : [...prev, seva];
        });
    };

    const totalAmount = selectedSevas.reduce((sum, item) => sum + item.amount, 0);

    const handleCheckRegistration = async (e) => {
        e.preventDefault();
        if (!identifier.trim()) return;

        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/devoteeCheck/devotee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ identifier })
            });

            const data = await res.json();
            
            console.log(data)
            // if (data.success && data.devotee.results.status) {
             if (data.success) {

                setDevotee({
                    dev_id: data.devotee.results.dev_id,
                    dev_name: data.devotee.results.dev_name,
                    dev_address: data.devotee.results.dev_address,
                    dev_mobile: data.devotee.results.dev_mobile
                });

                if(data.alreadyBooked)
                {
                    SetBookDetails(
                        data.booking
)
                }

                setDevStatus(true);
                setShowCheck(false);

            } else {
                alert("No record found.");
                navigate('/devotee/DevoteeMaster');
            }

        } catch (err) {
            console.error("Check Error:", err);
            alert("Unable to verify at the moment.");
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {

        if (!DevoteeDetails.dev_id) {
            alert("Invalid devotee ID");
            return;
        }

        if (selectedSevas.length === 0) {
            alert("Please select at least one seva");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/devoteeCheck/book-seva', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    devotee_id: DevoteeDetails.dev_id,
                    devotee_name: DevoteeDetails.dev_name,
                    devotee_address: DevoteeDetails.dev_address,
                    devotee_mobile: DevoteeDetails.dev_mobile,
                    sevas: selectedSevas
                })
            });

            const data = await response.json();
            console.log(data.data.Token_Prefix);

            if (data.success) {

                if (data.data.Token_Prefix) {
                    setTokenPrefix(data.data.Token_Prefix);
                }

                // Close booking modal
                setDevStatus(false);

                // Show token screen
                setShowTokenScreen(true);

                // Reset seva selection
                setSelectedSevas([]);

            } else {
                alert("Booking failed");
            }

        } catch (error) {
            console.error("Booking Error:", error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="welcome-page-wrapper">
            
            <div className="welcome-main-container">
                <div className="welcome-hero">
                    <h1>Temple Devotee Portal</h1>
                    <p>Experience seamless Seva bookings and digital records.</p>
                </div>

                <div className="welcome-action-grid">
                    
                    <div className="nav-card primary-card" onClick={() => setShowCheck(true)}>
                        <div className="nav-card-inner">
                            <div className="nav-icon-box">
                                <FaCalendarCheck />
                            </div>
                            <div className="nav-text-box">
                                <h3>Already Registered?</h3>
                                <p>Verify your profile to book Poojas and Sevas.</p>
                            </div>
                        </div>
                        <button className="nav-action-button">Book Seva Now</button>
                    </div>

                    <div className="welcome-separator">
                        <span>OR</span>
                    </div>

                    <div className="nav-card secondary-card" onClick={() => navigate('/devotee/DevoteeMaster')}>
                        <div className="nav-card-inner">
                            <div className="nav-icon-box">
                                <FaUserPlus />
                            </div>
                            <div className="nav-text-box">
                                <h3>New Devotee?</h3>
                                <p>Register once to access all temple digital services.</p>
                            </div>
                        </div>
                        <button className="nav-action-button outline">New Registration</button>
                    </div>
                </div>
            </div>

            {/* VERIFY MODAL */}
            {showCheck && (
                <div className="verify-overlay">
                    <div className="verify-modal-content">
                        <div className="modal-header-row">
                            <h3>Verify Identity</h3>
                            <button className="close-modal-btn" onClick={() => setShowCheck(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <p className="modal-subtext">
                            Enter Mobile Number 
                        </p>

                        <form onSubmit={handleCheckRegistration} className="verify-form">
                            <div className="search-field-container">
                                <FaSearch className="field-icon" />
                                <input 
                                    type="text"
                                    placeholder="Enter Mobile "
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="modal-proceed-btn" disabled={loading}>
                                {loading ? <FaSpinner className="spin-loader" /> : <>Verify & Continue <FaArrowRight /></>}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* SEVA MODAL */}
            {devStatus && (
                <div className="verify-overlay">
                    <div className="verify-modal-content">
                        <div className="modal-header-row">
                            <h3>Devotee Details</h3>
                            <button className="close-modal-btn" onClick={() => setDevStatus(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="devotee-details">
                            <p><strong>Name:</strong> {DevoteeDetails.dev_name}</p>
                            <p><strong>Address:</strong> {DevoteeDetails.dev_address}</p>
                            <p><strong>Mobile:</strong> {DevoteeDetails.dev_mobile}</p>
                            {(BookingDetails.length>0) && (
                                <div>
                            <p><strong style={{color:"blue"}}>You Seva Tokens For the day ! </strong></p>
                            <table className='token-table' style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                                <thead>
                                    <tr style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
                                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>Serial No.</th>
                                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>Token</th>
                                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
                                    </tr>
                                </thead>
                            <tbody>
                                {BookingDetails.map((token, index) => (
                                <tr key={token.Token_Prefix}>
                                    {/* Serial number starts from 1 */}
                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{index + 1}</td>
                                    
                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                    <span style={{ color: "red", fontWeight: "bold", fontSize: "18px" }}>
                                        {token.Token_Prefix}
                                    </span>
                                    </td>
                                    
                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                    {token.verify_status === 1 ? (
                                        <span style={{ color: "green" }}>Verified</span>
                                    ) : (
                                        <span style={{ color: "orange" }}>Pending</span>
                                    )}
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                                </div>
                            )}
                        </div>
                        
                        <div>

                        <div className="seva-grid">
                            <div className="seva-grid-header">
                                <span>Select</span>
                                <span>Seva</span>
                                <span>Amount (₹)</span>
                            </div>

                            {sevaList.map(seva => (
                                <div key={seva.id} className="seva-grid-row">
                                    <input
                                        type="checkbox"
                                        checked={selectedSevas.some(item => item.id === seva.id)}
                                        onChange={() => handleSevaSelect(seva)}
                                    />
                                    <span>{seva.name}</span>
                                    <span>₹ {seva.amount}</span>
                                </div>
                            ))}
                        </div>

                        <div className="total-section">
                            <h4>Total Amount: ₹ {totalAmount}</h4>
                        </div>

                        {totalAmount > 0 && (
                            <button className="modal-proceed-btn" onClick={handleBooking}>
                                Confirm Booking <FaArrowRight />
                            </button>
                        )}

                        </div>

                    </div>
                </div>
            )}

            {/* ✅ TOKEN SCREEN */}
            {showTokenScreen && (
                <div className="verify-overlay">
                    <div className="verify-modal-content">

                        <div className="modal-header-row">
                            <h3>Booking Confirmed</h3>
                            <button 
                                className="close-modal-btn"
                                onClick={() => {
                                    setShowTokenScreen(false);
                                    setTokenPrefix("");
                                }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="devotee-details">
                            <p><strong>Name:</strong> {DevoteeDetails.dev_name}</p>
                            <p><strong>Mobile:</strong> {DevoteeDetails.dev_mobile}</p>
                        </div>

                        <div className="token-section" >
                            <h2>Your Token Number</h2>
                            <h2 style={{fontSize:"32px", color:"red" }}>
                                {Token_Prefix}
                            </h2>
                        </div>

                        <button 
                            className="modal-proceed-btn"
                            onClick={() => {
                                setShowTokenScreen(false);
                                setTokenPrefix("");
                            }}
                        >
                            Done <FaArrowRight />
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
};

export default DevoteeWelcome;