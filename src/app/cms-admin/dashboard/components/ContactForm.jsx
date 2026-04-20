"use client";

import { useEffect, useState, useRef } from "react";
import { Base_url } from "@/app/api/post";

export default function FormDataList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  async function fetchFormData() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found in localStorage");
      }

      const response = await fetch(`${Base_url}form/form-data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchFormData();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "15px" }}>Form Data</h2>
      {data.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Request Type</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{item.id}</td>
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>{item.email}</td>
                <td style={tdStyle}>{item.phone}</td>
                <td style={tdStyle}>{item.request_type}</td>
                <td style={tdStyle}>{item.description}</td>
                <td style={tdStyle}>
                  {new Date(item.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "2px solid #ccc",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "10px",
  textAlign: "left",
};