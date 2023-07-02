function invertArray(array, lineBreak = false) {
	const a = [];

	for (x = 0; x < array[0].length; x++) {
		const b = [];

		for (y = 0; y < array.length; y++) {
			b.push(array[y][x]);
		}

		if (lineBreak) {
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

	for (x = 0; x < xLength; x++) {
		const b = [];

		for (y = 0; y < yLength; y++) {
			values += array[x][y];
			index += 1;

			if (index == scale) {
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
