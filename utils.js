function generatePhoto(inputElement) {

	return new Promise((resolve) => {
		const canvas = document.getElementById("canvas");
		const ctx = canvas.getContext("2d");
		const masterScale = 100;
		
		inputElement.addEventListener("change", (event) => {
			const file = event.target.files[0];
			const reader = new FileReader();
			
			reader.onload = function () {
				const image = new Image();
				
				image.onload = function () {
					canvas.width = image.width;
					canvas.height = image.height;
					
					ctx.drawImage(image, 0, 0, image.width, image.height);
					
					const imageData = ctx.getImageData(0, 0, image.width, image.height);
					const pixelData = imageData.data;
					
					grayscaleConversion(pixelData)     
					ctx.putImageData(imageData, 0, 0);
					
					let xScale = Math.round(canvas.width / masterScale);
					let xValues = 0;
					let xValueIndex = 0;
					const xScaledArray = [];
					
					for (let y = 0; y < canvas.height; y++) {
						const xPixels = [];
						
						for (let x = 0; x < canvas.width; x++) {
							const pixelIndex = (y * canvas.width + x) * 4;
							const r = pixelData[pixelIndex];
							xValues += r;
							xValueIndex += 1;
							
							if(xValueIndex == xScale) {
								const avgX = Math.floor(xValues / xValueIndex);
								xPixels.push(avgX);
								xValues = 0;
								xValueIndex = 0;
							}
							else if (xValueIndex + x >= canvas.width) {
								const avgX = Math.floor(xValues / xValueIndex);
								xPixels.push(avgX);
							}
						}
						
						xScaledArray.push(xPixels);
					}

					const yArray = invertArray(xScaledArray);
					const yScaledArray = scalePixels(yArray, yArray.length, yArray[0].length, canvas.width, masterScale * .45);

					resolve(invertArray(yScaledArray, true));
				};
				
				image.src = reader.result;
			};
			
			reader.readAsDataURL(file);
		}, false);
	});
}

function invertArray(array, lineBreak=false) {
	const a = [];

	for(x = 0; x < array[0].length; x++) {
		const b = [];

		for(y = 0; y < array.length; y++) {
			b.push(array[y][x]);
		}

		if(lineBreak) { 
			b.push("\n"); 
		}
		
		a.push(b);
	}

	return a;
}

function scalePixels(array, xLength, yLength, dimension, masterScale) {
	const scale = Math.round(dimension / masterScale);
	let values = 0;
	let index = 0;
	const a = [];

	for(x = 0; x < xLength; x++) {
		const b = [];
		
		for(y = 0; y < yLength; y++) {
			values += array[x][y];
			index += 1;

			if(index == scale) {
				const avg = Math.floor(values / index);
				b.push(avg);
				values = 0;
				index = 0;
			}
			// Adds closer scale but distorts image during y scaling. 
			// else if (index + y >= yLength) {
			// 	const avg = Math.floor(values / index);
			// 	b.push(avg);
			// }
		}

		a.push(b);
	}

	return a;
}

function grayscaleConversion(pixelData) {
	for (let i = 0; i < pixelData.length; i += 4) {
		const r = pixelData[i];
		const g = pixelData[i + 1];
		const b = pixelData[i + 2];

		const grayscale = 0.2989 * r + 0.587 * g + 0.114 * b;

		pixelData[i] = grayscale;
		pixelData[i + 1] = grayscale;
		pixelData[i + 2] = grayscale;
	}
}	

function arrayToAscii(asciiString, processedArray, htmlOutput) {
	const asciiArray = asciiString.split("");
	asciiArray.reverse();
	const brightnessScale = 255 / (asciiArray.length - 1);

	const getAsciiCharacter = function(brightness) {
		if(brightness === "\n") { 
			return brightness; 
		}
		const index = Math.floor(brightness / brightnessScale);
		
		return asciiArray[index];
	}

	const asciiOutput = [];
	for(x = 0; x < processedArray.length; x++) {
		for(y = 0; y < processedArray[0].length; y++) {
			asciiOutput.push(getAsciiCharacter(processedArray[x][y]));
		}
	}

	htmlOutput.textContent = asciiOutput.join("");
}