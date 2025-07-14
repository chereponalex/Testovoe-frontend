const formatDateTime = (isoString: string | undefined): string => {
  if (!isoString) return "Не указано";
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return "Некорректная дата";
  }
};

export default formatDateTime;
