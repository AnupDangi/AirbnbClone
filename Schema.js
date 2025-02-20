//using Schema Validation
const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        country: Joi.string().required(),
        location: Joi.string().required(),
        image:Joi.string().allow("").optional(),
    }).required()
});

const reviewsSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
});

module.exports = { listingSchema,reviewsSchema };  // Ensure only this is exported
