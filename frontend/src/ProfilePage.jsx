import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const decoded = jwtDecode(token);
    setForm({
      name: decoded.name,
      email: decoded.email,
    });
    setLoading(false);
  }, [navigate]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 🔥 Replace with your real API endpoint
      await axios.put(
        "http://localhost:5000/user/update",
        form,
        { withCredentials: true }
      );

      alert("Profile updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Your Profile</h2>

        <div style={styles.field}>
          <label>Name</label>
          <input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label>Email</label>
          <input
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div style={styles.actions}>
          <button style={styles.cancel} onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
          <button
            style={styles.save}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0c1120",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#111827",
    padding: 40,
    borderRadius: 20,
    width: 400,
    color: "white",
  },
  title: {
    marginBottom: 20,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 20,
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
  },
  cancel: {
    padding: "10px 20px",
    background: "transparent",
    border: "1px solid gray",
    color: "white",
    borderRadius: 8,
  },
  save: {
    padding: "10px 20px",
    background: "linear-gradient(135deg,#4f8ef7,#a78bfa)",
    border: "none",
    color: "white",
    borderRadius: 8,
  },
};