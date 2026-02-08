import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiCheck, FiX, FiCalendar, FiUser, FiPhone, FiMail, FiMapPin, FiFile, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createBooking } from '../services/api';

const FileDropzone = ({ onDrop, file, fileType, label, icon, accept, maxSize }) => {
    const onDropCallback = useCallback((acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
            fileRejections.forEach((rejection) => {
                rejection.errors.forEach((error) => {
                    if (error.code === 'file-too-large') {
                        toast.error(`File is too large. Max size is ${maxSize / 1024 / 1024}MB`);
                    } else if (error.code === 'file-invalid-type') {
                        toast.error('Invalid file type. Please upload PDF, JPG, or PNG');
                    } else {
                        toast.error(error.message);
                    }
                });
            });
        }
        onDrop(acceptedFiles);
    }, [onDrop, maxSize]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop: onDropCallback,
        accept,
        maxFiles: 1,
        maxSize,
        noClick: false,
        noKeyboard: false,
    });

    return (
        <div className="space-y-2">
            <label className="input-label flex items-center">
                {icon}
                <span className="ml-2">{label} *</span>
            </label>
            {file ? (
                <div className="flex items-center justify-between p-4 bg-primary-50 border-2 border-primary-200 rounded-xl">
                    <div className="flex items-center">
                        <FiCheck className="w-5 h-5 text-primary-600 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => onDrop([])}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div>
                    <div
                        {...getRootProps({
                            className: `p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${isDragActive
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                                }`
                        })}
                    >
                        <input {...getInputProps()} />
                        <FiUpload className={`w-8 h-8 mx-auto mb-2 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
                        <p className="text-sm text-gray-600">
                            {isDragActive ? 'Drop file here' : 'Drag & drop or click to upload'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                    <button
                        type="button"
                        onClick={open}
                        className="mt-2 w-full py-2 px-4 text-sm text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-all"
                    >
                        Browse Files
                    </button>
                </div>
            )}
        </div>
    );
};

const Booking = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        requirement: '',
        preferredDate: '',
    });

    const [files, setFiles] = useState({
        aadhar: null,
        electricityBill: null,
        bankPassbook: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (fileType, acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFiles((prev) => ({ ...prev, [fileType]: acceptedFiles[0] }));
            toast.success(`${fileType === 'aadhar' ? 'Aadhar Card' : fileType === 'electricityBill' ? 'Electricity Bill' : 'Bank Passbook'} uploaded successfully`);
        } else {
            // Handle removal or empty
            setFiles((prev) => ({ ...prev, [fileType]: null }));
        }
    };

    const docConfig = {
        accept: {
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
        maxSize: 5 * 1024 * 1024,
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate files
        if (!files.aadhar || !files.electricityBill || !files.bankPassbook) {
            toast.error('Please upload all required documents');
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('address', formData.address);
            formDataToSend.append('requirement', formData.requirement);
            formDataToSend.append('preferredDate', formData.preferredDate);
            formDataToSend.append('aadhar', files.aadhar);
            formDataToSend.append('electricityBill', files.electricityBill);
            formDataToSend.append('bankPassbook', files.bankPassbook);

            await createBooking(formDataToSend);
            setIsSubmitted(true);
            toast.success('Booking submitted successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to submit booking');
        } finally {
            setIsSubmitting(false);
        }
    };



    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="container px-4 mx-auto max-w-2xl">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
                            <FiCheck className="w-10 h-10 text-primary-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
                        <p className="text-gray-600 mb-6">
                            Thank you for your booking. We have sent a confirmation email to{' '}
                            <strong>{formData.email}</strong>. Our team will contact you within 24 hours.
                        </p>
                        <div className="p-6 bg-primary-50 rounded-xl mb-8">
                            <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-left text-sm">
                                <div>
                                    <p className="text-gray-500">Name</p>
                                    <p className="font-medium">{formData.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Phone</p>
                                    <p className="font-medium">{formData.phone}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Requirement</p>
                                    <p className="font-medium">{formData.requirement}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Preferred Date</p>
                                    <p className="font-medium">{new Date(formData.preferredDate).toLocaleDateString('en-IN')}</p>
                                </div>
                            </div>
                        </div>
                        <Link to="/" className="btn-primary">
                            <FiArrowLeft className="w-5 h-5 mr-2" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container px-4 mx-auto max-w-4xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <Link
                        to="/"
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-all"
                    >
                        <FiArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Book Your Free Site Survey
                    </h1>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Fill in the details below and upload the required documents.
                        Our team will contact you within 24 hours.
                    </p>
                </div>

                {/* Booking Form */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                Personal Details
                            </h3>
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="input-label flex items-center">
                                        <FiUser className="w-4 h-4 mr-2" />
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="input-label flex items-center">
                                        <FiPhone className="w-4 h-4 mr-2" />
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        pattern="[0-9]{10}"
                                        className="input-field"
                                        placeholder="10-digit mobile number"
                                    />
                                </div>
                                <div>
                                    <label className="input-label flex items-center">
                                        <FiMail className="w-4 h-4 mr-2" />
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="input-label flex items-center">
                                        <FiCalendar className="w-4 h-4 mr-2" />
                                        Preferred Survey Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="preferredDate"
                                        value={formData.preferredDate}
                                        onChange={handleChange}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        className="input-field"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="input-label flex items-center">
                                        <FiMapPin className="w-4 h-4 mr-2" />
                                        Full Address *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        rows="2"
                                        className="input-field resize-none"
                                        placeholder="House/Building, Street, Area, City, PIN"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="input-label">Solar Requirement *</label>
                                    <select
                                        name="requirement"
                                        value={formData.requirement}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                    >
                                        <option value="">Select your requirement</option>
                                        <option value="3kW">3kW - Small Home (₹1,50,000 approx)</option>
                                        <option value="5kW">5kW - Medium Home (₹2,50,000 approx)</option>
                                        <option value="10kW">10kW - Large Home/Small Business (₹4,50,000 approx)</option>
                                        <option value="Commercial">Commercial - Above 10kW (Custom Quote)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Document Upload */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                                Required Documents
                            </h3>
                            <p className="text-sm text-gray-500 mb-5">
                                These documents are required for PM Surya Ghar subsidy registration.
                                Please upload clear copies.
                            </p>
                            <div className="grid md:grid-cols-3 gap-5">
                                <FileDropzone
                                    onDrop={(files) => handleFileChange('aadhar', files)}
                                    file={files.aadhar}
                                    fileType="aadhar"
                                    label="Aadhar Card"
                                    icon={<FiFile className="w-4 h-4" />}
                                    accept={docConfig.accept}
                                    maxSize={docConfig.maxSize}
                                />
                                <FileDropzone
                                    onDrop={(files) => handleFileChange('electricityBill', files)}
                                    file={files.electricityBill}
                                    fileType="electricityBill"
                                    label="Electricity Bill"
                                    icon={<FiFile className="w-4 h-4" />}
                                    accept={docConfig.accept}
                                    maxSize={docConfig.maxSize}
                                />
                                <FileDropzone
                                    onDrop={(files) => handleFileChange('bankPassbook', files)}
                                    file={files.bankPassbook}
                                    fileType="bankPassbook"
                                    label="Bank Passbook (Front Page)"
                                    icon={<FiFile className="w-4 h-4" />}
                                    accept={docConfig.accept}
                                    maxSize={docConfig.maxSize}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-primary text-lg py-4 disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting Booking...
                                    </span>
                                ) : (
                                    'Submit Booking Request'
                                )}
                            </button>
                            <p className="text-center text-sm text-gray-500 mt-4">
                                By submitting, you agree to be contacted regarding your solar installation inquiry.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Booking;
