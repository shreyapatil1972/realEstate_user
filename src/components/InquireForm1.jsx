import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Css/InquiryForm1.css';

const InquiryForm1 = () => {
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState({
    inquiryType: '',
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Fetch property types (For Rent / For Sale)
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axios.get('http://localhost:7000/api/properties/getAllProperties');
        const uniqueTypes = [...new Set(res.data.properties.map(p => p.type))];
        setTypes(uniqueTypes);
      } catch (err) {
        console.error('Failed to fetch property types', err);
      }
    };
    fetchTypes();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:7000/api/general-inquiries/submit-general-inquiry', formData);
      alert('Inquiry submitted successfully!');
      setFormData({
        inquiryType: '',
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div
      className="container-fluid py-5 why-choose-us-section"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 30, 67, 0.78), rgba(0, 30, 67, 0.69)), url("src/assets/bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '776px',
        display: 'flex',
        alignItems: 'center',
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <div className="container">
        <div className="row justify-content-center g-4 align-items-stretch">
          {/* Left Column */}
          <div className="col-lg-7 d-flex flex-column">
            <div className="row row-cols-1 row-cols-md-2 g-4 flex-grow-1">
              <div className="col d-flex">
                <div className="p-4 text-white text-start why-us-heading-box d-flex flex-column justify-content-center">
                  <h1 className="fw-bold display-5 mb-0">Why Our Service Is The Perfect Choice?</h1>
                  <div className="heading-underline mt-3"></div>
                </div>
              </div>
             {[
  {
    id: 1,
    title: "Personalized Property Solutions",
    description:
      "We tailor property recommendations to your lifestyle and goals, helping you find the perfect home or investment without wasting time."
  },
  {
    id: 2,
    title: "Expert Guidance with Local Insights",
    description:
      "Our professionals know the market inside and out, offering neighborhood insights and strategic advice so you can buy or rent with confidence."
  },
  {
    id: 3,
    title: "End-to-End Support & Transparency",
    description:
      "From virtual tours to paperwork and post-sale help, we support you at every stage—with clear pricing and no hidden surprises."
  }
].map(({ id, title, description }) => (
  <div key={id} className="col d-flex">
    <div className="p-4 text-white text-start description-box d-flex flex-column justify-content-center">
      <h3 className="fw-semibold fs-3 mb-2">
        <span className="number-prefix">{`0${id}.`}</span>{" "}
        <span>{title}</span>
      </h3>
      <p className="mb-0">{description}</p>
    </div>
  </div>
))}

            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="col-lg-4 d-flex">
            <div className="card p-4 shadow rounded-3 flex-grow-1">
              <h4 className="card-title mb-4 text-start" style={{ borderBottom: '2px solid #e0e0e0', paddingBottom: '10px', fontWeight: '200' }}>
                General Inquiry Form
              </h4>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="inquiryType" className="form-label" style={{ fontWeight: '500', color: 'black' }}>
                    Inquiry Type
                  </label>
                  <select
                    className="form-select rounded-1"
                    id="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Inquiry Type</option>
                    {types.map((type, idx) => (
                      <option key={idx} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="name" className="form-label" style={{ fontWeight: '500', color: 'black' }}>Name</label>
                  <input
                    type="text"
                    className="form-control rounded-1"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label" style={{ fontWeight: '500', color: 'black' }}>Email</label>
                  <input
                    type="email"
                    className="form-control rounded-1"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@domain.com"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label" style={{ fontWeight: '500', color: 'black' }}>Phone</label>
                  <input
                    type="tel"
                    className="form-control rounded-1"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="1234567890"
                     
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="message" className="form-label" style={{ fontWeight: '500', color: 'black' }}>Message</label>
                  <textarea
                    className="form-control rounded-2"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Please enter your message"
                    required
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary rounded-1 shadow-sm" style={{ width: "50%" }}>
                    Submit
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryForm1;
