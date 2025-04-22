import Header from "./Header";
import "../style-pages/home.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
function Slider() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    image: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get(
      "https://fbbackend-server.onrender.com/api/slider"
    );
    setItems(response.data);
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setFormData({ title: "", subTitle: "", image: "" });
    setEditIndex(null);
    setShow(false);
  };

  const handleAdd = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("subTitle", formData.subTitle);
    data.append("image", formData.image);
    try {
      await axios.post(
        "https://fbbackend-server.onrender.com/api/slider",
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
    setFormData({ title: item.title, subTitle: item.subTitle, image: null });
    setEditIndex(id);
    handleShow();
  };

  const handleUpdate = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("subTitle", formData.subTitle);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await axios.put(
        `https://fbbackend-server.onrender.com/api/slider/${editIndex}`,
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
        `https://fbbackend-server.onrender.com/api/slider/${id}`
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
              <th>Title</th>
              <th>Sub Title</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>
                  {item.title.length > 50
                    ? item.title.substring(0, 50) + "..."
                    : item.title}
                </td>
                <td>
                  {item.subTitle.length > 120
                    ? item.subTitle.substring(0, 120) + "..."
                    : item.subTitle}
                </td>
                <td>
                  {" "}
                  <img
                    src={`https://fbbackend-server.onrender.com/slider-image/${item.image
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
                <Form.Label className="form-label">Title:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter Title..."
                />
              </Form.Group>
              <Form.Group controlId="formSubTitle">
                <Form.Label className="form-label">Sub-Title:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={9}
                  name="subTitle"
                  value={formData.subTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subTitle: e.target.value })
                  }
                  placeholder="Enter Sub-Title..."
                />
              </Form.Group>
              <Form.Group controlId="formImage" className="mt-3">
                <Form.Label>Image:</Form.Label>
                <Form.Control
                  type="file"
                  name="file"
                  //value={formData.image}
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
export default Slider;
