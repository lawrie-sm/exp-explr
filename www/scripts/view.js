const colsClass = 'cols';
const cellClass = 'cols--cell cols--cell__fullwidth';
const txtBoxClass = 'txtbox';
const portraitBoxClass = 'portrait-box';
const portraitImgClass = 'portrait-img';
const smallImgPath = '/img/portraits/';
const main = document.getElementsByTagName('main')[0];

//Code for building the HTML elements
const E = (tag, attrs = {}, text = '', ... children) => {

	const e = document.createElement(tag);
	
	if (attrs) {
		for (let key in attrs) {
			e.setAttribute(key, attrs[key]);
		}
	}

	if (text) {
		e.appendChild(document.createTextNode(text));
	}

	for (let i = 0; i < children.length; i++)
		{
			e.appendChild(children[i]);
		}

	return e;

};

const setupMSPComponentsInView = (mspList) => {
	
		mspList.forEach((m) => {
				
				
				
			let location;
			if (m.constit)
			{
				location = m.constit.name + ', ' + m.region.name;				
			}
			else {
				location = m.region.name;
			}
				
				
			let birthDate = '(Birth date not given)';
			if (m.DOB)
			{
				let d = m.DOB;
				birthDate = d.getDate() +
				'/' + (d.getMonth()+1) +
				'/' + d.getFullYear();
			}
			
			let imgSRC = m.photoURL;
			let imgAlt = m.firstName + ' portait';
			
			if (imgSRC) {
			
				let imgID = imgSRC.substring(imgSRC.lastIndexOf('/') + 1);
				imgID = imgID.replace(/\s+/g, '');
				imgSRC = smallImgPath + imgID + '.jpg';
				
			} else {
				imgSRC = '#';
			}
			
			let MSPComponent = E('div', { 'class': colsClass }, '',
			E('div', { 'class': cellClass }, '',
				E('div', { 'class': portraitBoxClass }, '',
					E('img', { 'class': portraitImgClass, 'src': imgSRC })),
				E('div', { 'class': txtBoxClass }, '',
					E('p', {}, m.firstName + ' ' + m.lastName),
					E('p', {}, birthDate),
					E('p', {}, location)
					),
				));

				
				main.appendChild(MSPComponent);

		});
	
	}