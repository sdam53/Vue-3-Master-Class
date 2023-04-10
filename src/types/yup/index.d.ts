import "yup";
declare module "yup" {
    interface StringSchema {
        hasDigits(): StringSchema;
        hasUppercase(): StringSchema;
        hasSymbols(): StringSchema;
        uniqueUsername(): StringSchema;
        uniqueEmail(): StringSchema;
        usernameRules(): StringSchema;
        uniqueEmailUpdate(): StringSchema;
        uniqueUsernameUpdate(): StringSchema;
        threadCreateAndEditSchema(): StringSchema;
        PostSchema(): StringSchema;
    }
}
