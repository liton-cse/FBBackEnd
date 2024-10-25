import Header from "./Header";
import "../style-pages/home.css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
function Home() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({ description: '', image: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get('http://localhost:3000/api/homes');
    setItems(response.data);
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setFormData({ description: '', image: '' });
    setEditIndex(null);
    setShow(false);
  };

  const handleAdd = async () => {
    const data = new FormData();
    data.append('description', formData.description);
    data.append('image', formData.image);
    try{
      
       await axios.post('http://localhost:3000/api/home',data , {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchItems();
      //setItems([...items, response.data]);
      handleClose();
      alert('Upload successful');
    }catch(error){
      if (error.response) {
        console.log('Response error:', error.response.data);
    } else if (error.request) {
        console.log('Request error:', error.request);
    } else {
        console.log('Error', error.message);
    }
    }
    
  };

  const handleEdit = (id) => {
    const item = items.find(item => item._id === id);
    setFormData({ description: item.description, image: null });
    setEditIndex(id);
    handleShow();
  };

  const handleUpdate = async () => {
    const data = new FormData();
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      await axios.put(`http://localhost:3000/api/home/${editIndex}`, data, {
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/home/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  };
  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="container mt-5 home-main">
      <h2>Admin Panel</h2>
      <Button variant="success" className="add-button" onClick={handleShow}>Add Item</Button>
      <Table striped bordered hover className="mt-3 table-main">
        <thead className="table-head">
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item.description.length>120 ? item.description.substring(0, 120) + "..."
                      : item.description}</td>
              <td>  <img src={`http://localhost:3000/home-image/${item.image.split('/').pop()}`} alt="Item" style={{ width: '50px' }} /></td>
              <td>
                <Button variant="warning" className="me-4" onClick={() => handleEdit(item._id,)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title className="modal-title">{editIndex !== null ? 'Edit Item' : 'Add Item'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <Form>
            <Form.Group controlId="formDescription">
              <Form.Label className="form-label">Description:</Form.Label>
              <Form.Control
                as="textarea" rows={10}
                name= "description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="enter description"
              />
            </Form.Group>
            <Form.Group controlId="formImage" className="mt-3">
              <Form.Label>Image:</Form.Label>
              <Form.Control
                type="file"
                name="file"
                //value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="success" onClick={editIndex !== null ? handleUpdate : handleAdd}>
            {editIndex !== null ? 'Update' : ' Add '}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
}
export default Home;
