import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,  useNavigate } from 'react-router-dom';
import BeatLoader from "react-spinners/BeatLoader";
import { Card, ListGroup,Button ,Row,Col} from 'react-bootstrap';


const AllPackages = () => {
  const { username } = useParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    async function fetchHealthPackages() {
        setLoading(true);
        try {
          const response = await axios.get('http://localhost:4000/getPackages',{
            withCredentials: true
          });
          if (response.status === 200) {
            setPackages(response.data);
          }
        } catch (error) {
          console.error('Error fetching health packages:', error);
        }
        setLoading(false);
      }
     
   fetchHealthPackages();
  }, [username]);
  const handleSubscribe = (packageId) => {
    navigate(`/packageDetails/${username}/${packageId}`);
  };



  return (
    <div className="container">
      <div className="patients-list">
        <h2>Health Packages</h2>
        {loading ? (
          <div className="spinner-container">
            <BeatLoader color="#14967f" size={15} />
          </div>
        ) : packages.length === 0 ? (
          <p>No Packages found</p>
        ) : (
            <Row>
          {packages.map((p) => (
            <Col md={4}>
              <Card className="mb-4 shadow-sm">
                <Card.Header as="h5" >{p.name}</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Cost:</strong> ${p.price}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Services:</strong> {p.services}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Discount:</strong> {p.discount}
                  </ListGroup.Item>
                </ListGroup>
                <Card.Footer>
                <Button variant="primary" block onClick={() => handleSubscribe(p._id)}>Subscribe</Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
        )}
      </div>
    </div>
  );
};

export default AllPackages;
