export {};
const userName: string = "Alice";
const dateOfBirth: string | Date = new Date("1995-06-15");
const phoneNumber: string | number = "+380501234567";
const optionalNote: string | null | undefined = null;

const printUserInfo = (
  name: string,
  dob?: string | Date,
  phone?: string | number,
  note?: string | null | undefined
): void => {
  const dobStr = dob instanceof Date ? dob.toISOString().slice(0, 10) : dob ?? "(not provided)";
  const phoneStr = phone ?? "(not provided)";
  const noteStr = note ?? "(none)";

  console.log("User Info:");
  console.log(`- Name: ${name}`);
  console.log(`- Date of Birth: ${dobStr}`);
  console.log(`- Phone: ${phoneStr}`);
  console.log(`- Note: ${noteStr}`);
};

printUserInfo(userName, dateOfBirth, phoneNumber, optionalNote);
