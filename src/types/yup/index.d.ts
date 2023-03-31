import "yup";
declare module "yup" {
    interface StringSchema {
        hasDigits(): StringSchema;
        hasUppercase(): StringSchema;
        hasSymbols(): StringSchema;
        uniqueUsername(): StringSchema;
        uniqueEmail(): StringSchema;
    }
}