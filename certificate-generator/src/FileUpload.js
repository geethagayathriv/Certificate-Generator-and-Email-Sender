import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState('');

    const onDrop = (acceptedFiles) =>{
        setFiles(acceptedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleSubmit = async () =>{
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files',file);
        });

        try{
            const response = await axios.post('/api/upload',formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error uploading files:',error);
            setMessage('Error uploading files');
        }
    };

    return(
        <div className='file-upload'>
            <div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                <p>Drag & drop files here, or click to select files</p>
            </div>
            <ul>
                {files.map((file) => (
                    <li key={file.path}>{file.path}</li>
                ))}
            </ul>
            <button onClick={handleSubmit}>Generate Certificates</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FileUpload;