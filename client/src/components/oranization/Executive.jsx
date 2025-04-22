import Header from "../pages/Header";
import "../style-pages/home.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
function Executive() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    email: "",
    phoneNumber: "",
    facebookLink: "",
    bloodGroup: "",
    image: "",
    state: "",
    district: "",
    subDistrict: "",
    village: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get(
      "https://fbbackend-server.onrender.com/organization/executive"
    );
    setItems(response.data);
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setFormData({
      name: "",
      designation: "",
      email: "",
      phoneNumber: "",
      facebookLink: "",
      bloodGroup: "",
      image: "",
      state: "",
      district: "",
      subDistrict: "",
      village: "",
    });
    setEditIndex(null);
    setShow(false);
  };

  const handleAdd = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("designation", formData.designation);
    data.append("email", formData.email);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("facebookLink", formData.facebookLink);
    data.append("bloodGroup", formData.bloodGroup);
    data.append("image", formData.image);
    data.append(
      "address",
      JSON.stringify({
        state: formData.state,
        district: formData.district,
        subDistrict: formData.subDistrict,
        village: formData.village,
      })
    );

    try {
      await axios.post(
        "https://fbbackend-server.onrender.com/organization/executive",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchItems();
      handleClose();
      alert("Upload successful");
    } catch (error) {
      if (error.response) {
        console.log("Response error:", error.response.data);
      } else if (error.request) {
        console.log("Request error:", error.request);
      } else {
        console.log("Error", error.message);
      }
    }
  };
  const handleEdit = (id) => {
    const item = items.find((item) => item._id === id);
    setFormData({
      name: item.name,
      designation: item.designation,
      email: item.email,
      phoneNumber: item.phoneNumber,
      facebookLink: item.facebookLink,
      bloodGroup: item.bloodGroup,
      image: null,
      state: item.address.state,
      district: item.address.district,
      subDistrict: item.address.subDistrict,
      village: item.address.village,
    });
    setEditIndex(id);
    handleShow();
  };
  const handleUpdate = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("designation", formData.designation);
    data.append("email", formData.email);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("facebookLink", formData.facebookLink);
    data.append("bloodGroup", formData.bloodGroup);
    if (formData.image) {
      data.append("image", formData.image);
    }
    data.append(
      "address",
      JSON.stringify({
        state: formData.state,
        district: formData.district,
        subDistrict: formData.subDistrict,
        village: formData.village,
      })
    );

    try {
      await axios.put(
        `https://fbbackend-server.onrender.com/organization/executive/${editIndex}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchItems();
      handleClose();
      alert("Update successful");
    } catch (error) {
      console.error("Error during update:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://fbbackend-server.onrender.com/organization/executive/${id}`
      );
      setItems(items.filter((item) => item._id !== id));
      alert("Delete successful");
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="container mt-5 home-main">
        <h2>Admin Panel</h2>
        <Button variant="success" className="add-button" onClick={handleShow}>
          Add Item
        </Button>
        <Table striped bordered hover className="mt-3 table-main">
          <thead className="table-head">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Designation</th>
              <th>Blood Group</th>
              <th>FB Link</th>
              <th>Image</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phoneNumber}</td>
                <td>{item.designation}</td>
                <td>{item.bloodGroup}</td>
                <td>{item.facebookLink}</td>
                <td>
                  {" "}
                  <img
                    src={`https://fbbackend-server.onrender.com/executive/${item.image
                      .split("/")
                      .pop()}`}
                    alt="Item"
                    style={{ width: "80px" }}
                  />
                </td>
                <td>
                  {item.address.state}, {item.address.district},
                  {item.address.subDistrict},{item.address.village}
                </td>
                <td>
                  <Button
                    variant="warning"
                    className="me-4 mb-2"
                    onClick={() => handleEdit(item._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton className="modal-header">
            <Modal.Title className="modal-title">
              {editIndex !== null ? "Edit Item" : "Add Item"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <Form>
              <Form.Group controlId="formName">
                <Form.Label className="form-label">Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="enter name"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formDesignation">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  placeholder="enter designation"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="enter email"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="0172025****"
                  required
                />
              </Form.Group>
              <Form.Group controlId="formFacebookLink">
                <Form.Label>Facebook Link</Form.Label>
                <Form.Control
                  type="text"
                  name="facebookLink"
                  value={formData.facebookLink}
                  onChange={(e) =>
                    setFormData({ ...formData, facebookLink: e.target.value })
                  }
                  placeholder="enter facebook link"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBloodGroup">
                <Form.Label>Blood Group</Form.Label>
                <Form.Control
                  as="select"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodGroup: e.target.value })
                  }
                  required
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formImage" className="mt-3">
                <Form.Label>Image:</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                />
              </Form.Group>

              <Form.Group controlId="formState">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  required
                  placeholder="enter your state"
                />
              </Form.Group>

              <Form.Group controlId="formDistrict">
                <Form.Label>District</Form.Label>
                <Form.Control
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  required
                  placeholder="enter district"
                />
              </Form.Group>

              <Form.Group controlId="formSubDistrict">
                <Form.Label>Upazila</Form.Label>
                <Form.Control
                  type="text"
                  name="subDistrict"
                  value={formData.subDistrict}
                  onChange={(e) =>
                    setFormData({ ...formData, subDistrict: e.target.value })
                  }
                  required
                  placeholder="enter upazila"
                />
              </Form.Group>

              <Form.Group controlId="formVillage">
                <Form.Label>Village</Form.Label>
                <Form.Control
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={(e) =>
                    setFormData({ ...formData, village: e.target.value })
                  }
                  required
                  placeholder="enter village"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              type="submit"
              variant="success"
              onClick={editIndex !== null ? handleUpdate : handleAdd}
            >
              {editIndex !== null ? "Update" : " Add "}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
export default Executive;
