import axios from 'axios';
import React, { useState, useEffect } from 'react';

function HealthPackagesForm(
    { onPackagesFetched }
) {
    const [newPackage, setNewPackage] = useState({
        name: '',
        price: '',
        services: '',
    });

    const handleSubmit = () => {
       
        // Send a POST request to create the new health package
        axios.post('http://localhost:4000/createPackage', newPackage, {
            withCredentials: true
        })
            .then((response) => {
                console.log('Package created successfully:', response.data, {
                    withCredentials: true
                });
                // Reset the new package form
                setNewPackage({
                    name: '',
                    price: '',
                    services: '',
                });
                // Fetch the updated list of health packages
            })
    };

    return (

        <div className="form-container">
            <h2>Create New Health Package</h2>

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
            <div className="form-group">
                <button onClick={handleSubmit}>Create</button>
            </div>
        </div>

    );
}

export default HealthPackagesForm;