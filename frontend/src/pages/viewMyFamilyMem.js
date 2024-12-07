import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import { Card, ListGroup, Button, Container, Row, Col, Spinner ,OverlayTrigger,Popover} from 'react-bootstrap';

const FamilyMembersList = () => {
  const { username } = useParams();
  const navigate=useNavigate();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [linkedFamilyMembers, setLinkedFamilyMembers] = useState([]); // Add this line
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
       
        const response = await axios.get(`http://localhost:4000/getFamilyMem/${username}`,{
          withCredentials: true
        });
        console.log(response.data);

        if (response.status === 200) {
          setFamilyMembers(response.data);
        }
        const linkedResponse = await axios.get(`http://localhost:4000/getLinkedFamilyMembers/${username}`,{
          withCredentials: true
        });
        if (linkedResponse.status === 200) {
          setLinkedFamilyMembers(linkedResponse.data);
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, [username]);
  
  const FamilyMember = ({ member, isLinked }) => (
    <Card style={{ width: '18rem', marginBottom: '1rem' }}>
      <Card.Header as="h5">{isLinked ? member.linkedPatientName : member.name}</Card.Header>
      <ListGroup variant="flush">
        {!isLinked && (
          <>
            <ListGroup.Item>National ID: {member.national_id}</ListGroup.Item>
            <ListGroup.Item>Age: {member.age}</ListGroup.Item>
            <ListGroup.Item>Gender: {member.gender}</ListGroup.Item>
          </>
        )}
        <ListGroup.Item>Relation: {isLinked ? member.linkedPatientRelation : member.relation}</ListGroup.Item>
        {isLinked && (
 <Button
 variant="primary"

 onClick={() => {
   navigate(`/filterAppointmentsPatient/${member.linkedPatientUsername}`);
 }}
>
 View Appointments
</Button>
)}
      </ListGroup>
    </Card>
  );

 
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <h1 className="my-4 text-center">Family Members of {username}</h1>
          {loading ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
            <>
              <h2 className="my-3">Normal Family Members</h2>
              <Row>
                {familyMembers.length > 0 ? (
                  familyMembers.map(member => (
                    <Col sm={12} md={6} lg={4} xl={3} key={member._id}>
                      <FamilyMember member={member} />
                    </Col>
                  ))
                ) : (
                  <p>No normal family members found.</p>
                )}
              </Row>

              <h2 className="my-3">Linked Family Members</h2>
              <Row>
                {linkedFamilyMembers.length > 0 ? (
                  linkedFamilyMembers.map(member => (
                    <Col sm={12} md={6} lg={4} xl={3} key={member._id}>
                      <FamilyMember member={member} isLinked />
                    </Col>
                  ))
                ) : (
                  <p>No linked family members found.</p>
                )}
              </Row>
            </>
          )}
          <Button variant="primary" onClick={() => navigate(-1)}>Back</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default FamilyMembersList;