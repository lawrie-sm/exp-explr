/*This works for both date input and the SP internal dates
YYYY-MM-DD or YYYY-MM-DDT:00:00:00
*/
export const strToDate = (dateStr) => {
	let T = dateStr.indexOf('T');
	if (T != -1) {
		dateStr = dateStr.substring(0, T);
		dateStr = dateStr.replace(/\s+/g, '');
	}
	let dateArr = dateStr.split('-');
	let year = dateArr[0],
		month = dateArr[1],
		day = dateArr[2];
	return new Date(year, (month - 1), day);
};

export const dateToStr = (date) => {
  let year = date.getFullYear();

  let month = `${date.getMonth() + 1}`;
  month = (month.length < 2) ? '0' + month : month;

  let day = `${date.getDate()}`;
  day = (day.length < 2) ? '0' + day : day;

  let dateStr = `${year}-${month}-${day}`;
  return dateStr
}

export const replaceNewlines = (str) => {
	let r = str.replace(/(?:\\[rn])+/g, '. ');
	return r;
}