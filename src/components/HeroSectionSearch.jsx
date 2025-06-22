import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Spinner 
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  FaBed, 
  FaShower, 
  FaRulerCombined, 
  FaMapMarkerAlt,
  FaSyncAlt 
} from 'react-icons/fa';
import '../Css/HeroSectionWithSearch.css';

// Top-level imports remain unchanged

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
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/properties/getAllProperties');
        const properties = response.data.properties;

        const cities = [...new Set(properties.map(p => p.city))].filter(Boolean).sort();
        const types = [...new Set(properties.map(p => p.type))].filter(Boolean).sort();
        const bedrooms = [...new Set(properties.map(p => p.bedroom))].filter(Boolean).sort((a, b) => a - b);

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
      [name]: value.includes('All') ? '' : value
    }));
  };

  const handleSearch = () => {
    const searchParams = {
      ...filters,
      propertyType:
        activeTab === 'FOR RENT' ? 'For Rent' :
        activeTab === 'FOR SALE' ? 'For Sale' : ''
    };
    onSearch(searchParams);
  };

  // ✅ FIXED: New function to handle search with specific tab
  const handleSearchWithTab = (tab) => {
    const searchParams = {
      ...filters,
      propertyType:
        tab === 'FOR RENT' ? 'For Rent' :
        tab === 'FOR SALE' ? 'For Sale' : ''
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
          {['ALL UNITS', 'FOR RENT', 'FOR SALE'].map(tab => (
            <button
              key={tab}
              className={`property-option ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                // ✅ FIXED: Use the new function instead of setTimeout
                handleSearchWithTab(tab);
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="search-filters">
          <div className="filter-group">
            <label>PROPERTY TYPE</label>
            <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange}>
              {filterOptions.types.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>LOCATION</label>
            <select name="location" value={filters.location} onChange={handleFilterChange}>
              {filterOptions.cities.map((city, idx) => (
                <option key={idx} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>BEDROOMS</label>
            <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange}>
              {filterOptions.bedrooms.map((bed, idx) => (
                <option key={idx} value={bed}>
                  {bed === 'All Sizes' ? bed : `${bed} Bedroom${bed > 1 ? 's' : ''}`}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>MAX PRICE</label>
            <select name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange}>
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

// ✅ Fix starts here: added `triggerSearch` as a prop
const FeaturedListings = ({ filters, triggerSearch }) => {
  const [properties, setProperties] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = 'http://localhost:7000/api/properties/getAllProperties';
      const queryParams = new URLSearchParams();

      if (filters?.location) queryParams.append('city', filters.location);
      if (filters?.propertyType) queryParams.append('type', filters.propertyType);
      if (filters?.bedrooms) queryParams.append('bedroom', filters.bedrooms);
      if (filters?.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

      if (queryParams.toString()) url += `?${queryParams.toString()}`;
      console.log('Making API call to:', url);
      
      const response = await axios.get(url);
      console.log('API response:', response);
      setProperties(response.data.properties || []);
      setVisibleCount(3);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Re-fetch on search trigger
  useEffect(() => {
    fetchProperties();
  }, [triggerSearch]);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 3, properties.length));
  };

  const handleCardClick = (id) => {
    navigate(`/property/${id}`);
  };

  const handleRefresh = () => {
    fetchProperties();
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300x200?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath;
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading properties...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5 text-center">
        <div className="alert alert-danger">{error}</div>
        <Button variant="primary" onClick={handleRefresh} className="mt-3">
          <FaSyncAlt className="me-2" />
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5" id="featured-listings">
      <div className="text-center mb-5">
        <h2>Explore Our Properties</h2>
        <p className="lead">
          {properties.length > 0 
            ? `Browse our collection of ${properties.length} properties`
            : 'No properties currently available'}
        </p>
      </div>

      {properties.length === 0 && !loading ? (
        <div className="text-center my-5">
          <h4>No properties found matching your criteria</h4>
          <Button variant="outline-primary" onClick={handleRefresh} className="mt-3">
            <FaSyncAlt className="me-2" />
            Refresh Properties
          </Button>
        </div>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {properties.slice(0, visibleCount).map((property) => (
              <Col key={property._id || property.id}>
                <Card className="h-100 overflow-hidden property-card shadow-sm"
                      onClick={() => handleCardClick(property._id || property.id)}>
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={getImageUrl(property.image)}
                      alt={property.title}
                      style={{ height: '250px', objectFit: 'cover', cursor: 'pointer' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                    <div className="position-absolute top-0 start-0 m-3">
                      <span className="badge text-white py-2 px-3" style={{ backgroundColor: '#429283' }}>
                        {property.type}
                      </span>
                    </div>
                    <div className="position-absolute bottom-0 start-0 w-100 px-3 py-2 bg-dark bg-opacity-75 text-white">
                      <div className="d-flex justify-content-between">
                        <span><FaBed className="me-1" />{property.bedroom || 'N/A'}</span>
                        <span><FaShower className="me-1" />{property.bathroom || 'N/A'}</span>
                        <span><FaRulerCombined className="me-1" />{property.size || 'N/A'} sqft</span>
                      </div>
                    </div>
                  </div>
                  <Card.Body>
                    <Card.Title className="text-truncate">{property.title}</Card.Title>
                    <Card.Text className="text-muted small mb-2">
                      <FaMapMarkerAlt className="me-1" />{property.address || 'Address not specified'}
                    </Card.Text>
                    <Card.Text className="fw-bold text-primary">
                      ${property.price?.toLocaleString() || 'Price not available'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {visibleCount < properties.length && (
            <div className="text-center mt-4">
              <Button variant="primary" onClick={handleLoadMore} size="lg">
                Load More Properties
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

// ✅ Wrapper component with search trigger toggle
const CombinedComponent = () => {
  const [filters, setFilters] = useState({});
  const [triggerSearch, setTriggerSearch] = useState(false);

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    setTriggerSearch(prev => !prev); // toggles search trigger
    const featuredListings = document.getElementById('featured-listings');
    if (featuredListings) {
      featuredListings.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <HeroSectionWithSearch onSearch={handleSearch} />
      <FeaturedListings filters={filters} triggerSearch={triggerSearch} />
    </>
  );
};

export default CombinedComponent;
