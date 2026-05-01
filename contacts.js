// TODO: feature update

import * as fs from "node:fs";
import { v7 as uuidv7 } from "uuid";
import validator from "validator";
import { mySchema } from "./mySchema.js";
import chalk from "chalk";
import Table from "cli-table3";

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
function loadFile() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function saveFile(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function capitalize(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : "-";
}

function formatValue(val, formatFn) {
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
export function listDataDetail(keyword) {
  const contacts = loadFile();

  const columns = [
    { key: "id", label: "ID" },
    { key: "nama", label: "Nama", format: capitalize },
    { key: "nohp", label: "No HP" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", format: capitalize },
    {
      key: "isActive",
      label: "Active",
      format: (val) => (val ? "Iya" : "Tidak"),
    },
  ];

  const result = contacts.find((c) => {
    return c.nohp === keyword || c.email === keyword;
  });

  if (!result) {
    console.log(chalk.red("Harus input email / no HP"));
    return false;
  }

  const table = new Table({
    head: [...columns.map((c) => c.label)],
    style: { head: ["cyan"] },
  });

  table.push(columns.map((c) => formatValue(result[c.key], c.format)));

  console.log(table.toString());
}

// ================= DELETE =================
export function removeData(data) {
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
}
