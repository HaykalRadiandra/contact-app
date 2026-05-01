import * as fs from "node:fs";
import { v7 as uuidv7 } from "uuid";
import validator from "validator";
import { mySchema } from "./mySchema.js";
import chalk from "chalk";
import Table from "cli-table3";

export function simpanContact(nama, email, nohp, role, isActive) {
  const contacts = loadFile();

  // * Validate nama
  if (!nama?.trim?.()) {
    console.log(chalk.red.bold("Nama wajib diisi"));
    return false;
  }

  // * Validate email
  if (email && !validator.isEmail(email)) {
    console.log(chalk.red.bold("Email tidak valid"));
    return false;
  }

  // * Validate email unique
  if (email && contacts.find((c) => c.email === email)) {
    console.log(chalk.red(`Email ${email} sudah ada`));
    return false;
  }

  // * Validate nohp
  if (nohp && !validator.isMobilePhone(nohp, "id-ID")) {
    console.log(chalk.red.bold("No HP tidak valid"));
    return false;
  }

  // * Validate nohp unique
  if (contacts.find((c) => c.nohp === nohp)) {
    console.log(chalk.red(`No HP ${nohp} sudah ada`));
    return false;
  }

  const contact = { id: uuidv7(), nama, email, nohp, role, isActive };

  // * Validate schema json
  if (!mySchema(contact)) return false;

  contacts.push(contact);
  saveFile(contacts);

  console.log(chalk.green.bold(`Berhasil menambahkan data untuk ${nama}`));
}
