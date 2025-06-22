import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Form, Image, Row, Col } from "react-bootstrap";
import axios from "axios";
import Footer from "../components/Footer";
import FeaturedListing from "../components/FeatureListing";
import Newsletter from "../components/Newsletter";
import Header from "../components/Header";

const PropertySection = ({ title, children }) => (
  <div className="card shadow-sm mt-4" style={{ borderRadius: '15px', border: 'none', paddingTop: '20px', marginBottom: '20px' }}>
    <div className="card-body p-0 bg-white">
      <div>
        <div className="px-4 py-3" style={{ backgroundColor: '#f5f5f5' }}>
          <h5 className="mb-0 fw-bold">{title}</h5>
        </div>
        <div className="px-4 py-3 bg-white">{children}</div>
      </div>
    </div>
  </div>
);

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://localhost:7000/api/properties/getPropertyById/${id}`);
        setProperty(res.data.property);
      } catch (error) {
        console.error("Failed to fetch property", error);
      }
    };

    const fetchUserInfo = async () => {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:7000/api/users/getUserInfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setLoggedUser(res.data.loggedUser);
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchProperty();
    fetchUserInfo();
  }, [id]);

  if (!property) return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      <Header />
      <div className="container-fluid px-5">
        <Card className="shadow-sm w-100" style={{ backgroundColor: "#F3F3F3", border: "none" }}>
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h2 className="fw-bold mb-1">{property.title}</h2>
                <p className="text-muted mb-3">{property.city}, {property.state}</p>
                <div className="d-flex gap-2 mb-2">
                  <span className="badge bg-primary text-uppercase">{property.type}</span>
                  <span className="badge bg-success text-uppercase">Featured</span>
                </div>
              </div>
              <div className="text-end">
                <h3 className="fw-bold mb-0">${property.price}</h3>
              </div>
            </div>

            <Row>
              <Col md={7} className="mb-4">
                <Image src={property.image} fluid className="rounded" style={{ height: "400px", width: "100%", objectFit: "cover" }} />
              </Col>
              <Col md={5}>
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
                  <h4 className="fw-bold mb-2">
                    {loggedUser ? `Welcome, ${loggedUser.name}` : 'Submit an inquiry'}
                  </h4>
                  <div style={{ width: '60px', height: '3px', backgroundColor: '#2495FD', borderRadius: '2px', marginBottom: '24px' }}></div>

                  {loggedUser ? (
                    <>
                      <div className="d-flex align-items-center mb-4">
                        <Image
                          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
                          roundedCircle
                          width={50}
                          height={50}
                          className="me-3"
                          alt="User"
                        />
                        <div>
                          <h6 className="mb-0 fw-bold">{loggedUser.name}</h6>
                          <small className="text-muted">{loggedUser.email}</small>
                        </div>
                      </div>

                     <Form
  onSubmit={async (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    const phone = e.target.phone.value;

    try {
      const res = await axios.post("http://localhost:7000/api/inquiries/submit", {
        name: loggedUser.name,
        email: loggedUser.email,
        phone,
        message,
        propertyId: property.id, // Include this in backend model
        inquiryType: "Property", // Sent silently, not shown in UI
      });

      if (res.data.success) {
        alert("Inquiry submitted successfully!");
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
      alert("Submission failed.");
    }
  }}
>
  <Form.Group className="mb-3">
    <Form.Label>Name</Form.Label>
    <Form.Control type="text" value={loggedUser.name} disabled />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Email</Form.Label>
    <Form.Control type="email" value={loggedUser.email} disabled />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Phone</Form.Label>
    <Form.Control
      type="tel"
      name="phone"
      placeholder="Enter your phone number"
      pattern="[0-9]{10}"
      required
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Message</Form.Label>
    <Form.Control
      as="textarea"
      rows={3}
      name="message"
      placeholder="Your message..."
      required
    />
  </Form.Group>

  <Button type="submit" className="w-100 bg-primary border-0">Submit</Button>

  <Button
    variant={submitted ? "danger" : "outline-danger"}
    className="w-100 mt-3"
    onClick={() => {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      setLoggedUser(null);
      setSubmitted(false);
      navigate("/", { replace: true });
    }}
  >
    Logout
  </Button>
</Form>

                    </>
                  ) : (
                    <div className="text-center">

                      <Button
                        onClick={() => navigate('/login', { state: { propertyId: id } })}
                        className="w-100 bg-primary border-0"
                      >
                        Login to submit inquiry
                      </Button>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <PropertySection title="Overview">
          <Row className="gy-2">
            <Col md={4}><strong>Property Type:</strong> {property.type}</Col>
            <Col md={4}><strong>Year Built:</strong> {property.year}</Col>
            <Col md={4}><strong>Size:</strong> {property.size}</Col>
            <Col md={4}><strong>Bedrooms:</strong> {property.bedroom}</Col>
            <Col md={4}><strong>Bathrooms:</strong> {property.bathroom}</Col>
            <Col md={4}><strong>Garage:</strong> {property.garage}</Col>
          </Row>
        </PropertySection>

        <PropertySection title="Address">
          <Row className="gy-3">
            <Col md={6}><strong>Address:</strong> {property.address}</Col>
            <Col md={6}><strong>Zip/Postal Code:</strong> {property.zip_code}</Col>
            <Col md={6}><strong>City:</strong> {property.city}</Col>
            <Col md={6}><strong>Area:</strong> {property.area}</Col>
            <Col md={6}><strong>State:</strong> {property.state}</Col>
            <Col md={6}><strong>Country:</strong> {property.country}</Col>
          </Row>
        </PropertySection>

        <PropertySection title="Description">
          <p>{property.description}</p>
        </PropertySection>

        <PropertySection title="Details">
          <Row className="gy-2">
            <Col md={4}><strong>Property ID:</strong> {property.id}</Col>
            <Col md={4}><strong>Property Type:</strong> {property.type}</Col>
            <Col md={4}><strong>Bedrooms:</strong> {property.bedroom}</Col>
            <Col md={4}><strong>Property Size:</strong> {property.size}</Col>
            <Col md={4}><strong>Bathrooms:</strong> {property.bathroom}</Col>
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
