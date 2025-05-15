import React, { useState } from 'react';
import { IoClose, IoSave } from "react-icons/io5";
import { FaCloudUploadAlt, FaStickyNote, FaHeading } from 'react-icons/fa';
import { MdOutlineDelete } from "react-icons/md";
import uploadNoticeImage from '../helpers/uploadNoticeImage';
import DisplayImage from './DisplayImage';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const EditNotice = ({ onClose, noticeData, fetchdata }) => {
    const [data, setData] = useState({
        ...noticeData,
        topic: noticeData?.topic || '',
        noticeImage: noticeData?.noticeImage || [],
        description: noticeData?.description || '',
    });

    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleUploadNotice = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const uploadImageCloudinary = await uploadNoticeImage(file);
            setData(prev => ({
                ...prev,
                noticeImage: [...prev.noticeImage, uploadImageCloudinary.url],
            }));
        } catch (error) {
            toast.error("Failed to upload image");
        }
    };

    const handleDeleteNoticeImage = (index) => {
        const updatedImages = [...data.noticeImage];
        updatedImages.splice(index, 1);
        setData(prev => ({
            ...prev,
            noticeImage: updatedImages
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(SummaryApi.updateNotice.url, {
                method: SummaryApi.updateNotice.method,
                credentials: 'include',
                headers: { "content-type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success(result.message || "Notice updated successfully!");
                onClose();
                fetchdata();
            } else {
                toast.error(result.message || "Error updating notice");
            }
        } catch (error) {
            toast.error("An error occurred while updating the notice");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black h-full bg-opacity-50 z-50 flex items-center justify-center p-0 ">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden m-0">
                <div className="flex justify-between items-center border-b p-6 bg-white m-0">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center m-0">
                        <FaStickyNote className="mr-3 text-green-500" />
                        Edit General Notice
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-600 transition-colors p-1 m-0"
                        disabled={isSubmitting}
                    >
                        <IoClose className="text-2xl" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <FaHeading className="mr-2 text-green-500" />
                                    Topic
                                </label>
                                <input
                                    type="text"
                                    name="topic"
                                    value={data.topic}
                                    onChange={handleOnChange}
                                    placeholder="Enter topic"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <FaStickyNote className="mr-2 text-green-500" />
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={data.description}
                                    onChange={handleOnChange}
                                    placeholder="Enter description"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                    rows={5}
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <FaCloudUploadAlt className="mr-2 text-green-500" />
                                    Images
                                </label>
                                <label htmlFor="uploadimageInput" className="cursor-pointer">
                                    <div className="p-8 bg-slate-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center hover:bg-slate-50 transition-colors">
                                        <div className="text-slate-500 flex flex-col items-center gap-2">
                                            <FaCloudUploadAlt className="text-3xl" />
                                            <p className="text-sm">Click to upload images</p>
                                            <p className="text-xs text-gray-400">(JPEG, PNG, JPG)</p>
                                        </div>
                                        <input 
                                            type="file" 
                                            id="uploadimageInput" 
                                            className="hidden" 
                                            onChange={handleUploadNotice}
                                            accept="image/*"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </label>
                                
                                <div className="mt-4">
                                    {data.noticeImage.length > 0 ? (
                                        <div className="flex flex-wrap gap-4">
                                            {data.noticeImage.map((el, index) => (
                                                <div className="relative group" key={el + index}>
                                                    <img 
                                                        src={el}
                                                        alt={`notice-${index}`}
                                                        className="h-24 w-24 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                                                        onClick={() => {
                                                            setOpenFullScreenImage(true);
                                                            setFullScreenImage(el);
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute -top-2 -right-2 p-1 text-white bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                        onClick={() => handleDeleteNoticeImage(index)}
                                                        disabled={isSubmitting}
                                                    >
                                                        <MdOutlineDelete className="text-sm" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-blue-500 text-sm mt-2">*Please upload at least one image</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="border-t p-6 bg-white">
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                            disabled={isSubmitting || !data.noticeImage.length}
                        >
                            <IoSave className="mr-2" />
                            {isSubmitting ? 'Updating...' : 'Update Notice'}
                        </button>
                    </div>
                </div>
            </div>

            {openFullScreenImage && (
                <DisplayImage 
                    onClose={() => setOpenFullScreenImage(false)} 
                    imgUrl={fullScreenImage}
                />
            )}
        </div>
    );
};

export default EditNotice;