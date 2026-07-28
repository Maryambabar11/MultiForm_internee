import React, { useState, useEffect } from 'react';
import './App.css';

const INITIAL_FORM_DATA = {
  fullName: '',
  email: '',
  username: '',
  plan: 'Professional',
  billing: 'Yearly',
};

export default function App() {
  const [step, setStep] = useState(1);

  // Autosave Feature
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('multi_step_form_draft');
    return saved ? JSON.parse(saved) : INITIAL_FORM_DATA;
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem('multi_step_form_draft', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = () => {
    const errs = {};
    if (step === 1) {
      if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
      if (!formData.email.trim()) {
        errs.email = 'Email address is required.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errs.email = 'Enter a valid email address.';
      }
    }

    if (step === 2) {
      if (!formData.username.trim()) errs.username = 'Username is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setErrors({});
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      setSubmitted(true);
      localStorage.removeItem('multi_step_form_draft');
    }
  };

  const handleReset = () => {
    localStorage.removeItem('multi_step_form_draft');
    setFormData(INITIAL_FORM_DATA);
    setStep(1);
    setSubmitted(false);
  };

  const progressPercent = ((step - 1) / 2) * 100;

  return (
    <div className="app-container">
      {/* Background Orbs */}
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>

      <div className="form-card">
        {/* Left Navigation Sidebar */}
        <div className="sidebar">
          <div>
            <div className="sidebar-title">REGISTRATION</div>
            <div className="nav-steps">
              <div className={`nav-step-item ${step === 1 ? 'active' : ''}`}>
                <span className="step-number">01</span>
                <span className="step-label">Personal Info</span>
              </div>
              <div className={`nav-step-item ${step === 2 ? 'active' : ''}`}>
                <span className="step-number">02</span>
                <span className="step-label">Account Info</span>
              </div>
              <div className={`nav-step-item ${step === 3 ? 'active' : ''}`}>
                <span className="step-number">03</span>
                <span className="step-label">Summary</span>
              </div>
            </div>
          </div>

          {/* Clean Signature Badge without external logos */}
          <div className="signature-badge">
            Designed by <span>Maryam Babar</span>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="main-content">
          {!submitted ? (
            <>
              <div>
                <div className="header-row">
                  <h2 className="animated-heading">
                    {step === 1 && '1. Personal Info'}
                    {step === 2 && '2. Account Details'}
                    {step === 3 && '3. Confirm & Submit'}
                  </h2>
                  <span className="autosave-badge">⚡ Autosave Active</span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="step-body" key={step}>
                    {step === 1 && (
                      <div>
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input
                            type="text"
                            name="fullName"
                            placeholder="e.g. Maryam Babar"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`input-field ${errors.fullName ? 'invalid' : ''}`}
                          />
                          {errors.fullName && <p className="error-text">{errors.fullName}</p>}
                        </div>

                        <div className="form-group">
                          <label>Email Address *</label>
                          <input
                            type="email"
                            name="email"
                            placeholder="e.g. maryam@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={`input-field ${errors.email ? 'invalid' : ''}`}
                          />
                          {errors.email && <p className="error-text">{errors.email}</p>}
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <div className="form-group">
                          <label>Username *</label>
                          <input
                            type="text"
                            name="username"
                            placeholder="Choose your unique username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`input-field ${errors.username ? 'invalid' : ''}`}
                          />
                          {errors.username && <p className="error-text">{errors.username}</p>}
                        </div>

                        <div className="form-group">
                          <label>Select Membership Tier</label>
                          <select
                            name="plan"
                            value={formData.plan}
                            onChange={handleChange}
                            className="input-field"
                          >
                            <option value="Starter">Starter Plan ($9/mo)</option>
                            <option value="Professional">Professional Plan ($29/mo)</option>
                            <option value="Enterprise">Enterprise Plan ($79/mo)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div>
                        <div className="summary-container">
                          <div className="summary-row">
                            <span className="summary-label">Full Name</span>
                            <span className="summary-value">{formData.fullName}</span>
                          </div>
                          <div className="summary-row">
                            <span className="summary-label">Email Address</span>
                            <span className="summary-value">{formData.email}</span>
                          </div>
                          <div className="summary-row">
                            <span className="summary-label">Username</span>
                            <span className="summary-value">@{formData.username}</span>
                          </div>
                          <div className="summary-row">
                            <span className="summary-label">Selected Plan</span>
                            <span className="summary-value">{formData.plan}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="button-row">
                    {step > 1 && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handlePrev}
                      >
                        Previous
                      </button>
                    )}

                    {step < 3 ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleNext}
                      >
                        Next Step →
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-primary">
                        Confirm & Submit ✓
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="success-box">
              <h2>🎉 Registration Complete!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>
                Your account details have been recorded successfully.
              </p>
              <button className="btn btn-primary" onClick={handleReset}>
                Start New Registration
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}