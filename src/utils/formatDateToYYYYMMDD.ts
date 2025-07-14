const formatDateToYYYYMMDD = (isoString: string): string => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error("Failed to format date to YYYY-MM-DD:", e);
    return "";
  }
};

export default formatDateToYYYYMMDD;
