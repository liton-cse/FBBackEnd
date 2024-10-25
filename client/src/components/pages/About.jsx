import Header from "./Header";
import "../style-pages/home.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";

function About() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    objective: "",
    mission: "",
    vision: "",
    image: null, // Change to a single image
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get("http://localhost:3000/api/about");
    setItems(response.data);
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setFormData({
      objective: "",
      mission: "",
      vision: "",
      image: null, // Reset to null
    });
    setEditIndex(null);
    setShow(false);
  };

  const handleAdd = async () => {
    const data = new FormData();
    data.append("objective", formData.objective);
    data.append("mission", formData.mission);
    data.append("vision", formData.vision);
    if (formData.image) {
      data.append("image", formData.image); // Single image upload
    }

    try {
      await axios.post("http://localhost:3000/api/about", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchItems();
      handleClose();
      alert("Upload successful");
    } catch (error) {
      console.error("Error during upload:", error);
    }
  };

  const handleEdit = (id) => {
    const item = items.find((item) => item._id === id);
    setFormData({
      objective: item.objective,
      mission: item.mission,
      vision: item.vision,
      image: null, // Reset image for edit
    });
    setEditIndex(id);
    handleShow();
  };

  const handleUpdate = async () => {
    const data = new FormData();
    data.append("objective", formData.objective);
    data.append("mission", formData.mission);
    data.append("vision", formData.vision);
    if (formData.image) {
      data.append("image", formData.image); // Include image only if provided
    }

    try {
      await axios.put(`http://localhost:3000/api/about/${editIndex}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchItems();
      handleClose();
      alert("Update successful");
    } catch (error) {
      console.error("Error during update:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/about/${id}`);
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
              <th>Objective</th>
              <th>Mission</th>
              <th>Vision</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>
                  {item.objective.length > 50
                    ? item.objective.substring(0, 50) + "..."
                    : item.objective}
                </td>
                <td>
                  {item.mission.length > 120
                    ? item.mission.substring(0, 120) + "..."
                    : item.mission}
                </td>
                <td>
                  {item.vision.length > 120
                    ? item.vision.substring(0, 120) + "..."
                    : item.vision}
                </td>
                <td>
                  {/* Display the image */}
                  {item.image && (
                    <img
                      src={`http://localhost:3000/about-image/${item.image}`}
                      alt="About"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                  )}
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
              <Form.Group controlId="formObjective">
                <Form.Label className="form-label">Objective:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="objective"
                  value={formData.objective}
                  onChange={(e) =>
                    setFormData({ ...formData, objective: e.target.value })
                  }
                  placeholder="Enter objective..."
                />
              </Form.Group>
              <Form.Group controlId="formMission">
                <Form.Label className="form-label">Mission:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="mission"
                  value={formData.mission}
                  onChange={(e) =>
                    setFormData({ ...formData, mission: e.target.value })
                  }
                  placeholder="Enter mission..."
                />
              </Form.Group>
              <Form.Group controlId="formVision">
                <Form.Label className="form-label">Vision:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="vision"
                  value={formData.vision}
                  onChange={(e) =>
                    setFormData({ ...formData, vision: e.target.value })
                  }
                  placeholder="Enter vision..."
                />
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

export default About;
