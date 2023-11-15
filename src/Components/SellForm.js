import async from "hbs/lib/async";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

function SellForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    streetAddress: "",
    fullName: "",
    email: "",
    age: "",
    street: "",
    homeType: "",
    beds: "",
    bath: "",
    area: "",
    landArea: "",
    apartmentCondition: "",
    homeTourLink: "",
    contactNumber: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const returnToHomePage = (e) => {
    e.preventDefault();

    navigate("/");
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.fullName.trim() === "") {
      newErrors.fullName = "Full name is required";
    }
    if (formData.email.trim() === "") {
      newErrors.email = "Email address is required";
    }
    if (!/^\d+$/.test(formData.age)) {
      newErrors.age = "Age must be a valid number";
    }
    if (formData.street.trim() === "") {
      newErrors.street = "Street address is required";
    }
    if (formData.homeType.trim() === "") {
      newErrors.homeType = "Home type is required";
    }
    if (!/^\d+$/.test(formData.beds)) {
      newErrors.beds = "Beds must be a valid number";
    }
    if (!/^\d+$/.test(formData.bath)) {
      newErrors.bath = "Bath must be a valid number";
    }
    if (!/^\d+$/.test(formData.area)) {
      newErrors.area = "Area must be a valid number";
    }
    if (!/^\d+$/.test(formData.landArea)) {
      newErrors.landArea = "Land area must be a valid number";
    }
    if (formData.apartmentCondition === "") {
      newErrors.apartmentCondition = "Apartment Condition is required";
    }
    if (formData.homeTourLink.trim() === "") {
      newErrors.homeTourLink = "Home tour link is required";
    }
    if (!/^\d+$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number must be a valid number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Submit the form data or navigate to the next page
      navigate("/home");
    }
  };

  // Backend intgration starts here
  // this is the basic sructure of post data, we need to include some more form inputs to get the required data

  const submitFormData = async () => {
    try {
      const dataToBeSent = {
        CommunityID: "3",
        CommunityName: "town and county",
        CommDistanceFromCollege: 2.5,
        CommStAddress: "123 Main St",
        CommCity: "Sample City",
        State: "Sample State",
        Zipcode: "12345",
        CommLocation: {
          latitude: 40.7128,
          longitude: -74.006,
        },
        BusesToCollege: [6, 9, 1],
        CommunityRules: ["Rule1", "Rule2"],
        CommunityFeatures: [
          "Swimming Pool and Sundeck",
          "Dogs and Cats are Welcome",
        ],
        CommApartments: {
          ApartmentID: "A101",
          AptName: "Sample Apartment",
          AptUnits: {
            UnitNumber: "101",
            UnitPrice: 1500,
            Bedrooms: 2,
            Bathrooms: 1,
            SQFT: 1000,
            IsAvailable: true,
            Leaseperiod: 12,
            UnitModeling: {
              Old: true,
              New: false,
              remodeled: false,
            },
            Unit_Images: ["image1.jpg", "image2.jpg"],
            HomeTourLink: "http://example.com/tour",
            UnitFeatures: ["Spacious Living Room", "Built-In Bookcases"],
          },
        },
      };

      const response = await fetch(
        "http://localhost:5000/communityData/postCommunityData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToBeSent),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      // Handle errors here
      console.error("Error submitting form data:", error);
    }
  };

  // Backend intgration ends here
  return (
    <div style={{ display: "block", width: 700, padding: 30 }}>
      <h4>Seller Form</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Enter street address:</Form.Label>
          <Form.Control
            type="text"
            name="streetAddress"
            placeholder="Enter your street address"
            value={formData.streetAddress}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter your full name:</Form.Label>
          <Form.Control
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          {errors.fullName && (
            <div className="text-danger">{errors.fullName}</div>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter your email address:</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter your age:</Form.Label>
          <Form.Control
            type="number"
            name="age"
            placeholder="Enter your age"
            value={formData.age}
            onChange={handleInputChange}
          />
          {errors.age && <div className="text-danger">{errors.age}</div>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter street address:</Form.Label>
          <Form.Control
            type="text"
            name="street"
            placeholder="Enter your street address"
            value={formData.street}
            onChange={handleInputChange}
          />
          {errors.street && <div className="text-danger">{errors.street}</div>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter home type:</Form.Label>
          <Form.Control
            type="text"
            name="homeType"
            placeholder="Enter home type"
            value={formData.homeType}
            onChange={handleInputChange}
          />
          {errors.homeType && (
            <div className="text-danger">{errors.homeType}</div>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter beds:</Form.Label>
          <Form.Control
            type="number"
            name="beds"
            placeholder="Enter beds"
            value={formData.beds}
            onChange={handleInputChange}
          />
          {errors.beds && <div className="text-danger">{errors.beds}</div>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter bath:</Form.Label>
          <Form.Control
            type="number"
            name="bath"
            placeholder="Enter bath"
            value={formData.bath}
            onChange={handleInputChange}
          />
          {errors.bath && <div className="text-danger">{errors.bath}</div>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter area:</Form.Label>
          <Form.Control
            type="number"
            name="area"
            placeholder="Enter area"
            value={formData.area}
            onChange={handleInputChange}
          />
          {errors.area && <div className="text-danger">{errors.area}</div>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter land area:</Form.Label>
          <Form.Control
            type="number"
            name="landArea"
            placeholder="Enter land area"
            value={formData.landArea}
            onChange={handleInputChange}
          />
          {errors.landArea && (
            <div className="text-danger">{errors.landArea}</div>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label>Apartment Condition:</Form.Label>
          <Form.Select
            name="apartmentCondition"
            aria-label="Apartment Condition"
            value={formData.apartmentCondition}
            onChange={handleInputChange}
          >
            <option value="">Select Apartment Condition</option>
            <option value="1">New</option>
            <option value="2">Old</option>
            <option value="3">Remodeled</option>
          </Form.Select>
          {errors.apartmentCondition && (
            <div className="text-danger">{errors.apartmentCondition}</div>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label>Home tour link:</Form.Label>
          <Form.Control
            type="text"
            name="homeTourLink"
            placeholder="Enter home tour link"
            value={formData.homeTourLink}
            onChange={handleInputChange}
          />
          {errors.homeTourLink && (
            <div className="text-danger">{errors.homeTourLink}</div>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter your contact number:</Form.Label>
          <Form.Control
            type="number"
            name="contactNumber"
            placeholder="Enter contact number"
            value={formData.contactNumber}
            onChange={handleInputChange}
          />
          {errors.contactNumber && (
            <div className="text-danger">{errors.contactNumber}</div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" onClick={submitFormData}>
          Click here to submit form
        </Button>
        <Button variant="danger" type="button" onClick={returnToHomePage}>
          Cancel
        </Button>
      </Form>
    </div>
  );
}

export default SellForm;
