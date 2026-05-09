const Testimonial = require("../models/Testimonial");

const sanitizePayload = (body = {}) => {
  const payload = {
    title: body.title?.trim(),
    video: body.video?.trim() || "",
    status: body.status || "published",
  };

  if (body.sortOrder !== undefined && body.sortOrder !== null) {
    const sortValue = Number(body.sortOrder);
    payload.sortOrder = Number.isNaN(sortValue) ? 0 : sortValue;
  }

  return payload;
};

const createTestimonial = async (req, res) => {
  try {
    const payload = sanitizePayload(req.body);

    if (!payload.title) {
      return res.status(400).send({ message: "Title is required." });
    }

    if (!payload.video) {
      return res.status(400).send({ message: "YouTube video URL is required." });
    }

    // Validate YouTube URL format (including Shorts)
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]+/;
    if (!youtubeRegex.test(payload.video)) {
      return res.status(400).send({ message: "Please provide a valid YouTube video URL." });
    }

    const testimonial = await Testimonial.create(payload);
    res.status(201).send({ message: "Testimonial created successfully", testimonial });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getPublicTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: "published" })
      .sort({ createdAt: -1 })
      .lean();
    res.send(testimonials);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({})
      .sort({ createdAt: -1 })
      .lean();
    res.send(testimonials);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).send({ message: "Testimonial not found" });
    }
    res.send(testimonial);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const payload = sanitizePayload(req.body);

    if (!payload.title) {
      return res.status(400).send({ message: "Title is required." });
    }

    if (!payload.video) {
      return res.status(400).send({ message: "YouTube video URL is required." });
    }

    // Validate YouTube URL format (including Shorts)
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]+/;
    if (!youtubeRegex.test(payload.video)) {
      return res.status(400).send({ message: "Please provide a valid YouTube video URL." });
    }

    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });

    if (!testimonial) {
      return res.status(404).send({ message: "Testimonial not found" });
    }

    res.send({ message: "Testimonial updated successfully", testimonial });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).send({ message: "Testimonial not found" });
    }
    res.send({ message: "Testimonial deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  createTestimonial,
  getPublicTestimonials,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
};

