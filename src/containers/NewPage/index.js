import React, { useState, useEffect } from 'react';
import Modal from '../../components/UI/Modal';
import Layout from '../../components/Layout';
import Input from '../../components/UI/Input';
import { Container, Row, Col, Table } from 'react-bootstrap';
import linearCategories from '../../helpers/linearCategories';
import { useSelector, useDispatch } from 'react-redux';
import { createPage, deletePageById } from '../../actions';
import {
    IoIosCheckboxOutline,
    IoIosCheckbox,
    IoIosArrowForward,
    IoIosArrowDown,
    IoIosAdd,
    IoIosTrash,
    IoIosCloudUpload
} from 'react-icons/io';


/**
* @author
* @function NewPage
**/

const NewPage = (props) => {

    const [createModal, setCreateModal] = useState(false);
    const [title, setTitle] = useState('');
    const category = useSelector(state => state.category);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('');
    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch();
    const page = useSelector((state) => state.page);


    useEffect(() => {
        setCategories(linearCategories(category.categories));
    }, [category]);

    useEffect(() => {
        console.log(page);
        if (!page.loading) {
            setCreateModal(false);
            setTitle('');
            setCategoryId('');
            setDesc('');
            setProducts([]);
            setBanners([]);
        }
    }, [page]);

    const onCategoryChange = (e) => {
        const category = categories.find(category => category.value == e.target.value);
        setCategoryId(e.target.value);
        setType(category.type);
    }

    const handleBannerImages = (e) => {
        console.log(e);
        setBanners([...banners, e.target.files[0]]);
    }

    const handleProductImages = (e) => {
        console.log(e);
        setProducts([...products, e.target.files[0]]);
    }

    const submitPageForm = (e) => {
        //e.target.preventDefault();

        if (title === "") {
            alert('Title is required');
            setCreateModal(false);
            return;
        }

        const form = new FormData();
        form.append('title', title);
        form.append('description', desc);
        form.append('category', categoryId);
        form.append('type', type);
        banners.forEach((banner, index) => {
            form.append('banners', banner);
        });
        products.forEach((product, index) => {
            form.append('products', product);
        });

        dispatch(createPage(form));


    }

    const renderCreatePageModal = () => {
        return (
            <Modal
                show={createModal}
                modalTitle={'Create New Page'}
                handleClose={() => setCreateModal(false)}
                onSubmit={submitPageForm}
            >
                <Container>
                    <Row>
                        <Col>
                            {/* <select
                                className="form-control"
                                value={categoryId}
                                onChange={onCategoryChange}
                            >
                                <option value="">select category</option>
                                {
                                    categories.map(cat =>
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    )
                                }
                            </select> */}
                            <Input
                                type="select"
                                value={categoryId}
                                onChange={onCategoryChange}
                                options={categories}
                                placeholder={'Select Category'}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={'Page Title'}
                                className=""
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Input
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder={'Page Desc'}
                                className=""
                            />
                        </Col>
                    </Row>

                    {
                        banners.length > 0 ?
                            banners.map((banner, index) =>
                                <Row key={index}>
                                    <Col>{banner.name}</Col>
                                </Row>
                            ) : null
                    }
                    <Row>
                        <Col>
                            <Input
                                className="form-control"
                                type="file"
                                name="banners"
                                onChange={handleBannerImages}
                            />
                        </Col>
                    </Row>

                    {
                        products.length > 0 ?
                            products.map((product, index) =>
                                <Row key={index}>
                                    <Col>{product.name}</Col>
                                </Row>
                            ) : null
                    }
                    <Row>
                        <Col>
                            <Input
                                className="form-control"
                                type="file"
                                name="products"
                                onChange={handleProductImages}
                            />
                        </Col>
                    </Row>



                </Container>


            </Modal>

        );
    }

    const renderPages = () => {
        return (
            <Table style={{ fontSize: 12 }} responsive="sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {page.length > 0
                        ? page.map((page,i) => (
                            <tr key={page}>
                                <td>{i+1}</td>
                                <td>{page}</td>
                                <td>{page.category._id}</td>
                                <td>{page.description}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            const payload = {
                                                pageId: page._id,
                                            };
                                            dispatch(deletePageById(payload));
                                        }}
                                    >
                                        delete
                                    </button>
                                </td>
                            </tr>
                        ))
                        :null}
                </tbody>
            </Table>
        );
    };

    return (
        <Layout sidebar>
            {
                page.loading ?
                    <p>Creating Page...please wait</p>
                    :
                    <>
                        {renderCreatePageModal()}
                        <Container>
                            <Row>
                                <Col md={12}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <h3>Pages</h3>
                                        <button onClick={() => setCreateModal(true)}>Add</button>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>{renderPages()}</Col>
                            </Row>
                        </Container>


                    </>
            }

        </Layout>
    )

}

export default NewPage