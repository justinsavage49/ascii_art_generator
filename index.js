document.addEventListener('DOMContentLoaded', main)

function main() {
	const image_input = document.getElementById("image_input");
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	const pixelDataElement = document.getElementById("pixel_data");
	const masterScale = 100;
	
	const asciiString = `¶@ØÆMåBNÊßÔR#8Q&mÃ0À$GXZA5ñk2S%±3Fz¢yÝCJf1t7ªLc¿+?(r/¤²!*;"^:,'.`;

	//Alternative characters look better on lower contrast photos.
	// const asciiString = `╬╠╫╋║╉╩┣╦╂╳╇╈┠╚┃╃┻╅┳┡┢┹╀╧┱╙┗┞┇┸┋┯┰┖╲╱┎╘━┭┕┍┅╾│┬┉╰╭╸└┆╺┊─╌┄┈╴╶`;

	const asciiArray = asciiString.split("");
	asciiArray.reverse();
	const brightnessScale = 255 / (asciiArray.length - 1);
	
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
				const scaledArray = invertArray(yScaledArray, true);

				const getAsciiCharacter = function(brightness) {
					if(brightness === "\n") { 
						return brightness; 
					}
					const index = Math.floor(brightness / brightnessScale);
					
					return asciiArray[index];
				}
				
				const asciiOutput = [];
				for(x = 0; x< scaledArray.length; x++) {
					for(y = 0; y< scaledArray[0].length; y++) {
						asciiOutput.push(getAsciiCharacter(scaledArray[x][y]));
					}
				}
				
				pixelDataElement.textContent = asciiOutput.join("");
			};
			
			image.src = reader.result;
		};
		
		reader.readAsDataURL(file);
	}, false);
}


