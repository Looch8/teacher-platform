export const enterFullScreen = () => {
	const el = document.documentElement; // Fullscreen whole page
	if (el.requestFullscreen) {
		el.requestFullscreen();
	} else if (el.webkitRequestFullscreen) {
		// Safari
		el.webkitRequestFullscreen();
	} else if (el.mozRequestFullScreen) {
		el.mozRequestFullScreen();
	} else if (el.msRequestFullscreen) {
		// IE/Edge
		el.msRequestFullscreen();
	}
};

export const exitFullScreen = () => {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		// Safari
		document.webkitExitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.msExitFullscreen) {
		// IE/Edge
		document.msExitFullscreen();
	}
};
