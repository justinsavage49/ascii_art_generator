document.addEventListener('DOMContentLoaded', main)

function main() {
	const asciiString1 = `¶@ØÆMåBNÊßÔR#8Q&mÃ0À$GXZA5ñk2S%±3Fz¢yÝCJf1t7ªLc¿+?(r/¤²!*;"^:,'.`;
	const asciiString2 = `╬╠╫╋║╉╩┣╦╂╳╇╈┠╚┃╃┻╅┳┡┢┹╀╧┱╙┗┞┇┸┋┯┰┖╲╱┎╘━┭┕┍┅╾│┬┉╰╭╸└┆╺┊─╌┄┈╴╶`;
	const ascii_output = document.getElementById("ascii_output");
	const image_input = document.getElementById("image_input");

	generatePhoto(image_input)
	.then((processedArray) => {
		arrayToAscii(asciiString1, processedArray, ascii_output);
	});
}


