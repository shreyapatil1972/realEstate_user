import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaBed, FaShower, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';
import '../Css/HeroSectionWithSearch.css';

const HeroSectionWithSearch = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    propertyType: '',
    location: '',
    bedrooms: '',
    maxPrice: ''
  });
  
  const [filterOptions, setFilterOptions] = useState({
    cities: [],
    types: [],
    bedrooms: []
  });
  
  const [activeTab, setActiveTab] = useState('ALL UNITS');

  useEffect(() => {
    // Fetch filter options from backend
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/properties/getAllProperties');
        const properties = response.data.properties;
        
        // Extract unique cities
        const cities = [...new Set(properties.map(p => p.city))].filter(city => city).sort();
        
        // Extract unique property types (from first word of description)
        const types = [...new Set(properties
          .map(p => p.description ? p.description.split(' ')[0] : '')
          .filter(type => type)
  )].sort();
        
        // Extract bedroom options (filter out null/undefined)
        const bedrooms = [...new Set(properties
          .map(p => p.bedroom)
          .filter(bed => bed !== null && bed !== undefined)
        )].sort((a, b) => a - b);
        
        setFilterOptions({
          cities: ['All Cities', ...cities],
          types: ['All Types', ...types],
          bedrooms: ['All Sizes', ...bedrooms]
        });
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    
    fetchFilterOptions();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === 'All Cities' || value === 'All Types' || value === 'All Sizes' ? '' : value
    }));
  };

  const handleSearch = () => {
    const searchParams = {
      ...filters,
      type: activeTab === 'FOR RENT' ? 'For Rent' : 
            activeTab === 'FOR SALE' ? 'For Sale' : ''
    };
    onSearch(searchParams);
  };

  return (
    <div className="hero-container">
      <div className="hero-text">
        <h1>YOUR DREAM HOME</h1>
        <h2>IS ONE CLICK AWAY</h2>
      </div>

      <div className="search-section">
        <div className="property-options">
          <button 
            className={`property-option ${activeTab === 'ALL UNITS' ? 'active' : ''}`}
            onClick={() => setActiveTab('ALL UNITS')}
          >
            ALL UNITS
          </button>
          <button 
            className={`property-option ${activeTab === 'FOR RENT' ? 'active' : ''}`}
            onClick={() => setActiveTab('FOR RENT')}
          >
            FOR RENT
          </button>
          <button 
            className={`property-option ${activeTab === 'FOR SALE' ? 'active' : ''}`}
            onClick={() => setActiveTab('FOR SALE')}
          >
            FOR SALE
          </button>
        </div>

        <div className="search-filters">
          <div className="filter-group">
            <label>PROPERTY TYPE</label>
            <select 
              name="propertyType" 
              value={filters.propertyType}
              onChange={handleFilterChange}
            >
              {filterOptions.types.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>LOCATION</label>
            <select 
              name="location" 
              value={filters.location}
              onChange={handleFilterChange}
            >
              {filterOptions.cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>BEDROOMS</label>
            <select 
              name="bedrooms" 
              value={filters.bedrooms}
              onChange={handleFilterChange}
            >
              {filterOptions.bedrooms.map((bed, index) => (
                <option key={index} value={bed}>{bed === 'All Sizes' ? bed : `${bed} Bedroom${bed > 1 ? 's' : ''}`}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>MAX PRICE</label>
            <select 
              name="maxPrice" 
              value={filters.maxPrice}
              onChange={handleFilterChange}
            >
              <option value="">Any Price</option>
              <option value="100000">$100,000</option>
              <option value="300000">$300,000</option>
              <option value="500000">$500,000</option>
              <option value="1000000">$1,000,000</option>
            </select>
          </div>

          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedListings = () => {
  const [properties, setProperties] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProperties = async (filters = {}) => {
    try {
      setLoading(true);
      let url = 'http://localhost:7000/api/properties/getAllProperties';
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.location) queryParams.append('city', filters.location);
      if (filters.propertyType) queryParams.append('description', filters.propertyType);
      if (filters.bedrooms) queryParams.append('bedroom', filters.bedrooms);
      if (filters.maxPrice) queryParams.append('price[lte]', filters.maxPrice);
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      
      const response = await axios.get(url);
      setProperties(response.data.properties || []);
      setVisibleCount(3); // Reset visible count when new search
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => Math.min(prevCount + 3, properties.length));
  };

  const handleCardClick = (id) => {
    navigate(`/property/${id}`);
  };

  if (loading && properties.length === 0) {
    return (
      <Container className="my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading properties...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="text-center mb-5">
        <h2 className="mb-3">Explore Our Properties</h2>
        <p className="lead">Enjoy the variety of {properties.length} Different properties in the market!</p>
      </div>

      {properties.length === 0 ? (
        <div className="text-center my-5">
          <h4>No properties found matching your criteria</h4>
          <Button 
            variant="outline-primary" 
            onClick={() => fetchProperties()}
            className="mt-3"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {properties.slice(0, visibleCount).map((property) => (
              <Col key={property.id}>
                <Card
                  className="h-100 overflow-hidden property-card"
                  onClick={() => handleCardClick(property.id)}
                >
                  <div className="position-relative" style={{ borderRadius: "10px", overflow: "hidden" }}>
                    <Card.Img
                      variant="top"
                      src={property.image ? `http://localhost:7000/uploads/${property.image}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={property.title}
                      style={{
                        height: "250px",
                        objectFit: "cover",
                        borderRadius: "10px"
                      }}
                    />
                    <div className="position-absolute top-0 start-0 m-3">
                      <span className="badge text-white py-2 px-3" style={{ backgroundColor: '#429283' }}>
                        {property.type}
                      </span>
                    </div>
                    <div
                      className="position-absolute bottom-0 start-0 w-100 px-3 py-2"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                        height: "auto",
                        minHeight: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "0 0 10px 10px",
                        color: "white",
                        fontSize: "0.9em"
                      }}
                    >
                      <span className="d-flex align-items-center">
                        <FaBed className="me-1" /> {property.bedroom || 'N/A'} &nbsp;
                        <FaShower className="me-1" /> {property.bathroom || 'N/A'} &nbsp;
                        <FaRulerCombined className="me-1" /> {property.size || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <Card.Body>
                    <Card.Title className="h5 text-start">{property.title}</Card.Title>
                    <Card.Text className="text-muted small text-start">
                      <FaMapMarkerAlt className="me-1" />
                      {property.address}
                    </Card.Text>
                    <Card.Text className="text-start fw-bold">
                      ${property.price ? property.price.toLocaleString() : 'Price not available'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {visibleCount < properties.length && (
            <div className="d-flex justify-content-center mt-4">
              <Button
                variant="outline-primary"
                className="px-4 py-2"
                onClick={handleLoadMore}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

const CombinedComponent = () => {
  return (
    <>
      <HeroSectionWithSearch onSearch={(filters) => {
        const featuredListings = document.getElementById('featured-listings');
        if (featuredListings) {
          featuredListings.scrollIntoView({ behavior: 'smooth' });
        }
      }} />
      <FeaturedListings id="featured-listings" />
    </>
  );
};

export default CombinedComponent;