/**
 * File containing custom Yup method tests
 * //getting it working with TS nicely
 * https://github.com/jquense/yup/issues/312
 */

import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import * as Yup from "yup";
import { emailExist, userNameExist } from "../middleware/db_helpers";

/**
 * checks whether string contains a digit
 */
Yup.addMethod(Yup.string, "hasDigits", function (this: Yup.StringSchema, message?: string) {
    return this.test("hasDigits", message || "Needs a digit!", (value) => {
        return new Promise((res, rej) => {
            res(/\d/.test(value as string));
        });
    });
});

/**
 * checks whether string contains an uppcase letter
 */
Yup.addMethod(Yup.string, "hasUppercase", function (this: Yup.StringSchema, message?: string) {
    return this.test("hasUppercase", message || "Needs a capital letter!", (value) => {
        return new Promise((res, rej) => {
            res(/[A-Z]/.test(value as string));
        });
    });
});

/**
 * checks whether string contains any special symbols
 */
Yup.addMethod(Yup.string, "hasSymbols", function (this: Yup.StringSchema, message?: string) {
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
Yup.addMethod(Yup.string, "uniqueUsername", function (this: Yup.StringSchema, message?: string) {
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
Yup.addMethod(Yup.string, "uniqueEmail", function (this: Yup.StringSchema, message?: string) {
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
Yup.addMethod(Yup.string, "usernameRules", function (this: Yup.StringSchema, message?: string) {
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
 * checks if string is an unique email
 * this is for the current user wanting to change emails
 */
Yup.addMethod(Yup.string, "uniqueEmailUpdate", function (this: Yup.StringSchema, message?: string) {
    return this.test("uniqueEmailUpdate", message || "Needs to be unique!", (value) => {
        return new Promise((res, rej) => {
            emailExist(value as string).then((result) => {
                const currentUserStore = useCurrentUserStore();
                res(!result || (currentUserStore.isSignedIn && currentUserStore.email === value));
            });
        });
    });
});

export { Yup };
