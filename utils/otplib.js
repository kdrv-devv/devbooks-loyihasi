import { authenticator } from "otplib";
import dotenv from "dotenv";
dotenv.config();
const otplibSmsVerify = () => {
  authenticator.options = {
    step: 60,
  };
  const password = ({ email }) => {
    return authenticator.generate(process.env.SECRET_KEY + email);
  };
  const checkPassword = ({ token, secret }) => {
    return authenticator.check(token, secret);
  };
  return { password, checkPassword };
};

export default otplibSmsVerify;
