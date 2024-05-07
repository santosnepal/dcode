import { IName } from '../interface/name.ts';

export const getFullName = (name: IName) => {
  if (!name?.middleName) {
    name.middleName = '';
  }
  return `${name.firstName} ${name.middleName} ${name.lastName}`.replace(/ /, '');
};

export function appendStringToEmail(input: string, appendStr: string) {
  // Split the email into username and domain parts
  const [username, domain] = input.split('@');

  // Append the specified string to the username
  const newUsername = username + appendStr;

  // Recreate the email address by combining the new username and the domain
  const output = newUsername + '@' + domain;

  return output;
}

export function getParentEmail(email?: string) {
  if (!email) return '';

  let atIndex = email.indexOf('@'); // Find the index of '@'
  let plusIndex = email.indexOf('+'); // Find the index of '+'

  // Extract the username and domain parts
  let username = email.substring(0, plusIndex != -1 ? plusIndex : atIndex);
  let domain = email.substring(atIndex);

  // Recreate the email address
  return username + domain;
}
