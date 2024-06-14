export const formatDateTime = (dateTime: string): string => {
  if (dateTime == '') return '';

  const currentDate = new Date();
  const date = new Date(dateTime);
  const timeDifference = currentDate.getTime() - date.getTime();
  const secondsDifference = timeDifference / 1000;
  const minutesDifference = secondsDifference / 60;
  const hoursDifference = minutesDifference / 60;
  const daysDifference = hoursDifference / 24;

  if (hoursDifference < 1) {
    return `${Math.round(minutesDifference)}p`;
  } else if (hoursDifference < 24) {
    return `${Math.round(hoursDifference)} giờ`;
  } else if (daysDifference < 7) {
    return `${Math.round(daysDifference)} ngày`;
  } else {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('vi-VN', options);
  }
}

export const formatDateTime2 = (dateTime: string) => {
  const date = new Date(dateTime);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return date.toLocaleDateString('vi-VN', options);
}