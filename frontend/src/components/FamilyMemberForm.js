import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const FamilyMemberFormForm = () => {
  const navigate = useNavigate();
  const { username } = useParams();

  const [name, setName] = useState('');
  const [national_id, setNational_id] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState(''); // Initialize gender state
  const [relation, setRelation] = useState(''); // Initialize relation state
  const [isAdded, setIsAdded] = useState(false); // Track if a family member is added
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mem = { name, national_id, age, gender, relation, patientUsername: username };
    try {
      const response = await axios.post('http://localhost:4000/addFamilyMember', mem,{
        withCredentials: true
      });

      if (response.status === 201) {
        console.log('Family member added successfully:', response.data);
        setName('');
        setNational_id('');
        setAge('');
        setGender('');
        setRelation('');
        setError(null);
        setIsAdded(true); // Set isAdded to true when family member is added
      } else {
        console.error('Family member addition failed:', response.data);
        // Handle and display errors to the user
      }
    } catch (error) {
      console.error('Family member addition failed:', error);
      // Handle and display errors to the user
    }
  };
  const handleBack = () => {
    // Navigate back to the previous page
    navigate(-1);
  };

  return (
    <div>
      <h2>Family Member Registration</h2>
      {isAdded && <p>Family member added successfully!</p>}
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="national_id">National ID</label>
          <input
            type="text"
            id="national_id"
            name="national_id"
            value={national_id}
            onChange={(e) => setNational_id(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="gender">Gender</label>
          {/* Use a select input for gender */}
          <select
            id="gender"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="relation">Relation</label>
          {/* Use a select input for relation */}
          <select
            id="relation"
            name="relation"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            required
          >
            <option value="">Select Relation</option>
            <option value="Wife">Wife</option>
            <option value="Child">Child</option>
            <option value="Husband">Husband</option>
          </select>
        </div>
        <button type="submit">Add</button>
      </form>
      <button onClick={handleBack}>Back</button> {/* Back button */}
    </div>
  );
};

export default FamilyMemberFormForm;
