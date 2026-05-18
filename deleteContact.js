import { v7 as uuidv7, validate as validateUUID } from "uuid";
import { saveFile, loadFile } from "./contacts.js";
import validator from "validator";
import chalk from "chalk";

export default function removeData(data) {
  const isId = validateUUID(data);
  const isEmail = validator.isEmail(data);
  const isPhone = validator.isMobilePhone(data, "id-ID");

  if (!isId && !isEmail && !isPhone) {
    console.log(
      chalk.red.bold("Input data harus berupa ID, No HP, atau Email"),
    );
    return false;
  }

  try {
    const contacts = loadFile();

    const newContacts = contacts.filter((contact) => {
      return (
        contact.id !== data && contact.email !== data && contact.nohp !== data
      );
    });

    if (contacts.length === newContacts.length) {
      console.log(chalk.red.bold("Data tidak ditemukan"));
      return false;
    }

    saveFile(newContacts);
    console.log(chalk.green.bold("Data berhasil di hapus"));
  } catch (error) {
    console.log(
      "Ups, terjadi kesalahan sistem:",
      chalk.red.bold(error.message),
    );
  }
}
