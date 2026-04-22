import React, { useState, useEffect } from "react";
import {
  FaFileExcel,
  FaChartLine,
  FaDownload,
  FaFilter,
  FaOm,
  FaCalendarAlt,
  FaTable,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { getToken } from "../../utils/auth";
import "../Style/SevaFinance.css";
// import AdminNavbar from '../../components/Navbar/AdminNavbar';

const SevaFinance = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    from: new Date().toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const fetchSummaryData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/bookings/summary?fromDate=${dateFilter.from}&toDate=${dateFilter.to}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      const data = await res.json();
      setReportData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Finance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    if (reportData.length === 0) return alert("No data to export");

    const worksheetData = reportData.map((item) => ({
      "Seva Name": item.seva_name,
      "Total Quantity": parseInt(item.total_quantity),
      "Total Revenue (₹)": parseFloat(item.total_amount).toFixed(2),
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SevaSummary");
    XLSX.writeFile(
      wb,
      `Seva_Finance_${dateFilter.from}_to_${dateFilter.to}.xlsx`,
    );
  };

  const grandTotal = reportData.reduce(
    (sum, item) => sum + parseFloat(item.total_amount || 0),
    0,
  );
  const totalQty = reportData.reduce(
    (sum, item) => sum + parseInt(item.total_quantity || 0),
    0,
  );

  return (
    <>
      {/* <AdminNavbar /> */}
      <div className="finance-summary-page">
        <header className="finance-header">
          <FaOm className="om-icon" />
          <h1>Seva Financial Summary</h1>
        </header>

        {/* Filter Section */}
        <section className="report-controls">
          <div className="filter-card">
            <div className="date-inputs">
              <div className="input-field">
                <label>
                  <FaCalendarAlt /> From Date
                </label>
                <input
                  type="date"
                  value={dateFilter.from}
                  onChange={(e) =>
                    setDateFilter({ ...dateFilter, from: e.target.value })
                  }
                />
              </div>
              <div className="input-field">
                <label>
                  <FaCalendarAlt /> To Date
                </label>
                <input
                  type="date"
                  value={dateFilter.to}
                  onChange={(e) =>
                    setDateFilter({ ...dateFilter, to: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="action-btns">
              <button className="fetch-btn" onClick={fetchSummaryData}>
                <FaFilter /> <p>GENERATE REPORT</p>
              </button>
              <button className="export-btn" onClick={downloadExcel}>
                <FaFileExcel /> <p>EXPORT TO EXCEL</p>
              </button>
            </div>
          </div>
        </section>

        {/* Table Section */}
        <section className="table-section">
          <div className="table-container">
            <div className="table-header">
              <h3>
                <FaTable /> Analysis: {dateFilter.from} to {dateFilter.to}
              </h3>
            </div>
            <table className="summary-data-table">
              <thead>
                <tr>
                  <th>Seva Name</th>
                  <th className="text-center">Total Quantity Sold</th>
                  <th className="text-right">Total Revenue (₹)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="loading-row">
                      Processing Financial Records...
                    </td>
                  </tr>
                ) : reportData.length > 0 ? (
                  reportData.map((item, index) => (
                    <tr key={index}>
                      <td className="seva-name-cell">{item.seva_name}</td>
                      <td className="text-center">{item.total_quantity}</td>
                      <td className="text-right amount-col">
                        ₹
                        {parseFloat(item.total_amount).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="empty-row">
                      No records found for this period.
                    </td>
                  </tr>
                )}
              </tbody>
              {reportData.length > 0 && (
                <tfoot>
                  <tr className="grand-total-row">
                    <td>GRAND TOTAL COLLECTION</td>
                    <td className="text-center">{totalQty}</td>
                    <td className="text-right">
                      ₹
                      {grandTotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </section>
      </div>
    </>
  );
};

export default SevaFinance;



