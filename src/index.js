import { scalePixels, invertArray,  grayscaleConversion, showCanvas } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", main);
const alternate_select = document.getElementById("alternate_select");
const image_input = document.getElementById("image_input");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const masterScale = 100;

let scaledArray = [];

const asciiPairs = [
	`¶@ØÆMåBNÊßÔR#8Q&mÃ0À$GXZA5ñk2S%±3Fz¢yÝCJf1t7ªLc¿+?(r/¤²!*;"^:,'.`,
	`╬╠╫╋║╉╩┣╦╂╳╇╈┠╚┃╃┻╅┳┡┢┹╀╧┱╙┗┞┇┸┋┯┰┖╲╱┎╘━┭┕┍┅╾│┬┉╰╭╸└┆╺┊─╌┄┈╴╶`,
];

localStorage.setItem("asciiString", asciiPairs[0]);

function main()
{
	image_input.addEventListener("click", async () => {
		scaledArray = [];

		const imageInput = await onImageInputAsync();
		const file = imageInput.target.files[0];

		await loadIntoCanvasAsync(file);

		showCanvas();
	});	

	alternate_select.addEventListener("change", () => {
		toggleAsciiString();
		showCanvas();
	});
}

function toggleAsciiString() {
	alternate_select.value = alternate_select.value === "on" ? "off" : "on";
	localStorage.setItem("asciiString", alternate_select.value === "on" ? asciiPairs[1] : asciiPairs[0]);
}

function onImageInputAsync()
{
	return new Promise((resolve) => {
		image_input.addEventListener("change", (imageInput) => {
			resolve(imageInput);
		}, false);
	});
}

function onReaderLoadAsync(file, reader)
{
	return new Promise((resolve) => {
		reader.onload = resolve;
		reader.readAsDataURL(file);
	});
}

function onImageLoadAsync(image, reader)
{
	return new Promise((resolve)=> {
		image.onload = resolve;
		image.src = reader.result;
	});
}

async function loadIntoCanvasAsync(file)
{
	const reader = new FileReader();
	await onReaderLoadAsync(file, reader);

	const image = new Image();
	await onImageLoadAsync(image, reader);

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

	// Scale the image down so we don't create ascii 1:1 with pixels
	for (let y = 0; y < canvas.height; y++)
	{
		const xPixels = [];

		for (let x = 0; x < canvas.width; x++)
		{
			const pixelIndex = (y * canvas.width + x) * 4;
			const r = pixelData[pixelIndex];
			xValues += r;
			xValueIndex += 1;

			if (xValueIndex == xScale)
			{
				const avgX = Math.floor(xValues / xValueIndex);
				xPixels.push(avgX);
				xValues = 0;
				xValueIndex = 0;
			}
			else if (xValueIndex + x >= canvas.width)
			{
				const avgX = Math.floor(xValues / xValueIndex);
				xPixels.push(avgX);
			}
		}

		xScaledArray.push(xPixels);
	}

	const yArray = invertArray(xScaledArray);
	const yScaledArray = scalePixels(yArray, yArray.length, yArray[0].length, canvas.width, masterScale * 0.45);
	scaledArray = invertArray(yScaledArray, true);

	localStorage.setItem("scaledArrayString", JSON.stringify(scaledArray));
}