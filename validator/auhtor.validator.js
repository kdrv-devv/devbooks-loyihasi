import Joi from "joi";

export const authorValidatorSchema = Joi.object({
  first_name: Joi.string().required().min(3),
  last_name: Joi.string().required().min(3),
  date_of_birth: Joi.string().required(),
  date_of_deeth: Joi.string().required(),
  country: Joi.string().required(),
  bio: Joi.string().required().min(20),
  creativity: Joi.string().required().min(10),
  image: Joi.string().required(),
  category: Joi.string().required(),
});
