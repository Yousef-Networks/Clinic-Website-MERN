import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './PendingDoctorPage.css'; // Import your custom styles

const PendingDoctorPage = () => {
  const { username } = useParams();
  const [PDoctor, setPDoctor] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/getPDoctor/${username}`, {
          withCredentials: true,
        });
        console.log(response.data);

        if (response.status === 200) {
          setPDoctor(response.data);
        }
      } catch (error) {
        console.error('Error fetching Pending Doctor:', error);
      }
    };

    fetchPDoctor();
  }, [username]);

  const handleAccept = async () => {
    try {
      const r = {
        username,
        name: PDoctor.name,
        email: PDoctor.email,
        password: PDoctor.password,
        date_of_birth: PDoctor.date_of_birth,
        hourly_rate: PDoctor.hourly_rate,
        speciality: PDoctor.speciality,
        Affiliation: PDoctor.Affiliation,
        educational_background: PDoctor.educational_background,
      };
      await axios.post(`http://localhost:4000/register/doctor`, r, {
        withCredentials: true,
      });
      await axios.delete(`http://localhost:4000/deletePDoctor/${username}`, {
        withCredentials: true,
      });
      navigate('/login');
    } catch (error) {
      console.error('Error accepting employment contract', error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.delete(`http://localhost:4000/deletePDoctor/${username}`, {
        withCredentials: true,
      });
      navigate('/login');
    } catch (error) {
      console.error('Error rejecting employment contract', error);
    }
  };

  return (
    <div className="employment-contract">
      <h1>EMPLOYMENT AGREEMENT</h1>
      <p>
        THIS AGREEMENT is made and entered into this day of Friday, 1/12/2023, by and between{' '}
        {PDoctor.name}, and The Clinic.
      </p>
      <section className="section">
        <h2>1. POSITION AND RESPONSIBILITIES</h2>
        <p>
          Employee is employed in the capacity of a Doctor. Employee's duties and responsibilities
          shall include providing medical care to patients, maintaining patient records, and other
          duties as required.
        </p>
      </section>
      <section className="section">
        <h2>2. TERM OF EMPLOYMENT</h2>
        <p>
          The term of this Agreement shall commence on 1/12/2023, and shall continue until
          1/12/2030 unless otherwise terminated in accordance with this Agreement.
        </p>
      </section>
      <section className="section">
        <h2>3. COMPENSATION</h2>
        <p>
          Employer shall pay Employee an Hourly Rate of {PDoctor.hourly_rate} payable in accordance
          with Employer's standard payroll practices and a Markup Value of 5 %.
        </p>
      </section>
      <section className="section">
        <h2>4. TERMINATION</h2>
        <p>Either party may terminate this Agreement upon providing written notice to the other party.</p>
      </section>
      <section className="section">
        <h2>5. GOVERNING LAW</h2>
        <p>This Agreement shall be governed by and construed in accordance with the laws of Egypt.</p>
      </section>
      <p>
        IN WITNESS WHEREOF, the parties have executed this Employment Agreement as of the date first
        above written.
      </p>
      <div className="button-container">
        <button className="accept-button" onClick={handleAccept}>
          Accept Employment Contract
        </button>
        <button className="reject-button" onClick={handleReject}>
          Reject Employment Contract
        </button>
      </div>
    </div>
  );
};

export default PendingDoctorPage;
