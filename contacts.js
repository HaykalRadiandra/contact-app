// TODO: feature update

import * as fs from "node:fs";
import { v7 as uuidv7 } from "uuid";
import validator from "validator";
import { mySchema } from "./mySchema.js";
import chalk from "chalk";
import Table from "cli-table3";
import removeData from "./deleteContact.js";
import listDataDetail from "./detailContact.js";

// ================= PATH =================
const folderPath = new URL("./data", import.meta.url);
const filePath = new URL("./data/contacts.json", import.meta.url);

// ================= INIT =================
// * Check is there folder
if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
// * Check is there file
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]", "utf-8");
// * Validate JSON
try {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (!Array.isArray(data)) {
    throw new Error("Format harus Array");
  }
} catch {
  fs.writeFileSync(filePath, "[]", "utf-8");
}

// ================= HELPERS =================
export function loadFile() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function saveFile(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function capitalize(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : "-";
}

export function formatValue(val, formatFn) {
  if (formatFn) return formatFn(val);
  if (val === "" || !val) return "-";
  return val;
}

// ================= CREATE =================
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

// ================= LIST =================
export function listData() {
  const contacts = loadFile();

  if (contacts.length === 0) {
    console.log(chalk.red.inverse.bold("The data is not found"));
    return false;
  }

  const table = new Table({
    head: ["No", "Nama", "No HP", "Email", "..."],
    style: { head: ["cyan"] },
  });

  contacts.forEach((item, index) => {
    table.push([
      index + 1,
      capitalize(item.nama),
      item.nohp,
      item.email || "-",
      "...",
    ]);
  });

  console.log(table.toString());
}

// ================= DETAIL =================
export { listDataDetail };
// ================= DELETE =================
export { removeData };
