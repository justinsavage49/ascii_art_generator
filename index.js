document.addEventListener("DOMContentLoaded", main);
const alternate_select = document.getElementById("alternate_select");
const image_input = document.getElementById("image_input");

const asciiPairs = [
	`¶@ØÆMåBNÊßÔR#8Q&mÃ0À$GXZA5ñk2S%±3Fz¢yÝCJf1t7ªLc¿+?(r/¤²!*;"^:,'.`,
	`╬╠╫╋║╉╩┣╦╂╳╇╈┠╚┃╃┻╅┳┡┢┹╀╧┱╙┗┞┇┸┋┯┰┖╲╱┎╘━┭┕┍┅╾│┬┉╰╭╸└┆╺┊─╌┄┈╴╶`,
];

localStorage.setItem("asciiString", asciiPairs[0]);

function main() {
	image_input.addEventListener("click", () => {
		scaledArray = [];
	});

	readImage(localStorage.getItem("asciiString"))
	.then(() => {
		alternate_select.addEventListener("change", () => {
			toggleAscii();
			displayAscii();
		});
	});
}

function toggleAscii() {
	alternate_select.value = alternate_select.value === "on" ? "off" : "on";
	localStorage.setItem("asciiString", alternate_select.value === "on" ? asciiPairs[1] : asciiPairs[0]);
}

function readImage() {

	return new Promise((resolve) => {
		const canvas = document.getElementById("canvas");
		const ctx = canvas.getContext("2d");
		const masterScale = 100;

		image_input.addEventListener("change", (event) => {
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

						grayscaleConversion(pixelData);
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

								if (xValueIndex == xScale) {
									const avgX = Math.floor(xValues / xValueIndex);
									xPixels.push(avgX);
									xValues = 0;
									xValueIndex = 0;
								} else if (xValueIndex + x >= canvas.width) {
									const avgX = Math.floor(xValues / xValueIndex);
									xPixels.push(avgX);
								}
							}

							xScaledArray.push(xPixels);
						}

						const yArray = invertArray(xScaledArray);
						const yScaledArray = scalePixels(yArray, yArray.length, yArray[0].length, canvas.width, masterScale * 0.45);
						scaledArray = invertArray(yScaledArray, true);
		
						localStorage.setItem('scaledArrayString', JSON.stringify(scaledArray));

						displayAscii();
						resolve();
					};

					image.src = reader.result;
				};

				reader.readAsDataURL(file);
			}, false);
	});
}