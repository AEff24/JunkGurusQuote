import { useState } from "react";

export default function JunkQuoteAI() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(null);
  const [outside, setOutside] = useState(null);
  const [floor, setFloor] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [manualBase, setManualBase] = useState(null);

  const handleUpload = (event) => {
    const uploaded = Array.from(event.target.files);
    setFiles(uploaded);
  };

  const equipmentOptions = [
    { label: "Pickup (Avg. 3 cu yd)", base: 164 },
    { label: "Small Trailer (Avg. 5 cu yd)", base: 272 },
    { label: "Standard Trailer (Avg. 9.5 cu yd)", base: 398 },
    { label: "Large Trailer (Avg. 13 cu yd)", base: 528 },
    { label: "Box Truck (16+ cu yd)", base: 663 },
  ];

  const calculateQuote = (overrideBase = null) => {
    if (!outside || !floor || !date || !time) return;

    setLoading(true);
    setTimeout(() => {
      const totalItems = files.length;
      let baseEstimate = overrideBase || 164;
      if (!overrideBase) {
        if (totalItems >= 5 && totalItems < 9) baseEstimate = 272;
        else if (totalItems >= 9 && totalItems < 13) baseEstimate = 398;
        else if (totalItems >= 13 && totalItems < 17) baseEstimate = 528;
        else if (totalItems >= 17) baseEstimate = 663;
      }

      const now = new Date();
      const selectedDateTime = new Date(`${date} ${time}`);
      const hoursDiff = (selectedDateTime - now) / (1000 * 60 * 60);

      let multiplier = 1;
      if (hoursDiff <= 8) multiplier = 1.1;
      else if (hoursDiff <= 24) multiplier = 0.9;
      else if (hoursDiff <= 48) multiplier = 0.85;
      else multiplier = 0.8;

      if (outside === "yes") multiplier *= 0.9;

      const final = Math.round(baseEstimate * multiplier);
      const label =
        equipmentOptions.find((e) => e.base === baseEstimate)?.label || "";

      setQuote(`$${final} (${label})`);
      setManualBase(baseEstimate);
      setLoading(false);
    }, 1000);
  };

  const reset = () => {
    setFiles([]);
    setQuote(null);
    setOutside(null);
    setFloor(null);
    setDate(null);
    setTime("");
    setManualBase(null);
  };

  const getButtonStyle = (active) => ({
    margin: "4px",
    padding: "10px 16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: active ? "#267e3e" : "#fff",
    color: active ? "#fff" : "#333",
    cursor: "pointer",
  });

  const timeOptions = [
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
  ];

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "30px 20px",
        textAlign: "center",
        border: "1px solid #ddd",
        borderRadius: "12px",
        backgroundColor: "#f9f9f9",
        fontFamily: "Arial, sans-serif",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
      }}
    >
      <img
        src="https://media.canva.com/v2/image-resize/format:PNG/height:168/quality:100/uri:ifs%3A%2F%2F%2Fcd70fbc0-d194-40a9-a99e-a0c374588e31/watermark:F/width:550?csig=AAAAAAAAAAAAAAAAAAAAAD0vAqGQaGbCelNOaRF_Vg_7OAh8b7iXugodNAE9TMCv&exp=1744928949&osig=AAAAAAAAAAAAAAAAAAAAAM11v2Lukv6b6uMzirpujjZuarEFXy5dIr0BfZO3-fgV&signer=media-rpc&x-canva-quality=thumbnail_large"
        alt="JunkGurus Logo"
        style={{ height: "60px", marginBottom: "20px" }}
      />

      <h1 style={{ fontSize: "22px", fontWeight: "bold", color: "#2f3e46" }}>
        Instant Junk Removal Quote Tool{" "}
        <span style={{ fontSize: "14px", fontWeight: "normal", color: "#888" }}>
          (BETA)
        </span>
      </h1>

      <p style={{ fontSize: "14px", color: "#555", margin: "10px 0 20px" }}>
        Upload photos, answer a few quick questions, and get a fast, accurate
        price estimate for your junk removal — powered by real-time AI and
        JunkGurus expertise.
      </p>

      {!files.length && !quote && (
        <>
          <label
            htmlFor="upload"
            style={{
              display: "inline-block",
              backgroundColor: "#267e3e",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            📸 Upload Photos
          </label>
          <input
            id="upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </>
      )}

      {files.length > 0 && (
        <>
          <p style={{ fontSize: "16px", marginTop: "20px" }}>
            Are all items outside?
          </p>
          <div>
            <button
              style={getButtonStyle(outside === "yes")}
              onClick={() => setOutside("yes")}
            >
              Yes
            </button>
            <button
              style={getButtonStyle(outside === "no")}
              onClick={() => setOutside("no")}
            >
              No
            </button>
          </div>

          <p style={{ fontSize: "16px", marginTop: "20px" }}>
            Highest floor an item is on?
          </p>
          <div>
            {["Ground", 2, 3, 4, 5, 6, 7, 8, 9].map((f) => (
              <button
                key={f}
                style={getButtonStyle(floor === f)}
                onClick={() => setFloor(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <p style={{ fontSize: "16px", marginTop: "20px" }}>Select date:</p>
          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            style={{ marginBottom: "12px", padding: "8px" }}
          />

          <p style={{ fontSize: "16px", marginTop: "10px" }}>Select time:</p>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ padding: "10px", fontSize: "14px", marginBottom: "20px" }}
          >
            <option value="">-- Select Time --</option>
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <div>
            <button
              style={{
                marginTop: "10px",
                padding: "12px 20px",
                backgroundColor: "#267e3e",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
              }}
              onClick={() => calculateQuote(manualBase)}
            >
              {quote ? "Update My Quote" : "Get Quote"}
            </button>
          </div>
        </>
      )}

      {loading && (
        <p style={{ color: "#999", marginTop: "20px" }}>
          🔄 Analyzing junk volume...
        </p>
      )}

      {quote && !loading && (
        <div style={{ marginTop: "20px" }}>
          <p
            style={{
              color: "#267e3e",
              fontWeight: "bold",
              fontSize: "18px",
              marginBottom: "20px",
            }}
          >
            🧠 Estimated Load: {quote}
          </p>

          <p
            style={{
              fontSize: "13px",
              color: "#888",
              marginTop: "12px",
              maxWidth: "500px",
              marginInline: "auto",
            }}
          >
            ⚠️{" "}
            <em>
              This is a beta version. The suggested equipment and pricing may
              not always be perfect. If you schedule a pickup, please use your
              best judgment when selecting equipment. Final pricing may vary.
            </em>
          </p>

          <div style={{ marginTop: "30px" }}>
            <p style={{ fontSize: "14px", marginBottom: "8px", color: "#333" }}>
              Think the suggested equipment is wrong? Choose a different piece
              of equipment to see how it affects your quote:
            </p>
            {equipmentOptions.map((opt) => (
              <button
                key={opt.base}
                style={getButtonStyle(manualBase === opt.base)}
                onClick={() => calculateQuote(opt.base)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <h2 style={{ marginTop: "40px", color: "#2f3e46" }}>
            Ready To Schedule?
          </h2>

          <div style={{ marginTop: "10px" }}>
            <a href="https://app.junkgurus.us/scheduler.aspx" target="_blank">
              <button
                style={{
                  padding: "12px 24px",
                  margin: "10px",
                  backgroundColor: "#267e3e",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Schedule Residential Pickup
              </button>
            </a>
            <a href="https://app.junkgurus.us/depot.aspx" target="_blank">
              <button
                style={{
                  padding: "12px 24px",
                  margin: "10px",
                  backgroundColor: "#2f3e46",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Schedule Property Mgmt Pickup
              </button>
            </a>
          </div>

          <button
            onClick={reset}
            style={{
              padding: "10px 20px",
              marginTop: "20px",
              backgroundColor: "#ccc",
              border: "none",
              borderRadius: "4px",
              color: "#222",
            }}
          >
            🔁 Get Another Quote
          </button>
        </div>
      )}

      <p style={{ fontSize: "12px", color: "#aaa", marginTop: "40px" }}>
        Powered by <strong style={{ color: "#2f3e46" }}>JunkGurus</strong>
      </p>
    </div>
  );
}
