

import { Document, Page } from 'react-pdf';

import React, { useState, useEffect } from 'react';



const RequestModal = ({ setOpenModal, request }) => {
    const [numPages, setNumPages] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    function binaryToBlob(binary, contentType) {
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < len; i++) {
          view[i] = binary.charCodeAt(i);
        }
        return new Blob([view], { type: contentType });
      }
      
      useEffect(() => {
        if (request.medicalLicense && request.medicalLicense.data) {
          const blob = binaryToBlob(request.medicalLicense.data, request.medicalLicense.contentType);
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
        }
      }, [request]);
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="titleCloseBtn">
                    <button
                        onClick={() => {
                            setOpenModal(false);
                        }}
                    >
                        X
                    </button>
                </div>
                <div className='title'>
                    <h1>Request</h1>
                </div>
                <div className="metadata">
                    <table style={{ fontSize: '16px' }}>
                        <tbody>
                            <tr><td><strong>Request ID:</strong></td><td>{request._id}</td></tr>
                            <tr><td><strong>Username:</strong></td><td>{request.username}</td></tr>
                            <tr><td><strong>Name:</strong></td><td>{request.name}</td></tr>
                            <tr><td><strong>Email:</strong></td><td>{request.email}</td></tr>
                            <tr><td><strong>Date of Birth:</strong></td><td>{request.date_of_birth} $</td></tr>
                            <tr><td><strong>Hourly Rate:</strong></td><td>{request.hourly_rate}</td></tr>
                            <tr><td><strong>Affiliation:</strong></td><td>{request.Affiliation}</td></tr>
                            <tr><td><strong>status:</strong></td><td>{request.status1}</td></tr>
                        </tbody>
                    </table>
                    {pdfUrl && (
                        <div>
                            <Document
                                file={pdfUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                            >
                                {Array.from(
                                    new Array(numPages),
                                    (el, index) => (
                                        <Page
                                            key={`page_${index + 1}`}
                                            pageNumber={index + 1}
                                        />
                                    ),
                                )}
                            </Document>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestModal;
