import {object, string} from "yup";
import {validator} from "../../../Core/Helper/Validator";

const LoginValidation = validator<{
    email?: string | undefined,
    password?: string | undefined,
}>({
    schema: object({
        email: string().required().email(),
        password: string().required().max(64)
    }),
});
export default LoginValidation;