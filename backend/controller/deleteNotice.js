const NoticeModel = require("../models/noticeModel");

async function deleteNotice(req, res) {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Notice ID is required." });
        }

        const deletedNotice = await NoticeModel.findByIdAndDelete(id);

        if (!deletedNotice) {
            return res.status(404).json({ success: false, message: "Notice not found." });
        }

        res.json({ success: true, message: "Notice deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
}

module.exports = deleteNotice;
