import React, { useState } from "react";
import { Card, Button, Form, Image, Row, Col } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import Footer from "../components/Footer";
import FeaturedListing from "../components/FeatureListing";
import Newsletter from "../components/Newsletter";
import Header from "../components/Header";
import { SlCalender } from "react-icons/sl";
import { RiHome9Line, RiRuler2Line } from "react-icons/ri"; // Combined RiRuler2Line
import { IoBedOutline, IoCarOutline } from "react-icons/io5"; // Combined IoCarOutline
import { PiShower } from "react-icons/pi";

// --- Reusable Property Section Component ---
// This component encapsulates the common structure for property detail sections (Overview, Address, etc.)
const PropertySection = ({ title, children }) => (
  <div className="card shadow-sm mt-4" style={sectionCardStyles}>
    <div className="card-body p-0 bg-white">
      <div>
        <div style={sectionHeaderStyles} className="px-4 py-3">
          <h5 className="mb-0 fw-bold">{title}</h5>
        </div>
        <div className="px-4 py-3 bg-white">
          {children}
        </div>
      </div>
    </div>
  </div>
);

// --- Styling Constants (can be moved to a CSS module or styled-components) ---
const sectionCardStyles = {
  borderRadius: '15px',
  border: 'none',
  paddingTop: '20px',
  marginBottom: '20px',
};

const sectionHeaderStyles = {
  backgroundColor: '#f5f5f5',
};

const mainImageStyles = {
  height: "100%",
  width: "100%",
  objectFit: "cover",
  minHeight: "400px",
  border: "none",
};

const thumbnailImageStyles = {
  height: "60px",
  width: "80px",
  objectFit: "cover",
  border: "none",
  borderRadius: "6px",
};

const formCardStyles = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  maxWidth: '550px',
  margin: '0 auto',
  border: 'none',
};

const formInputStyles = {
  border: "none",
  backgroundColor: "#f8f9fa",
};

const featureBulletStyles = {
  width: '18px', // Increased slightly for better visibility
  height: '18px', // Increased slightly
  backgroundColor: '#007bff',
  color: 'white',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px', // Adjusted font size
  lineHeight: 1,
  position: 'relative',
  top: '1.97px',
  left: '1.97px',
};


