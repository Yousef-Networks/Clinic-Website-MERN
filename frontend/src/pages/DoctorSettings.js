import { Card, Col, Container, Nav, Row, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UpdateDoctorInfo from './updateDoctor';
import { useParams } from 'react-router-dom';
import ChangeDoctortPass from './changeDoctorPass';


const DoctorSettings = () => {
    const { username } = useParams();
    return (
        <>
        <Container style={{ padding: '10px' }}>
        <Row>
          <Col>
            <h1 style={{ marginBottom: '5px',fontSize: '20px',fontWeight: '600' }}>Account Settings</h1>
            <p style={{ marginBottom: '10px',fontSize: '15px',fontWeight: '500' }}>Change your account settings</p>
          </Col>
        </Row>
      </Container>
      <Container style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '20px' }}>
        <Tab.Container id="left-tabs-example" defaultActiveKey="account">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="account" style={{fontSize: '15px',fontWeight: '500' }}>Account</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="password" style={{fontSize: '15px',fontWeight: '500' }}>Password</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content style={{ width: '660px',marginTop: '0px' ,height:'470px' }}>
                <Tab.Pane eventKey="account" style={{ width: '660px',height:'405px' }}>
                  <UpdateDoctorInfo />
                </Tab.Pane>
                <Tab.Pane eventKey="password" style={{ width: '660px',height:'470px' }}>
                <ChangeDoctortPass />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </>

    )


};
export default DoctorSettings;