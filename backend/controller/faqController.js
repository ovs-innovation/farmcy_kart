const Faq = require("../models/Faq");

const sanitizePayload = (body = {}) => {
  const payload = {
    type: ["qa", "video"].includes(body.type) ? body.type : "qa",
    question: body.question?.trim(),
    answer: body.answer?.trim(),
    videoUrl: body.videoUrl?.trim() || "",
    chatLink: body.chatLink?.trim() || "",
    status: body.status || "published",
  };

  if (body.sortOrder !== undefined && body.sortOrder !== null) {
    const sortValue = Number(body.sortOrder);
    payload.sortOrder = Number.isNaN(sortValue) ? 0 : sortValue;
  }

  return payload;
};

const createFaq = async (req, res) => {
  try {
    const payload = sanitizePayload(req.body);

    if (!payload.question) {
      return res.status(400).send({ message: "Question is required." });
    }

    if (payload.type === "qa" && !payload.answer) {
      return res
        .status(400)
        .send({ message: "Answer is required for FAQ entries." });
    }

    if (payload.type === "video" && !payload.videoUrl) {
      return res
        .status(400)
        .send({ message: "Video URL is required for video resources." });
    }

    const faq = await Faq.create(payload);
    res.status(201).send({ message: "FAQ created successfully", faq });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getPublicFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({ status: "published" })
      .sort({ createdAt: -1 })
      .lean();
    res.send(faqs);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({})
      .sort({ createdAt: -1 })
      .lean();
    res.send(faqs);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).send({ message: "FAQ not found" });
    }
    res.send(faq);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updateFaq = async (req, res) => {
  try {
    const payload = sanitizePayload(req.body);

    if (!payload.question) {
      return res.status(400).send({ message: "Question is required." });
    }

    if (payload.type === "qa" && !payload.answer) {
      return res
        .status(400)
        .send({ message: "Answer is required for FAQ entries." });
    }

    if (payload.type === "video" && !payload.videoUrl) {
      return res
        .status(400)
        .send({ message: "Video URL is required for video resources." });
    }

    const faq = await Faq.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });

    if (!faq) {
      return res.status(404).send({ message: "FAQ not found" });
    }

    res.send({ message: "FAQ updated successfully", faq });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).send({ message: "FAQ not found" });
    }
    res.send({ message: "FAQ deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  createFaq,
  getPublicFaqs,
  getAllFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
};


