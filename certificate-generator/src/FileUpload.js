import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const FileUpload = () => {
    const [excelFile, setExcelFile] = useState(null);
    const [docxFile, setDocxFile] = useState(null);
    const [message, setMessage] = useState('');

    const onExcelDrop = (acceptedFiles) =>{
        setExcelFile(acceptedFiles[0]);
    };

    const onDocxDrop = (acceptedFiles) =>{
        setDocxFile(acceptedFiles[0]);
    };

    const { getRootProps: getExcelRootProps, getInputProps: getExcelInputProps } = useDropzone({ onDrop: onExcelDrop, accept: '.xlsx, .xls' });

    const { getRootProps: getDocxRootProps, getInputProps: getDocxInputProps} = useDropzone({ onDrop: onDocxDrop, accept:'.docx'});

    const handleSubmit = async () =>{
        if(!excelFile || !docxFile){
            setMessage('Please upload both an Excel file and a DOCX file');
            return;
        }

        const formData = new FormData();
        formData.append('excelFile',excelFile);
        formData.append('docxFile',docxFile);

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
            <div {...getExcelRootProps({className: 'dropzone'})}>
                <input {...getExcelInputProps()} />
                <p>Drag your excel file here or click to select!</p>
            </div><br></br>
            <div {...getDocxRootProps({className: 'dropzone'})}>
                <input {...getDocxInputProps()} />
                <p>Drop your sample certificate docx file here or click to select!</p>
            </div>
            <ul>
                {excelFile && <li>Excel file: {excelFile.path}</li>}
                {docxFile && <li>DOCX file: {docxFile.path}</li>}
            </ul>
            <button onClick={handleSubmit}>Generate Certificates</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FileUpload;