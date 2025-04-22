import Header from "../pages/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
function Images() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    district: "",
    subDistrict: "",
    images: [],
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get(
      "https://fbbackend-server.onrender.com/gallary/images"
    );
    setItems(response.data);
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setFormData({ district: "", subDistrict: "", images: [] });
    setEditIndex(null);
    setShow(false);
  };

  const handleAdd = async () => {
    const data = new FormData();
    data.append("district", formData.district);
    data.append("subDistrict", formData.subDistrict);

    // Append each selected file to FormData
    Array.from(formData.images).forEach((image) => {
      data.append("images", image);
    });

    try {
      await axios.post(
        "https://fbbackend-server.onrender.com/gallary/images",
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
      console.error("Error during upload:", error);
      if (error.response) {
        console.log("Response error:", error.response.data);
      } else if (error.request) {
        console.log("Request error:", error.request);
      } else {
        console.log("Error", error.message);
      }
    }
  };
  /*
    const handleEdit = (id) => {
      const item = items.find(item => item._id === id);
      setFormData({ district: item.district, subDistrict: item.subDistrict, images: [] });
      setEditIndex(id);
      handleShow();
    };
  
    const handleUpdate = async () => {
      const data = new FormData();
      data.append('district', formData.district);
      data.append('subDistrict', formData.subDistrict);
      
      if (formData.images.length > 0) {
        Array.from(formData.images).forEach((image) => {
          data.append('images', image);
        });
      }
  
      try {
        await axios.put(`http://localhost:3000/gallary/images/${editIndex}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        fetchItems();
        handleClose();
        alert('Update successful');
      } catch (error) {
        console.error('Error during update:', error);
      }
    };
  */
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://fbbackend-server.onrender.com/gallary/images/${id}`
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
              <th>District</th>
              <th>Sub-District</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.district}</td>
                <td>{item.subDistrict}</td>
                <td>
                  {" "}
                  <img
                    src={`https://fbbackend-server.onrender.com/images/${
                      item.district
                    }/${item.subDistrict}/${item.imageUpd.split("/").pop()}`}
                    alt="Item"
                    style={{ width: "80px" }}
                  />
                </td>
                <td>
                  {/*<Button variant="warning" className="me-4 mb-2" onClick={() => handleEdit(item._id,)}>Edit</Button>*/}
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
                <Form.Label className="form-label">District:</Form.Label>
                <Form.Control
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  placeholder="enter district"
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label className="form-label">Upazila:</Form.Label>
                <Form.Control
                  type="text"
                  name="subDistrict"
                  value={formData.subDistrict}
                  onChange={(e) =>
                    setFormData({ ...formData, subDistrict: e.target.value })
                  }
                  placeholder="enter upazila"
                />
              </Form.Group>
              <Form.Group controlId="formImage" className="mt-3">
                <Form.Label>Image:</Form.Label>
                <Form.Control
                  type="file"
                  name="images"
                  multiple
                  onChange={(e) =>
                    setFormData({ ...formData, images: e.target.files })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="success" onClick={handleAdd}>
              Add
            </Button>

            {/* <Button type="submit" variant="success" onClick={editIndex !== null ? handleUpdate : handleAdd}>
            {editIndex !== null ? 'Update' : ' Add '}
          </Button>*/}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
export default Images;