// --- PropertyDetail Component ---
const PropertyDetail = ({ property }) => { // Accept property as a prop
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Example default property data if no prop is passed (for demonstration)
  const defaultPropertyData = {
    overview: {
      propertyType: 'Shared House',
      yearBuilt: '2015',
      size: '1950 m²',
      bedrooms: '6',
      bathrooms: '3',
      garage: '2'
    },
    address: {
      street: '7409 Knollwood Cove',
      zipCode: '78731',
      city: 'Austin',
      area: 'Knollwood',
      state: 'Texas',
      country: 'United States'
    },
    description: "Discover your dream home with our extensive collection of properties, meticulously curated to meet diverse needs and aspirations. We understand that finding the perfect space is more than just a transaction; it's about discovering a place where memories are made and futures are built. Our listings range from charming starter homes and cozy apartments to sprawling luxury estates and prime commercial spaces. Each property is presented with detailed information, high-quality visuals, and essential insights into its features and neighborhood. We've simplified the search process, making it easy to navigate through various options, compare choices, and connect with expert agents. Our commitment is to provide a seamless and transparent experience, guiding you every step of the way, whether you're looking to buy, sell, or rent. Explore our portfolio today and embark on your journey to find that exceptional property that truly feels like home.",
    details: {
      propertyId: 'MT1651674',
      propertySize: '1950 m²',
      propertyType: 'Shared House',
      propertyStatus: 'For Rent',
      bedrooms: '6',
      bathrooms: '3'
    },
    features: [
      'Air Conditioning', 'External Yard', 'Dryer', 'Gym', 'Laundry', 'Shared gym',
      'Kitchen Appliances', 'Outdoor Shower', 'Two Refrigerators', 'TV Cable', 'Washer'
    ],
    images: [ // Moved images here to be part of the property data
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ]
  };

  // Use the passed property prop, or default to defaultPropertyData if not provided
  const currentProperty = property || defaultPropertyData;
  const propertyImages = currentProperty.images; // Use images from currentProperty

  const handleNextImage = () => {
    setMainImageIndex((prevIndex) =>
      prevIndex === propertyImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setMainImageIndex((prevIndex) =>
      prevIndex === 0 ? propertyImages.length - 1 : prevIndex - 1
    );
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to a backend API
    console.log("Inquiry submitted:", formData);
    alert("Your inquiry has been submitted successfully!");
    // Reset form after submission
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <>
      <Header />
      <div className="container-fluid px-5">
        <Card className="shadow-sm w-100" style={{ backgroundColor: "#F3F3F3", border: "none" }}>
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h2 className="fw-bold mb-1">Light and Modern House</h2>
                <p className="text-muted mb-3 d-flex align-items-center gap-1"> {/* Adjusted gap */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10.41"
                    height="14.57"
                    viewBox="0 0 384 512"
                    fill="#6c757d"
                  >
                    <path d="M168 0C75.2 0 0 75.2 0 168c0 87.7 132.9 308.6 152.2 337.4 4.6 6.8 12.3 10.6 20.3 10.6s15.7-3.9 20.3-10.6C251.1 476.6 384 255.7 384 168 384 75.2 308.8 0 216 0zm0 240c-39.8 0-72-32.2-72-72s32.2-72 72-72 72 32.2 72 72-32.2 72-72 72z" />
                  </svg>
                  {currentProperty.address.city}, {currentProperty.address.state}
                </p>
                <div className="d-flex gap-2 mb-2">
                  <span
                    style={{
                      width: '77.34px',
                      height: '30.82px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5.91px',
                      borderRadius: '5.32px',
                      padding: '5.91px',
                      backgroundColor: '#94A0DF',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'uppercase'
                    }}
                  >
                    FOR RENT
                  </span>

                  <span
                    style={{
                      width: '77.34px',
                      height: '30.82px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5.91px',
                      borderRadius: '5.32px',
                      padding: '5.91px',
                      backgroundColor: '#429283',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'uppercase'
                    }}
                  >
                    FEATURED
                  </span>
                </div>
              </div>

              <div className="text-end">
                <h3
                  className="fw-bold mb-0"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 100,
                    fontSize: '25px',
                    lineHeight: '28px',
                    letterSpacing: '0.5px',
                    marginTop: '20px'
                  }}
                >
                  $4,500/mo
                </h3>
              </div>
            </div>

            <Row>
              {/* Left Column - Image Section */}
              <Col md={7} className="mb-4 mb-md-0">
                <div className="position-relative mb-3">
                  <Image
                    src={propertyImages[mainImageIndex]}
                    alt={`Property image ${mainImageIndex + 1}`}
                    fluid
                    className="rounded"
                    style={mainImageStyles}
                  />
                  <Button
                    variant="light"
                    className="position-absolute top-50 start-0 translate-middle-y rounded-circle p-2"
                    onClick={handlePrevImage}
                    style={{ left: "10px" }}
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  <Button
                    variant="light"
                    className="position-absolute top-50 end-0 translate-middle-y rounded-circle p-2"
                    onClick={handleNextImage}
                    style={{ right: "10px" }}
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>

                <div className="position-relative">
                  {/* Added a custom scrollbar style for better cross-browser consistency */}
                  <div className="d-flex overflow-auto py-2 thumbnail-scroll">
                    {propertyImages.map((img, index) => (
                      <div
                        key={index} // Using index as key is acceptable here since images are static
                        className="me-2 cursor-pointer"
                        onClick={() => setMainImageIndex(index)}
                        style={{ minWidth: "80px" }}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className={mainImageIndex === index ? "border border-primary" : ""} // Added border class
                          style={{ ...thumbnailImageStyles, opacity: mainImageIndex === index ? 1 : 0.7 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Col>

              {/* Right Column - Inquiry Form */}
              <Col md={5}>
                <div style={formCardStyles}>
                  <h4 className="fw-bold mb-2">Submit an inquiry</h4>
                  <div
                    style={{
                      width: '60px',
                      height: '3px',
                      backgroundColor: '#2495FD',
                      borderRadius: '2px',
                      marginBottom: '24px'
                    }}
                  ></div>

                  <div className="d-flex align-items-center mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                      roundedCircle
                      width={50}
                      height={50}
                      className="me-3"
                      alt="Martha Stewart, Property Consultant"
                    />
                    <div>
                      <h6 className="mb-0 fw-bold">Martha Stewart</h6>
                      <small className="text-muted">Property Consultant</small>
                    </div>
                  </div>

                  <Form onSubmit={handleFormSubmit}>
                    <Form.Group className="mb-3" controlId="formName">
                      <Form.Label className="fw-bold">Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="John Doe"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        style={formInputStyles}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label className="fw-bold">Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="email@domain.com"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        style={formInputStyles}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPhone">
                      <Form.Label className="fw-bold">Phone (Optional)</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="+1 (123) 456-0509"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        style={formInputStyles}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formMessage">
                      <Form.Label className="fw-bold">Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Please Enter Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        style={{ ...formInputStyles, resize: "none" }}
                        required
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      className="w-100 fw-bold py-2 border-0"
                      style={{ backgroundColor: '#2495FD', color: 'white' }}
                    >
                      Submit
                    </Button>
                  </Form>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Property Listing Details Sections */}

        {/* Overview Section */}
        <PropertySection title="Overview">
          <Row className="g-3">
            <Col xs={6} md={4} lg={2} className="d-flex flex-column"> {/* Adjusted cols for better responsiveness */}
              <small className="text-muted d-block">Property Type</small>
              <span className="fw-medium d-flex align-items-center"><RiHome9Line className="me-2" size={18} />{currentProperty.overview.propertyType}</span>
            </Col>
            <Col xs={6} md={4} lg={2} className="d-flex flex-column">
              <small className="text-muted d-block">Year Built</small>
              <span className="fw-medium d-flex align-items-center"><SlCalender className="me-1" size={18} />{currentProperty.overview.yearBuilt}</span>
            </Col>
            <Col xs={6} md={4} lg={2} className="d-flex flex-column">
              <small className="text-muted d-block">Size</small>
              <span className="fw-medium d-flex align-items-center"><RiRuler2Line className="me-1" size={18} />{currentProperty.overview.size}</span>
            </Col>
            <Col xs={6} md={4} lg={2} className="d-flex flex-column">
              <small className="text-muted d-block">Bedrooms</small>
              <span className="fw-medium d-flex align-items-center"><IoBedOutline className="me-1" size={18} />{currentProperty.overview.bedrooms}</span>
            </Col>
            <Col xs={6} md={4} lg={2} className="d-flex flex-column">
              <small className="text-muted d-block">Bathrooms</small>
              <span className="fw-medium d-flex align-items-center"><PiShower className="me-1" size={18} />{currentProperty.overview.bathrooms}</span>
            </Col>
            <Col xs={6} md={4} lg={2} className="d-flex flex-column">
              <small className="text-muted d-block">Garage</small>
              <span className="fw-medium d-flex align-items-center"><IoCarOutline className="me-1" size={18} />{currentProperty.overview.garage}</span>
            </Col>
          </Row>
        </PropertySection>

        {/* Address Section */}
        <PropertySection title="Address">
          <Row className="mb-3">
            <Col md={3}><small className="text-muted fw-bold">Address</small></Col>
            <Col md={3}><span className="fw-medium">{currentProperty.address.street}, {currentProperty.address.zipCode}</span></Col>
            <Col md={3}><small className="text-muted fw-bold">Zip/Postal Code</small></Col>
            <Col md={3}><span className="fw-medium">{currentProperty.address.zipCode}</span></Col>
          </Row>
          <Row className="mb-3">
            <Col md={3}><small className="text-muted fw-bold">City</small></Col>
            <Col md={3}><span className="fw-medium">{currentProperty.address.city}</span></Col>
            <Col md={3}><small className="text-muted fw-bold">Area</small></Col>
            <Col md={3}><span className="fw-medium">{currentProperty.address.area}</span></Col>
          </Row>
          <Row>
            <Col md={3}><small className="text-muted fw-bold">State/County</small></Col>
            <Col md={3}><span className="fw-medium">{currentProperty.address.state}</span></Col>
            <Col md={3}><small className="text-muted fw-bold">Country</small></Col>
            <Col md={3}><span className="fw-medium">{currentProperty.address.country}</span></Col>
          </Row>
        </PropertySection>

        {/* Description Section */}
        <PropertySection title="Description">
          <p className="mb-0 text-justify lh-base">{currentProperty.description}</p>
        </PropertySection>

        {/* Details Section */}
        <PropertySection title="Details">
          <Row className="g-3">
            <Col xs={6} md={3}><small className="text-muted fw-bold">Property ID</small></Col>
            <Col xs={6} md={3}><span className="fw-medium">{currentProperty.details.propertyId}</span></Col>
            <Col xs={6} md={3}><small className="text-muted fw-bold">Property Size</small></Col>
            <Col xs={6} md={3}><span className="fw-medium">{currentProperty.details.propertySize}</span></Col>
            <Col xs={6} md={3}><small className="text-muted fw-bold">Property Type</small></Col>
            <Col xs={6} md={3}><span className="fw-medium">{currentProperty.details.propertyType}</span></Col>
            <Col xs={6} md={3}><small className="text-muted fw-bold">Property Status</small></Col>
            <Col xs={6} md={3}><span className="fw-medium">{currentProperty.details.propertyStatus}</span></Col>
            <Col xs={6} md={3}><small className="text-muted fw-bold">Bedrooms</small></Col>
            <Col xs={6} md={3}><span className="fw-medium">{currentProperty.details.bedrooms}</span></Col>
            <Col xs={6} md={3}><small className="text-muted fw-bold">Bathrooms</small></Col>
            <Col xs={6} md={3}><span className="fw-medium">{currentProperty.details.bathrooms}</span></Col>
          </Row>
        </PropertySection>

        {/* Features Section - No margin-bottom on the last one by default from PropertySection */}
        <PropertySection title="Features">
          <Row className="g-2">
            {currentProperty.features && currentProperty.features.map((feature, index) => (
              <Col key={feature} xs={12} sm={6} md={4} lg={3}> {/* Using feature as key if unique, fallback to index */}
                <div className="d-flex align-items-center">
                  <div style={featureBulletStyles} className="me-2">
                    ✓
                  </div>
                  <span className="fw-medium">{feature}</span>
                </div>
              </Col>
            ))}
          </Row>
        </PropertySection>

      </div>
      <FeaturedListing />
      <Newsletter />
      <Footer />
    </>
  );
};

export default PropertyDetail;