/**
 * File containing custom Yup method tests
 * //getting it working with TS nicely
 * https://github.com/jquense/yup/issues/312
 */
// @ts-nocheck
//TODO: alot of errors regarding custom yup messages and @submit event

import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { addMethod, object, ref, string, StringSchema } from "yup";
import { emailExist, userNameExist } from "../middleware/db_helpers";

/**
 * checks whether string contains a digit
 */
addMethod(string, "hasDigits", function (this: StringSchema, message?: string) {
    return this.test("hasDigits", message || "Needs a digit!", (value) => {
        return new Promise((res, rej) => {
            res(/\d/.test(value as string));
        });
    });
});

/**
 * checks whether string contains an uppcase letter
 */
addMethod(string, "hasUppercase", function (this: StringSchema, message?: string) {
    return this.test("hasUppercase", message || "Needs a capital letter!", (value) => {
        return new Promise((res, rej) => {
            res(/[A-Z]/.test(value as string));
        });
    });
});

/**
 * checks whether string contains any special symbols
 */
addMethod(string, "hasSymbols", function (this: StringSchema, message?: string) {
    return this.test("hasSymbols", message || "Needs a symbol!", (value) => {
        return new Promise((res, rej) => {
            const regex = /[!@#$%^&*()/?<>{}|<>,.`~:;'"-+=[\]\\\_]/g;
            res(regex.test(value as string));
        });
    });
});

/**
 * checks if string is an unique username
 */
addMethod(string, "uniqueUsername", function (this: StringSchema, message?: string) {
    return this.test("uniqueUsername", message || "Needs to be unique!", (value) => {
        return new Promise((res, rej) => {
            userNameExist(value as string).then((result) => {
                res(!result);
            });
        });
    });
});

/**
 * checks if string is an unique email
 */
addMethod(string, "uniqueEmail", function (this: StringSchema, message?: string) {
    return this.test("uniqueEmail", message || "Needs to be unique!", (value) => {
        return new Promise((res, rej) => {
            emailExist(value as string).then((result) => {
                res(!result);
            });
        });
    });
});

/**
 * checks if string is an unique email
 */
addMethod(string, "usernameRules", function (this: StringSchema, message?: string) {
    return this.test(
        "usernameRules",
        message || "User name cant contain '&=_'-+,<>.' and must contain letters and/or numbers",
        (value) => {
            const passingRegex = /[a-zA-Z0-9]/g;
            const failingRegex = /[&=_'-+,<>.]/g;
            return new Promise((res, rej) => {
                res(!failingRegex.test(value as string) && passingRegex.test(value as string));
            });
        }
    );
});

/**
 * checks if string is an unique email or the same email
 * this is for the current user wanting to change emails
 */
addMethod(string, "uniqueEmailUpdate", function (this: StringSchema, message?: string) {
    return this.test("uniqueEmailUpdate", message || "Needs to be unique!", (value) => {
        return new Promise((res, rej) => {
            emailExist(value as string).then((result) => {
                const currentUserStore = useCurrentUserStore();
                res(!result || (currentUserStore.isSignedIn && currentUserStore.email === value));
            });
        });
    });
});

/**
 * checks if string is an unique username or the same username
 * this is for the current user wanting to change usernames
 */
addMethod(string, "uniqueUsernameUpdate", function (this: StringSchema, message?: string) {
    return this.test("uniqueUsernameUpdate", message || "Needs to be unique!", (value) => {
        return new Promise((res, rej) => {
            userNameExist(value as string).then((result) => {
                const currentUserStore = useCurrentUserStore();
                res(
                    !result || (currentUserStore.isSignedIn && currentUserStore.username === value)
                );
            });
        });
    });
});

/**
 * rule schema for registering
 */
const registerSchema = object({
    name: string().min(1, "You need a name!").required("This is required!"),
    username: string()
        .min(1, "You need a username!")
        .usernameRules()
        .uniqueUsername("This username is already taken!")
        .required("This is required!"),
    email: string()
        .email("This isnt a valid email!")
        .uniqueEmail("This email is already registered!")
        .required("This is required!"),
    password: string()
        .min(5, "This needs to be at least 5 characters long!")
        .hasDigits("Password needs at least 1 digit!")
        .hasUppercase("Password needs at least 1 uppercase letter!")
        .hasSymbols("Password needs at least 1 special symbol!")
        .required("This is required!"),
    verifyPassword: string()
        .oneOf([ref("password")], "Passwords must match!")
        .required("This is required!")
        .label("Password confirmation")
});

/**
 * rule schema for login
 * is not acutally used
 */
const loginSchema = object({
    email: string().email("Must be a valid email").required("Required!"),
    password: string().required("Required!")
});

/**
 * rules schema for editing profile
 */
const editProfileSchema = object({
    username: string()
        .min(1, "You need a username!")
        .usernameRules()
        .uniqueUsernameUpdate("This username is already taken!")
        .required("This is required"),
    name: string().min(1, "You need a name!").required("This is required!"),
    website: string().notRequired(),
    email: string()
        .email("This isnt a valid email!")
        .uniqueEmailUpdate("This email is already registered!")
        .required("This is required!")
});

export { registerSchema, loginSchema, editProfileSchema };
