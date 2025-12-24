import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './ErrorRedirect.css';

const ErrorRedirect = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, [navigate]);

  const handleRedirectNow = () => {
    navigate('/');
  };

  return (
    <Container className="my-5 py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="error-card">
            <Card.Body className="text-center">
              <div className="error-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <Card.Title className="error-title">Oops! Page Not Found</Card.Title>
              <Card.Text className="error-message">
                The page you are looking for doesn't exist or has been moved.
              </Card.Text>
              <div className="countdown-container">
                <div className="countdown-circle">
                  <span className="countdown-number">{countdown}</span>
                </div>
              </div>
              <Card.Text className="redirect-message">
                Redirecting to home page in {countdown} seconds...
              </Card.Text>
              <Button 
                variant="primary" 
                className="redirect-btn"
                onClick={handleRedirectNow}
              >
                Go to Home Page Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorRedirect;
