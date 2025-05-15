import React, { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import EditNotice from "./EditNotice";
import ROLE from "../common/role";
import { useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const GeneralNotice = ({ data, fetchdata }) => {
    const [editNotice, setEditNotice] = useState(false);
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state?.user?.user);

    const handleDelete = async () => {
        toast.info(
            <div className="p-4 max-w-md">
                <p className="text-gray-800 font-medium text-lg mb-4">Are you sure you want to delete this notice?</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={async () => {
                            setLoading(true);
                            try {
                                const response = await fetch(SummaryApi.deleteNotice.url, {
                                    method: SummaryApi.deleteNotice.method,
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ id: data._id }),
                                });

                                const result = await response.json();
                                if (result.success) {
                                    toast.success("Notice deleted successfully!");
                                    fetchdata();
                                } else {
                                    toast.error(result.message || "Failed to delete notice!");
                                }
                            } catch (error) {
                                toast.error("Error deleting notice!");
                            } finally {
                                setLoading(false);
                                toast.dismiss();
                            }
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss();
                            toast.info("Deletion canceled");
                        }}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors duration-200 shadow-md"
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                className: "shadow-xl rounded-xl"
            }
        );
    };

    return (
        <>
            <motion.div 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 mb-6 mx-auto w-full max-w-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex flex-col space-y-4">
                    <h1 className="font-bold text-2xl text-gray-800">{data?.topic}</h1>
                    
                    {data?.noticeImage?.length > 0 && (
                        <div className="flex justify-center my-2">
                            <motion.img 
                                src={data?.noticeImage[0]} 
                                alt="Notice" 
                                className="rounded-lg shadow-sm max-h-80 object-contain border border-gray-100"
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.2 }}
                            />
                        </div>
                    )}
                    
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{data?.description}</p>

                    {(user?.role === ROLE.ADMIN || user?.role === ROLE.DOCTOR) && (
                        <div className="flex justify-end space-x-4 mt-4">
                            <motion.button
                                className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full text-white cursor-pointer shadow-md"
                                onClick={() => setEditNotice(true)}
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <MdEdit size={20} />
                            </motion.button>

                            <motion.button
                                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all shadow-md"
                                onClick={handleDelete}
                                disabled={loading}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                {loading ? (
                                    <span className="text-sm">Deleting...</span>
                                ) : (
                                    <MdDelete size={20} />
                                )}
                            </motion.button>
                        </div>
                    )}
                </div>
            </motion.div>

            {editNotice && (
                <EditNotice 
                    noticeData={data} 
                    onClose={() => setEditNotice(false)} 
                    fetchdata={fetchdata} 
                />
            )}
        </>
    );
};

export default GeneralNotice;