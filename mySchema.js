import Ajv from "ajv";
import addFormats from "ajv-formats";
import chalk from "chalk";
import ajvErrors from "ajv-errors";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
ajvErrors(ajv);

export function mySchema(data) {
  const schema = {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      nama: { type: "string" },
      email: { type: "string", format: "email" },
      nohp: { type: "string", pattern: "^08[0-9]{8,13}$" },
      role: { type: "string", enum: ["dosen", "mahasiswa"] },
      isActive: { type: "boolean" },
    },
    required: ["id", "nama", "nohp", "isActive"],
    additionalProperties: false,
    errorMessage: {
      properties: {
        email: "Waduh, format emailnya nggak bener tuh, Bro!",
        nohp: "Waduh, format nohp nggak bener tuh, Bro!",
      },
    },
  };

  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    console.log(chalk.bold.red.inverse(validate.errors[0].message));
    return false;
  } else {
    return data;
  }
}
