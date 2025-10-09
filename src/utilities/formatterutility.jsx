import { TbCurrencyNaira } from "react-icons/tb"

export const formatterUtility = (amount, noSign=false) => {
    const sign = noSign ? "" : "₦";
    return `${sign}${Number(amount).toLocaleString()}`;
}


export const formatISODateToCustom = (isoString) => {
    if (!isoString) {
        return '';
    }

    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12';

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}${ampm}`;
};

export function formatDateToStyle(isoString) {
  const date = new Date(isoString);

  const options = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
}



export function formatTransactionType(input, capitalize = false) {
  let formatted = input.replace(/_/g, ' ');

  if (capitalize) {
    formatted = formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return formatted;
}


export const formatISODateToReadable = (dateInput) => {
  if (!dateInput) return "-";
  const date = new Date(dateInput);

  return date.toLocaleDateString("en-US", {
    weekday: "short", // Wed
    year: "numeric",  // 2025
    month: "short",   // Sep
    day: "numeric"    // 3
  });
};
