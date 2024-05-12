import { Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import InputField from './Custom/InputField';
import { areAllValuesEmpty } from '../utils';
import { v4 as uuidv4 } from "uuid";

function ProjectDetails() {
    let [projectData, setProjectData] = useState([])
    let [errors, setErrors] = useState({});


    const initialFormFields = {
        id: "",
        title: "",
        fileName: "",
        description: "",
        documentCategory: "",
        version: "",
        file:""
    };

    let [formFields, setFormFields] = useState(initialFormFields);


    const fetchData = async () => {
        try {
            const { data } = await axios.get("http://localhost:3001/PROJECT_DETAILS_ROW");
            setProjectData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);



    const columns = [
        // { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'title',
            headerName: 'Title',
            width: 200,
            editable: true,
        },
        {
            field: 'fileName',
            headerName: 'File Name',
            width: 200,
            editable: true,
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 250,
            editable: true,
        },
        {
            field: 'documentCategory',
            headerName: 'Document Category',
            width: 200,
            editable: true,
        },
        {
            field: 'version',
            headerName: 'Version',
            width: 110,
            editable: true,
        },
        {
            field: 'file',
            headerName: 'File',
            width: 150,
            editable: true,
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: (params) => (
                <>
                    <Button variant="contained" color="primary" onClick={() => handleButtonEdit(params)}>
                        Edit
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleButtonDelete(params)}>
                        Delete
                    </Button>
                </>
            )
        }
    ];




    const handleButtonEdit = (params) => {
        console.log("edit functionality");
        console.log(params.row);
        let {id, title, fileName, description,documentCategory, version} = params.row

        setFormFields({id, title, fileName, description, documentCategory, version})
    }

    // console.log(formFields);

    const handleButtonDelete = async (row) => {
        console.log("Delete functionality");
        let deleteId = row.id;

        try {
            await axios.delete(`http://localhost:3001/PROJECT_DETAILS_ROW/${deleteId}`);

            // Remove the deleted item from projectData state
            setProjectData(prevData => prevData.filter(item => item.id !== deleteId));

            console.log("Item deleted successfully");
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }



    function handleChange(e) {
        let { name, value } = e.target;

        setFormFields((prev) => {
            return { ...prev, [name]: value };
        });

        setErrors({
            ...errors,
            [name]: "",
        });
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (areAllValuesEmpty(formFields)) {
            Object.keys(formFields).forEach((fieldName) => {
                if (formFields[fieldName] === "") {
                    newErrors[fieldName] = `Please fill the required details`;
                }
                if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    return;
                }
            });
        } else {
            if (formFields.id) {
                console.log(formFields.id);
                console.log(formFields);
               
                await axios.put(
                    `http://localhost:3001/PROJECT_DETAILS_ROW/${formFields.id}`,
                    formFields
                );

                setFormFields(initialFormFields);
            } else {
                let id = uuidv4();
                let obj = { ...formFields, id };

                const { data } = await axios.post(
                    "http://localhost:3001/PROJECT_DETAILS_ROW",
                    obj
                );
                console.log("Data submitted:", data);
                setFormFields(initialFormFields);
            }
        }
    };

    useEffect(() => {
        fetchData();
      }, [formFields]);

    return (
        <div>
            <Box>
                <form className="form-container" onSubmit={handleSubmit}>
                    <h3>EDIT Form</h3>
                    <div style={{ display: "flex" }}>
                        <div className="input-container">
                            <InputField
                                label="Title"
                                type="text"
                                name="title"
                                value={formFields.title}
                                onChange={handleChange}
                                error={!!errors.title}
                            // helperText={errors.firstName}
                            />
                        </div>
                        <div className="input-container">
                            <InputField
                                label="File Name"
                                name="fileName"
                                type="text"
                                value={formFields.fileName}
                                onChange={handleChange}
                                error={!!errors.fileName}
                            // helperText={errors.lastName}
                            />
                        </div>

                    
                    </div>


                    <div className="input-container">
                        <InputField
                            label="Description"
                            type="text"
                            name="description"
                            value={formFields.description}
                            onChange={handleChange}
                            error={!!errors.description}
                        // helperText={errors.email}
                        />
                    </div>

                    <div className="input-container">
                        <InputField
                            label="Dcoument Category"
                            type="text"
                            name="documentCategory"
                            value={formFields.documentCategory}
                            onChange={handleChange}
                            error={!!errors.documentCategory}
                        // helperText={errors.street}
                        />
                    </div>


                    <div className="input-container">
                        <InputField
                            label="Version"
                            type="text"
                            name="version"
                            value={formFields.version}
                            onChange={handleChange}
                            error={!!errors.version}
                        // helperText={errors.state}
                        />
                    </div>

                    <div className="input-container">
                            <InputField
                                name="file"
                                type="file"
                                value={formFields.file}
                                onChange={handleChange}
                                error={!!errors.file}
                            // helperText={errors.lastName}
                            />
                        </div>



                    <div className="btn-box">
                        <Button
                            variant="contained"
                            color={formFields.id ? "secondary" : "primary"}
                            type="submit"
                        >
                            {formFields.id ? "UPDATE" : "SUBMIT"}
                        </Button>
                    </div>
                </form>
            </Box>

            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={projectData}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    disableRowSelectionOnClick
                />
            </Box>
        </div>
    )
}

export default ProjectDetails