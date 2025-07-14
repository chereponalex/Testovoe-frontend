const formatVisitDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return (
      date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }) +
      " " +
      date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } catch (e) {
    return "Некорректная дата";
  }
};

export default formatVisitDate;
