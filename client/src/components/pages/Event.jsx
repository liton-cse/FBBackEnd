import Header from "./Header";
import "../style-pages/home.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
function Event() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
    image: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get(
      "https://fbbackend-server.onrender.com/api/events"
    );
    setItems(response.data);
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      location: "",
      date: "",
      image: "",
    });
    setEditIndex(null);
    setShow(false);
  };

  const handleAdd = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("date", formData.date);
    data.append("image", formData.image);
    try {
      await axios.post(
        "https://fbbackend-server.onrender.com/api/events",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchItems();
      //setItems([...items, response.data]);
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
      description: item.description,
      location: item.location,
      date: item.date,
      image: null,
    });
    setEditIndex(id);
    handleShow();
  };

  const handleUpdate = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("date", formData.date);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await axios.put(
        `https://fbbackend-server.onrender.com/api/events/${editIndex}`,
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
        `https://fbbackend-server.onrender.com/api/events/${id}`
      );
      setItems(items.filter((item) => item._id !== id));
      alert("Delete Successful");
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
        <h2>Admin Event</h2>
        <Button variant="success" className="add-button" onClick={handleShow}>
          Add Item
        </Button>
        <Table striped bordered hover className="mt-3 table-main">
          <thead className="table-head">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Location</th>
              <th>Date</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>
                  {item.name.length > 50
                    ? item.name.substring(0, 50) + "..."
                    : item.name}
                </td>
                <td>
                  {item.description.length > 120
                    ? item.description.substring(0, 120) + "..."
                    : item.description}
                </td>
                <td>{item.location}</td>
                <td>{item.date}</td>
                <td>
                  {" "}
                  <img
                    src={`https://fbbackend-server.onrender.com/event-image/${item.image
                      .split("/")
                      .pop()}`}
                    alt="Item"
                    style={{ width: "80px" }}
                  />
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
              <Form.Group controlId="formTitle">
                <Form.Label className="form-label">Name:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="enter name"
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label className="form-label">Description:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="enter description"
                />
              </Form.Group>
              <Form.Group controlId="formLocation">
                <Form.Label className="form-label">Location:</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="enter location name"
                />
              </Form.Group>
              <Form.Group controlId="formDate">
                <Form.Label className="form-label">Date:</Form.Label>
                <Form.Control
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  placeholder="enter date"
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

export default Event;
