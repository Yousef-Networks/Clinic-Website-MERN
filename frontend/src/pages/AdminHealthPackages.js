import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminHealthPackages = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [updatedPackage, setUpdatedPackage] = useState({
    name: '',
    price: '',
    services: '',
  });
  const [newPackage, setNewPackage] = useState({
    name: '',
    price: '',
    services: '',
  });

  useEffect(() => {
    // Fetch the list of health packages from the server
    axios.get('http://localhost:4000/getPackages',{
      withCredentials: true
    })
      .then((response) => {
        setPackages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching health packages:', error);
      });
  }, []);

  const handlePackageSelect = (packageId) => {
    // Find the selected package by ID
    const packageToUpdate = packages.find((pkg) => pkg._id === packageId);
    setSelectedPackage(packageToUpdate);
    setUpdatedPackage({
      name: packageToUpdate.name,
      price: packageToUpdate.price,
      services: packageToUpdate.services,
    });
  };

  const handleUpdatePackage = () => {
    // Send a PUT request to update the selected package
    axios.put(`http://localhost:4000/updatePackage?id=${selectedPackage._id}`, updatedPackage,{
      withCredentials: true
    })
      .then((response) => {
        console.log('Package updated successfully:', response.data);
        // Reset the selected package and updated package state
        setSelectedPackage(null);
        setUpdatedPackage({
          name: '',
          price: '',
          services: '',
        });
        // Fetch the updated list of health packages
        axios.get('http://localhost:4000/getPackages',{
          withCredentials: true
        })
          .then((response) => {
            setPackages(response.data);
          })
          .catch((error) => {
            console.error('Error fetching health packages:', error);
          });
      })
      .catch((error) => {
        console.error('Error updating health package:', error);
      });
  };

  const handleDeletePackage = (packageId) => {
    // Send a DELETE request to delete the selected package
    axios.delete(`http://localhost:4000/deletePackage?id=${packageId}`,{
      withCredentials: true
    })
      .then((response) => {
        console.log('Package deleted successfully:', response.data);
        // Fetch the updated list of health packages after deletion
        axios.get('http://localhost:4000/getPackages',{
          withCredentials: true
        })
          .then((response) => {
            setPackages(response.data);
          })
          .catch((error) => {
            console.error('Error fetching health packages:', error);
          });
      })
      .catch((error) => {
        console.error('Error deleting health package:', error);
      });
  };
  const handleCreatePackage = () => {
    // Send a POST request to create the new health package
    axios.post('http://localhost:4000/createPackage', newPackage,{
      withCredentials: true
    })
      .then((response) => {
        console.log('Package created successfully:', response.data,{
          withCredentials: true
        });
        // Reset the new package form
        setNewPackage({
          name: '',
          price: '',
          services: '',
        });
        // Fetch the updated list of health packages
        axios.get('http://localhost:4000/getPackages',{
          withCredentials: true
        })
          .then((response) => {
            setPackages(response.data);
          })
          .catch((error) => {
            console.error('Error fetching health packages:', error);
          });
      })
      .catch((error) => {
        console.error('Error creating health package:', error);
      });
  };

  return (
    <div>
      <h2>Health Packages</h2>
      <ul>
        {packages.map((packagee) => (
          <li key={packagee._id}>
            {packagee.name} - ${packagee.price} - {packagee.services}
            <button onClick={() => handlePackageSelect(packagee._id)}>Edit</button>
            <button onClick={() => handleDeletePackage(packagee._id)}>Delete</button>
          </li>
        ))}
      </ul>
      {selectedPackage && (
        <div>
          <h3>Edit Package</h3>
          <input
            type="text"
            placeholder="Name"
            value={updatedPackage.name}
            onChange={(e) => setUpdatedPackage({ ...updatedPackage, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Price"
            value={updatedPackage.price}
            onChange={(e) => setUpdatedPackage({ ...updatedPackage, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Services"
            value={updatedPackage.services}
            onChange={(e) => setUpdatedPackage({ ...updatedPackage, services: e.target.value })}
          />
          <button onClick={handleUpdatePackage}>Update</button>
        </div>

      )}
      <div>
        <h3>Create New Package</h3>
        <input
          type="text"
          placeholder="Name"
          value={newPackage.name}
          onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Price"
          value={newPackage.price}
          onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Services"
          value={newPackage.services}
          onChange={(e) => setNewPackage({ ...newPackage, services: e.target.value })}
        />
        <button onClick={handleCreatePackage}>Create</button>
      </div>
    </div>
  );
};

export default AdminHealthPackages;

//  this is an admin page
