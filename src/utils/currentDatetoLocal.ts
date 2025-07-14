const getCurrentDateTimeLocal = (dateInput?: string | Date): string => {
  let date: Date;

  if (!dateInput) {
    date = new Date();
  } else if (typeof dateInput === "string") {
    date = new Date(dateInput);
  } else {
    date = dateInput;
  }

  if (isNaN(date.getTime())) {
    console.error("Invalid date provided to formatToDateTimeLocal:", dateInput);
    return "";
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default getCurrentDateTimeLocal;
